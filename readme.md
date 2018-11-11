# metalsmith-tweet-embed [![Build Status](https://travis-ci.com/scurker/metalsmith-tweet-embed.svg?branch=master)](https://travis-ci.com/scurker/metalsmith-tweet-embed) [![Coverage Status](https://coveralls.io/repos/scurker/metalsmith-tweet-embed/badge.svg?branch=master&service=github)](https://coveralls.io/github/scurker/metalsmith-tweet-embed?branch=master) [![npm](https://img.shields.io/npm/v/metalsmith-tweet-embed.svg?style=flat)](https://www.npmjs.com/package/metalsmith-tweet-embed)

> Converts Twitter status URLS to embedded Twitter statuses

## Installation

With [npm](https://www.npmjs.com/):

```bash
npm install metalsmith-tweet-embed
```

With [yarn](https://yarnpkg.com):

```bash
yarn add metalsmith-tweet-embed
```

## Usage

```js
var metalsmith = require('metalsmith');
var tweetEmbed = require('metalsmith-tweet-embed');

metalsmith(__dirname)
  .use(tweetEmbed())
  .build();
```

## Options

You can limit which status links get converted by passing in `pattern` as a param.

```javascript
var metalsmith = require('metalsmith');
var tweetEmbed = require('metalsmith-tweet-embed');

metalsmith(__dirname)
  .use(tweetEmbed({ pattern: '**/*.md' }))
  .build();
```

You can also customize the options of the embed by using any options supported by the [Twitter Status oEmbed API](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-oembed.html).

These options can be set directly from the plugin, or via frontmatter.

> From Frontmatter

```markdown
---
title: Look at this awesome page
twitter:
  omit_script: false
  align: center
---

This is my markdown content

https://twitter.com/BillGates/status/7957453193
```

> From Plugin

```javascript
var metalsmith = require('metalsmith');
var tweetEmbed = require('metalsmith-tweet-embed');

metalsmith(__dirname)
  .use(tweetEmbed({
    options: {
      omit_script: true,
      align: 'center'
    }
  }))
  .build();
```

Any embed options set via frontmatter will overwrite options set from the plugin options.

## License

[MIT](/license)