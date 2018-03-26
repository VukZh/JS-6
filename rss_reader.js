const Parser = require('rss-parser');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');

const app = express();
const port = 3000;

const parser = new Parser();

var feed;

(async () => {
    feed = await parser.parseURL('https://lenta.ru/rss/top7'); ///////////  - RSS
    console.log('RSS     - ', feed.title);
    console.log('Records - ', feed.items.length);
})();

MongoClient.connect("mongodb://localhost:27017",
    function(err, database) {
        if (err) return console.log(err);

        var dbo = database.db("db");

        dbo.collection("RSS").insertMany(feed.items, function(err, res) {
            if (err) throw err;
            //    console.log(res);
            console.log('RSS insert');
            database.close();
        });
        //////////////////////////////// DROP collection RSS

        // dbo.collection("RSS").deleteMany({}, function(err, obj) {
        // if (err) console.log ('err');
        // console.log ('del');
        // database.close();
        // });

        //////////////////////////////// not work

        // app.use('/drop', (req, res) => {
        // dbo.collection("RSS").deleteMany({}, function(err, obj) {
        // if (err) {
        // return res.status(400).json({ error: err.message})};
        // res.send ('del');
        // database.close();
        // });
        // });


        ////////////////////////////////// not work
        // app.get('/note', function (req, res, next) {
        // var arr = [];       
        // dbo.collection('RSS').find({}, function (err, docs) {
        // docs.each(function (err, doc) {
        // if (doc) {
        // arr.push(doc);
        // } else {
        // return res.status(400).json({ error: err.message});
        // }
        // });
        // });
        // console.log(arr);
        // return res.json(arr);
        // });
        ///////////////////////////////////

        app.get('/rss', function(req, res) { //////////////////////////   view Feed Items from RSS
            if (err) return res.status(400).json({
                error: err.message
            });
            res.send(feed.items);
        })


    });

app.listen(port, function() {
    console.log('We are live on ' + port);
});