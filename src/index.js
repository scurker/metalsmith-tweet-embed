import querystring from 'querystring';
import minimatch from 'minimatch';
import got from 'got';

const TWEET_REGEX = /https?:\/\/(www\.)?twitter\.com\/[a-z0-9_]{1,15}\/status(es)?\/[0-9]+/ig;

async function embedTweets(contentString, options) {
  let matches = contentString.match(TWEET_REGEX) || [];

  for(let status of matches) {
    try {
      let params = Object.assign({ url: status }, options)
        , oembedURL = `https://publish.twitter.com/oembed?${querystring.stringify(params)}`
        , response = await got(oembedURL, { json: true });

      if(response.body && response.body.html) {
        contentString = contentString.replace(status, response.body.html);
      }
    } catch (ex) {
      throw ex;
    }
  }

  return contentString;
}

export default function twitterEmbed(opts = {}) {
  const { pattern = '*', options = {} } = opts;

  return async function(files, metalsmith, done) {
    await Promise.all(Object.keys(files)
      .filter(file => minimatch(file, pattern))
      .map(async file => {
        let contentString = files[file].contents.toString()
          , combinedOptions = Object.assign({}, options, files[file].twitter || {});
        files[file].contents = Buffer.from(await embedTweets(contentString, combinedOptions));
      }));

    done();
  };
}