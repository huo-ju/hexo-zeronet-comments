class ZeroComments extends ZeroFrame {
    init() {
      var _this=this;
      $(".certselect").click(function(){
        _this.selectUser();
      });
      $(".button-submit-comment").click(function(){
        _this.submitComment();
      });
    }

    writePublish (data_inner_path, content_inner_path, data, cb) { 
      this.cmd("fileWrite", [data_inner_path, btoa(data)], (res) => {
        if (res == "ok") {
          this.cmd("siteSign", {"inner_path": content_inner_path}, (res) => {
            if (res == "ok") {
              this.cmd("sitePublish", {"inner_path": content_inner_path}, (res) => {
                if (res == "ok")
                  cb(true);
                else
                  cb(res);
              });
            }else
              cb(res);
          });
        } else {
            this.cmd("wrapperNotification", ["error", "File write error: #{res}"]);
            cb(false);
        }
      })
    }

    buttonReply (elem) {
      var body_add, elem_quote, post_id, user_name;
      this.log("Reply to", elem);
      user_name = $(".user_name", elem).text();
      post_id = elem.attr("id");
      body_add = "> [" + user_name + "](\#" + post_id + "): ";
      elem_quote = $(".comment-body", elem).clone();
      $("blockquote", elem_quote).remove();
      body_add += elem_quote.text().trim("\n").replace(/\n/g, "\n> ");
      body_add += "\n\n";
      $(".comment-new .comment-textarea").val($(".comment-new .comment-textarea").val() + body_add);
      $(".comment-new .comment-textarea").trigger("input").focus();
      return false;
    };  


    loadComments (_type, cb) { 
      var _this = this;
      var type = "show";
      var query = "SELECT comment.*, json_content.json_id AS content_json_id, keyvalue.value AS cert_user_id, json.directory, (SELECT COUNT(*) FROM comment_vote WHERE comment_vote.comment_uri = comment.comment_id || '@' || json.directory)+1 AS votes FROM comment LEFT JOIN json USING (json_id) LEFT JOIN json AS json_content ON (json_content.directory = json.directory AND json_content.file_name='content.json') LEFT JOIN keyvalue ON (keyvalue.json_id = json_content.json_id AND key = 'cert_user_id') WHERE post_id = '"+post_id+"' ORDER BY date_added DESC";

      this.cmd("dbQuery", query, (comments) => {
        var comment_text = " Comment:";
        if (comments.length > 1) 
          comment_text = " Comments:";
        $("#Comments").text(comments.length + comment_text);
        for (var i=0; i < comments.length; i++) {
          var comment = comments[i];
          var user_address = comment.directory.replace("users/", "");
          var comment_address = comment.comment_id+"_"+user_address;
          var elem = $("#comment_"+comment_address);
          if (elem.length == 0){
            elem = $(".comment.template").clone().removeClass("template").attr("id", "comment_"+comment_address).data("post_id", post_id);
            if (type != "noanim")
              elem.slideDown();
            $(".reply", elem).click(function(e){
              return _this.buttonReply($(e.target).parents(".comment"));
            });
          }
          this.applyCommentData(elem, comment);
          elem.appendTo(".comments");
        }
      })
  }

  applyCommentData (elem, comment) {
    var idarr= comment.cert_user_id.split("@");
    var user_name = idarr[0];
    var cert_domain = idarr[1];
    var user_address = comment.directory.replace("users/", "")
    $(".comment-body", elem).html(Text.renderMarked(comment.body, {"sanitize": true}));
    $(".user_name", elem).text(user_name).css("color", Text.toColor(comment.cert_user_id)).attr("title", user_name+"@"+cert_domain+" : "+user_address);
    $(".added", elem).text(Time.since(comment.date_added)).attr("title", Time.date(comment.date_added, "long"));
    if (user_address == this.site_info.auth_address){
      $(elem).attr("data-object", "Comment:"+comment.comment_id).attr("data-deletable", "yes");
      $(".comment-body", elem).attr("data-editable", "body").data("content", comment.body);
    }
  }

  submitComment(){
      var _this=this;
      if(!this.site_info.cert_user_id){
        this.cmd("wrapperNotification", ["info", "Please, select your account."])
          return false
      } else {
        var body = $(".comment-new .comment-textarea").val()
        if ( $(".comment-new .comment-textarea").val() == "" ){
          $(".comment-new .comment-textarea").focus()
          return false
        }
        $(".comment-new .button-submit").addClass("loading");
        var data_inner_path = "data/users/" + this.site_info.auth_address + "/data.json";
        var content_inner_path = "data/users/" + this.site_info.auth_address + "/content.json"

        this.cmd("fileGet", {"inner_path": data_inner_path, "required": false}, (data) => {
          if (data)
            data = JSON.parse(data);
          else 
            data = {"next_comment_id": 1, "comment": [], "comment_vote": {}, "topic_vote": {} };

          data.comment.push ({
            "comment_id": data.next_comment_id,
            "body": body,
            "post_id": post_id,
            "date_added": Date.now()
          });
          data.next_comment_id += 1;
          var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')));
          this.writePublish (data_inner_path, content_inner_path, json_raw, (res) => {
            $(".comment-new .button-submit").removeClass("loading");
            _this.loadComments();
            setTimeout(function() {
              _this.loadComments()
            }, 1000);
  
            _this.checkCert(function(){ });
            if (res != false)
              $(".comment-new .comment-textarea").val("");
          });
  
        });

      }
      return false;
    }

    selectUser () {
        this.cmd("certSelect", {accepted_domains: ["zeroid.bit"]});
        return false;
    }
    
    setCertStatus(site_info){
      $(".comment-new").removeClass("comment-nocert");
      $(".comment-new .user_name").text(site_info.cert_user_id);
      $(".button.button-certselect").hide();
    }
    
    setNoCertStatus(){
      $(".comment-new").addClass("comment-nocert");
      $(".comment-new .user_name").text("Please sign in");
      $(".button.button-certselect").show();
    }

    checkCert( cb) {
      this.cmd("siteInfo", {}, (site_info) => {
        if (site_info.cert_user_id){
          this.site_info = site_info
          this.setCertStatus(site_info);
        } else{
          this.setNoCertStatus();
        }
      })
      cb();
    }

    onRequest (cmd, message) {
        if (cmd == "setSiteInfo") {
            if (message.params.cert_user_id){
              this.setCertStatus(message.params);
            }else{
              this.setNoCertStatus();
            }
            this.site_info = message.params;
        }
    }

    onOpenWebsocket () {
      var _this=this;
      this.checkCert(function(){
        _this.loadComments("noanim", function(){});
      });
    }
}

page = new ZeroComments();
