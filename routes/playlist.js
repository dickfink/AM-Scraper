var express = require('express');
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var router = express.Router();


/* GET playlist */
router.get('/', function(req, res) {
  
  // get playlist URL from URL (via the Form)
  let playlist_url = req.param('url');
  
  // fetch the contents of the url
  fetch(playlist_url)
  .then(res => res.text())
  .then((body) => {
  // load the page into Cheerio
    $ = cheerio.load(body);
  // make an array to hold songData
    // find each song item    
    let songs = $('body').find('li.tracklist-item');
    // for each song
    let self = this;
    self.songData = new Array();
    $(songs).each((i, song) => {
      // find the relevant info and store it in our array
      self.songData[i] = {                
        url: playlist_url + '?i=' + $(songs[i]).find('a').attr('href').match(/\s*=\s*(.*)/)[1],
        title: $(songs[i]).find('span').text().trim(),
        image: $(songs[i]).find('img').attr('src'),
        artist: $(songs[i]).find('.table__row__link').text(),
      }
    });
    res.render('playlist', { title: 'Playlist', songs: self.songData, });
  });
});

module.exports = router;