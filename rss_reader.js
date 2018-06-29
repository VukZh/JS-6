const Parser = require('rss-parser');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');

const app = express();
const port = 3000;

let parser = new Parser();

let feed;
(async () => {

    try {
        feed = await parser.parseURL('https://lenta.ru/rss/last24');
        console.log('RSS     - ', feed.title);
        console.log('Records - ', feed.items.length);

        app.get('/rss', function (req, res) {
            if (err) return res.status(400).json({
                error: err.message
            });
            res.send(feed.items);
        });

        MongoClient.connect("mongodb://localhost:27017",
            function (err, database) {
                if (err) return console.log('*Error*', err);

                let dbo = database.db("db");
                dbo.collection("RSS").remove(); //remove collection
                dbo.collection("RSS").insertMany(feed.items, function (err, res) {
                    if (err) throw err;
                    // console.log(res);
                    console.log('RSS insert');
                    database.close();
                    process.exit(-1);
                });
            });

    } catch (error) {
        console.log('*Error connect*', error);
        process.exit(-1);
    };

})();

app.listen(port, function () {
    console.log('We are live on ' + port);
});
