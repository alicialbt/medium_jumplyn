var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var MongoClient = require('mongodb').MongoClient;

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
            res.render('medium', {articles: req.session.article})
        })
        .post('/medium/add', urlEncodedParser, function (req, res) {
            if (req.body.article) {
                req.session.article.push(req.body);
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
        .get('/medium/article/:article_id', function (req, res) {
            if (req.params.article_id) {
                req.session.article.splice(req.params.article_id, 1)
            }
            res.redirect('/medium');
        })
        //gérer les erreurs 404
        .use(function (req, res, next) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(404).send('Page cannot be found');
        });
});

app.listen(8000);
