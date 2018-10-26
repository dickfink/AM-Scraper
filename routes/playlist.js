var express = require('express');
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var _ = require('lodash');
var router = express.Router();


/* GET playlist */
router.get('/', function(req, res) {
  
  // get playlist URL from URL (via the Form)
  var playlist_url = req.param('url');
  const Song = [];
  
  // fetch the contents of the url
  fetch(playlist_url)
  .then(res => res.text())
  .then((body) => {
  // load the page into Cheerio
    $ = cheerio.load(body);
    // find each song item
    $('.tracklist-item__text div.tracklist-item__first-line a').each((index, element) => {      
      // get the full URL of each song
      let trackUrl = element.attribs.href;
      // pull ID using RegEx
      let trackID = trackUrl.match(/\s*=\s*(.*)/)[1];
      // log the track ID
      console.log(index + '-' + trackID);
    });
    $('.tracklist-item__text__headline').each((index, element) => {      
      // get the full URL of each song
      console.log(index);
    });
  });

  res.send('check the console');  

});

module.exports = router;