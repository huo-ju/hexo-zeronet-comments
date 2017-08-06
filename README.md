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

### 3. Zeronet site configuration

Copy `share/content.json` to  `data/users/` in your site's directory, and change the `address` to your site's address. 

Modify your site’s root content.json, add following code:

```
 "ignore": "data/.*",
  "includes": {
    "data/users/content.json": {
      "signers": [],
      "signers_required": 1
    }
  },

```

Copy `share/dbschema.json` to your site’s directory.

Sign the root content.json modifications by pressing the “Sign” button on the sidebar.

Then keep the sidebar open and change “content.json” to “data/users/content.json” and press the “Sign” button again.

Press the Reload button, then the Rebuild button on the sidebar to generate the database.

## License

GNU

## Thanks

[ZeroBlog](https://github.com/HelloZeroNet/ZeroBlog)


