var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var path = require('path');

var urlEncodedParser = bodyParser.urlencoded({extended: false});

var app = express();

MongoClient.connect("mongodb://localhost/medium_db", function(err, db) {
    if (err) return funcCallback(err);
    console.log("Connecté à la base de données " + db.name);


    app.set('view engine', 'pug')
        .set("views", path.join(__dirname, "views"))
        .use("/static", express.static(path.join(__dirname, "public")))
        .get('/', function (req, res) {
            res.render('index', {title: 'Medium'});
        })
        .get('/medium', function (req, res) {
            db.collection("articles").find().toArray(function (err, result) {
                if (err) {
                    console.error('Find failed', err);
                } else {
                    res.render('medium', {articles: result})
                }
            });
        })
        .post('/medium/update_article/:article_id', urlEncodedParser, function (req, res) {
            if (req.body.article) {
                article_object = req.body;
                var o_id = new mongo.ObjectID(req.params.article_id);
                var newObj = {
                    article_title: article_object.title,
                    article_content: article_object.article
                };
                db.collection("articles").update({ "_id": o_id}, newObj, function (err, result) {
                    if (err) throw err;
                    console.log("Le document a été modifié");
                    res.redirect('/medium/article/' + o_id);
                });
            }
        })
        .get('/medium/delete/:article_id', function (req, res) {
            var o_id = new mongo.ObjectID(req.params.article_id);
            db.collection("articles").remove({ "_id": o_id}, null, function (error, reslt) {
                if (error) throw error;
                console.log("Le document a été supprimé");
            });
            res.redirect('/medium');
        })
        .get('/medium/article/:article_id', function (req, res) {
            var o_id = new mongo.ObjectID(req.params.article_id);
            db.collection("articles").findOne({"_id": o_id}, function (err, result) {
                if (err) {
                    console.error('Find failed', err);
                } else {
                    res.render('article', {article: result})
                }
            });
        })
        .get('/medium/create_article', function (req, res) {
            var newObj = {};
            db.collection("articles").insert(newObj, null, function (err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log("Le document a été inséré");
                    var objectId = newObj._id;
                    res.redirect('/medium/write/' + objectId);
                }
            });
        })
        .get('/medium/write/:article_id', function (req, res) {
            var o_id = new mongo.ObjectID(req.params.article_id);
            db.collection("articles").findOne({"_id": o_id}, function (err, result) {
                if (err) {
                    console.error('Find failed', err);
                } else {
                    res.render('write', {article: result})
                }
            });
        })
        //gérer les erreurs 404
        .use(function (req, res, next) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Page cannot be found');
        });
});

app.listen(8000);
