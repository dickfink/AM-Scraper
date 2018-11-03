var express = require('express');
// express handlebars needed for Helper to create "copy".
var exphbs  = require('express-handlebars');
var router = express.Router();
// also needed is fetch (for getting page data) and cheerio (for scraping DOM a la jQuery)
var fetch = require('node-fetch');
var cheerio = require('cheerio');

// copy-link helper
var hbs = exphbs.create({
  helpers: {
    foo: function () {
      alert('clicked!');
    }
  }
});

function copyLink(){
  alert('clicked!');
};

/* GET playlist */
router.get('/', function(req, res) {
  // get playlist URL from URL (via the Form)
  let playlist_url = req.param('url');
  // if they didn't enter a URL, throw an error
  if (!playlist_url){
    res.render('playlist', { title: 'Song in a Playlist', error: "Don't forget to search for a playlist..." });
  }
  // fetch the contents of the url
  fetch(playlist_url)
  .then(res => res.text())
  .then((body) => {
  // load the page into Cheerio
    $ = cheerio.load(body);
    // find each song item    
    let songs = $('body').find('li.tracklist-item');
    // make an array to hold songData
    let songData = new Array();    
    // handle translation edge case
    if (playlist_url.match(/.+\?.*/)){
      // for each song find the relevant info and store it in our array
      $(songs).each((i, song) => {      
        songData[i] = {
          id: i,                
          url: playlist_url + '&i=' + $(songs[i]).find('a').attr('href').match(/\s*=\s*(.*)/)[1],
          title: $(songs[i]).find('span').text().trim(),
          image: $(songs[i]).find('img').attr('src'),
          artist: $(songs[i]).find('.table__row__link').text(),
        }
      });
    } else{
      // for each song find the relevant info and store it in our array
      $(songs).each((i, song) => {      
        songData[i] = {
          id: i,                
          url: playlist_url + '?i=' + $(songs[i]).find('a').attr('href').match(/\s*=\s*(.*)/)[1],
          title: $(songs[i]).find('span').text().trim(),
          image: $(songs[i]).find('img').attr('src'),
          artist: $(songs[i]).find('.table__row__link').text(),
        }
      });
    }
    // if the playlist has no songs (link is a valid website but not to a playlist, throw an error)
    if (songs.length == 0){      
      res.render('playlist', { title: 'Song in a Playlist', error: "We couldn't find any songs. Are you sure your URL is right?", formData: playlist_url });
    } 
    // if everything is OK, render playlist template with the songData
      res.render('playlist', { title: 'Song in a Playlist', songs: songData, formData: playlist_url}); 
    
  });
});

module.exports = router;