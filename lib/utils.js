(function() {
  var Renderer, Text,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Renderer = (function(_super) {
    __extends(Renderer, _super);

    function Renderer() {
      return Renderer.__super__.constructor.apply(this, arguments);
    }

    Renderer.prototype.image = function(href, title, text) {
      return "<code>![" + text + "](" + href + ")</code>";
    };

    return Renderer;

  })(marked.Renderer);

  Text = (function() {
    function Text() {
      this.toUrl = __bind(this.toUrl, this);
    }

    Text.prototype.toColor = function(text) {
      var color, hash, i, _i, _ref;
      hash = 0;
      for (i = _i = 0, _ref = text.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }
      color = '#';
      return "hsl(" + (hash % 360) + ",30%,50%)";
    };

    Text.prototype.renderMarked = function(text, options) {
      if (options == null) {
        options = {};
      }
      options["gfm"] = true;
      options["breaks"] = true;
      if (options.sanitize) {
        options["renderer"] = renderer;
      }
      text = marked(text, options);
      return this.fixHtmlLinks(text);
    };

    Text.prototype.fixHtmlLinks = function(text) {
      if (window.is_proxy) {
        return text.replace(/href="http:\/\/(127.0.0.1|localhost):43110/g, 'href="http://zero');
      } else {
        return text.replace(/href="http:\/\/(127.0.0.1|localhost):43110/g, 'href="');
      }
    };

    Text.prototype.fixLink = function(link) {
      if (window.is_proxy) {
        return link.replace(/http:\/\/(127.0.0.1|localhost):43110/, 'http://zero');
      } else {
        return link.replace(/http:\/\/(127.0.0.1|localhost):43110/, '');
      }
    };

    Text.prototype.toUrl = function(text) {
      return text.replace(/[^A-Za-z0-9]/g, "+").replace(/[+]+/g, "+").replace(/[+]+$/, "");
    };

    return Text;

  })();

  window.is_proxy = window.location.pathname === "/";

  window.renderer = new Renderer();

  window.Text = new Text();

}).call(this);


(function() {
  var Time;

  Time = (function() {
    function Time() {}

    Time.prototype.since = function(time) {
      var back, now, secs;
      now = +(new Date) / 1000;
      secs = now - time;
      if (secs < 60) {
        back = "Just now";
      } else if (secs < 60 * 60) {
        back = (Math.round(secs / 60)) + " minutes ago";
      } else if (secs < 60 * 60 * 24) {
        back = (Math.round(secs / 60 / 60)) + " hours ago";
      } else if (secs < 60 * 60 * 24 * 3) {
        back = (Math.round(secs / 60 / 60 / 24)) + " days ago";
      } else {
        back = "on " + this.date(time);
      }
      back = back.replace(/1 ([a-z]+)s/, "1 $1");
      return back;
    };

    Time.prototype.date = function(timestamp, format) {
      var display, parts;
      if (format == null) {
        format = "short";
      }
      parts = (new Date(timestamp * 1000)).toString().split(" ");
      if (format === "short") {
        display = parts.slice(1, 4);
      } else {
        display = parts.slice(1, 5);
      }
      return display.join(" ").replace(/( [0-9]{4})/, ",$1");
    };

    Time.prototype.timestamp = function(date) {
      if (date == null) {
        date = "";
      }
      if (date === "now" || date === "") {
        return parseInt(+(new Date) / 1000);
      } else {
        return parseInt(Date.parse(date) / 1000);
      }
    };

    Time.prototype.readtime = function(text) {
      var chars;
      chars = text.length;
      if (chars > 1500) {
        return parseInt(chars / 1500) + " min read";
      } else {
        return "less than 1 min read";
      }
    };

    return Time;

  })();

  window.Time = new Time;

}).call(this);

