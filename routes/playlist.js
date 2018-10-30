var express = require('express');
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var _ = require('lodash');
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
        url: $(songs[i]).find('a').attr('href'),
        songId: $(songs[i]).find('a').attr('href').match(/\s*=\s*(.*)/)[1],
        title: $(songs[i]).find('span').text().trim(),
        image: $(songs[i]).find('img').attr('src'),
        artist: $(songs[i]).find('.table__row__link').text(),
      }
    });
    console.log(self.songData);
  });

  res.send('Done');  

});

module.exports = router;


// app.get('/nodetube', function (req, res) {
//   //Tell the request that we want to fetch youtube.com, send the results to a callback function
//   request({
//       uri: 'http://youtube.com'
//   }, function (err, response, body) {
//       var self = this;
//       self.items = new Array(); //I feel like I want to save my results in an array
      
//     //Just a basic error check
//       if (err && response.statusCode !== 200) {
//           console.log('Request error.');
//       }
      
//     //Send the body param as the HTML code we will parse in jsdom
//       //also tell jsdom to attach jQuery in the scripts
//       jsdom.env({
//           html: body,
//           scripts: ['http://code.jquery.com/jquery-1.6.min.js']
//       }, function (err, window) {
//           //Use jQuery just as in any regular HTML page
//           var $ = window.jQuery,
//               $body = $('body'),
//               $videos = $body.find('.video-entry');
          
//       //I know .video-entry elements contain the regular sized thumbnails
//           //for each one of the .video-entry elements found
//           $videos.each(function (i, item) {
             
//          //I will use regular jQuery selectors
//               var $a = $(item).children('a'),
                 
//             //first anchor element which is children of our .video-entry item
//                   $title = $(item).find('.video-title .video-long-title').text(),
                  
//             //video title
//                   $time = $a.find('.video-time').text(),
                  
//             //video duration time
//                   $img = $a.find('span.clip img'); //thumbnail
             
//          //and add all that data to my items array
//               self.items[i] = {
//                   href: $a.attr('href'),
//                   title: $title.trim(),
//                   time: $time,
                 
//             //there are some things with youtube video thumbnails, those images whose data-thumb attribute
//                   //is defined use the url in the previously mentioned attribute as src for the thumbnail, otheriwse
//                   //it will use the default served src attribute.
//                   thumbnail: $img.attr('data-thumb') ? $img.attr('data-thumb') : $img.attr('src'),
//                   urlObj: url.parse($a.attr('href'), true) //parse our URL and the query string as well
//               };
//           });
          
//       //let's see what we've got
//           console.log(self.items);
//           res.end('Done');
//       });
//   });
// });