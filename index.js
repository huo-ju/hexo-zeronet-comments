const config = hexo.config;
const zerocomments= hexo.config.zerocomments;

var fs = require('hexo-fs');
var path = require('path');
var md5= require('md5');

hexo.extend.generator.register('after_init', function(){
  return [
    {
    path: 'comments.js',
    data: function(){
      return fs.createReadStream(path.resolve(__dirname, 'lib/comments.js'));
      }
    },
    {
    path: 'comments.css',
    data: function(){
      return fs.createReadStream(path.resolve(__dirname, 'lib/comments.css'));
      }
    },
    {
    path: 'utils.js',
    data: function(){
      return fs.createReadStream(path.resolve(__dirname, 'lib/utils.js'));
      }
    },
    {
    path: 'ZeroFrame.js',
    data: function(){
      return fs.createReadStream(path.resolve(__dirname, 'vendor/ZeroFrame.js'));
      }
    },
    {
    path: 'jquery-3.2.1.min.js',
    data: function(){
      return fs.createReadStream(path.resolve(__dirname, 'vendor/jquery-3.2.1.min.js'));
      }
    },
    {
    path: 'marked.min.js',
    data: function(){
      return fs.createReadStream(path.resolve(__dirname, 'vendor/marked.min.js'));
      }
    }
  ];
});

hexo.extend.helper.register('zeronet_comments_html', function(){
 return `<h2 id="Comments">0 Comments:</h2>
  <!-- New comment -->
  <div class="comment comment-new">
   <div class="info">
    <a class="user_name certselect" href="#Change+user" title='Change user'>Please sign in</a>
    &#9473;
    <span class="added">new comment</span>
   </div>
   <div class="comment-body">
    <a class="button button-submit button-certselect certselect" href="#Change+user"><div class='icon-profile'></div>Sign in as...</a>
    <textarea class="comment-textarea"></textarea>
    <a href="#Submit+comment" class="button button-submit button-submit-comment">Submit comment</a>
    <div style='float: right; margin-top: -6px'>
     <div class="user-size user-size-used"></div>
     <div class="user-size"></div>
    </div>
    <div style="clear: both"></div>
   </div>
  </div>
  <!-- EOF New comment -->
  <div class="comments">
   <!-- Template: Comment -->
   <div class="comment template">
    <div class="info">
     <span class="user_name">user_name</span>
     <!--<span class="cert_domain"></span>-->
     &#9473;
     <span class="added">1 day ago</span>
     <a href="#Reply" class="reply"><div class="icon icon-reply"></div> <span class="reply-text">Reply</span></a>                                                                                                                           
    </div>
    <div class="comment-body">Body</div>
   </div>
   <!-- EOF Template: Comment -->
  </div>`;  
});

hexo.extend.helper.register('zeronet_comments', function(url){
  let prefix= config.url+config.root;
  let content = ``;

  let zeroframe = `<script type="text/javascript" src="${config.root}ZeroFrame.js"></script>`;
  let jquery = `<script type="text/javascript" src="${config.root}jquery-3.2.1.min.js"></script>`;
  let marked = `<script type="text/javascript" src="${config.root}marked.min.js"></script>`;
  let utils = `<script type="text/javascript" src="${config.root}utils.js"></script>`;
  let comments= `<script type="text/javascript" src="${config.root}comments.js"></script>`;
  let commentscss= `<link rel="stylesheet" type="text/css" href="${config.root}comments.css">`;
  let urlhash = md5(url);
  let post_id = `<script>var post_id="${urlhash}"</script>`;   

  let include = ` ${post_id} \n ${commentscss} \n ${zeroframe} \n ${jquery} \n ${marked} \n ${utils} \n ${comments}`;

  return include;
});
