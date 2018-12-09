const express = require('express')
const fs = require('fs')
const path = require('path')
const https = require('https')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname + '/index.htm'))
    res.status(200).send('nothing...');
})

app.get('/sdatahandler', function(req, res) {
    console.log(req.query);    
    if (req.query.id == '36d00b7f-3acb-4ddd-a284-47dca4351a8c'){

        https.get(req.query.url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                const dom = new JSDOM(data)
                var bestRatingScore = 5
                var ratingScore = dom.window.document.getElementsByClassName("rating-score")[0].innerHTML.trim()
                
                if (ratingScore > bestRatingScore) bestRatingScore = ratingScore

                var counter = dom.window.document.getElementsByClassName("counter")[0].innerHTML.trim()
                var contents = fs.readFileSync('maldronwexford.com.js', 'utf8')
                res.type("text/javascript")
                res.status(200).send(contents.replace("{rating_score}", ratingScore).replace("{counter}", counter).replace("{best_rating}", bestRatingScore));
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } else {
        res.status(500).send('key not active..');
    }
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})