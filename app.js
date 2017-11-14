var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');

var urlEncodedParser = bodyParser.urlencoded({extended: false});

var app = express();

MongoClient.connect("mongodb://localhost/medium_db", function(err, db) {
    if (err) return funcCallback(err);
    console.log("Connecté à la base de données " + db.name);


    app.set('view engine', 'pug')
        .use(cookieSession({secret: 'medium'}))
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
        .post('/medium/add', urlEncodedParser, function (req, res) {
            if (req.body.article) {
                //req.session.article.push(req.body);
                article_object = req.body;
                var newObj = {
                    article_title: article_object.title,
                    article_content: article_object.article
                };
                db.collection("articles").insert(newObj, null, function (err, res) {
                    if (err) throw err;
                    console.log("Le document a été inséré");
                });
            }
            res.redirect('/medium');
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
        //gérer les erreurs 404
        .use(function (req, res, next) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Page cannot be found');
        });
});

app.listen(8000);
