var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

var urlEncodedParser = bodyParser.urlencoded({extended: false});

var app = express();

app.set('view engine', 'pug')
    .use(cookieSession({secret: 'medium'}))
    .get('/', function(req, res){
      res.render('index', {title: 'Medium'});
    })
    .get('/medium', function (req, res) {
        res.render('medium', {articles: req.session.article})
    })
    .post('/medium/add', urlEncodedParser, function(req,res) {
        if (req.body.article) {
            req.session.article.push(req.body);
        }
        res.redirect('/medium');
    })
    .get('/medium/article/:article_id', function (req, res) {
        if(req.params.article_id) {
            req.session.article.splice(req.params.article_id, 1)
        }
        res.redirect('/medium');
    })
    //gérer les erreurs 404
    .use(function(req, res, next) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Page cannot be found');
    });

app.listen(8000);
