# hexo-zeronet-comments

A hexo plugin that add the comment feature for zeronet.

## DEMO

## Installation

``` bash
$ npm install hexo-zeronet-comments --save
```

## Usage

### 1. Edit your theme


Add the following `zeronet_comments_html()` and `zeronet_comments()` helper tag in template file for article.

``` ejs
  <% if (!index && post.comments){ %>
    <%- zeronet_comments_html() %>
    <%- zeronet_comments(post.path) %>
  <% } %>
```
### 2. generating files

``` bash
$ hexo clean
$ hexo generate
```

## License

GNU

## Thanks

[ZeroBlog](https://github.com/HelloZeroNet/ZeroBlog)


