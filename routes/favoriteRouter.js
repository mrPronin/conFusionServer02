var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Favorite.find({'postedBy': req.decoded._doc._id})
        .populate('postedBy')
        .populate('dishes')
        .exec(function (err, dish) {
        if (err) throw err;
        res.json(dish);
    });
})
.post(function (req, res, next) {
    Favorites.findOne({postedBy: req.decoded._doc._id}, function(err, favorite) {
        if (err) throw err;
        if (!err && favorite !== null) {
            // favorite record exist for current user
            Favorites.findOne({postedBy: req.decoded._doc._id, dishes: req.body._id}, function(err, favoriteWithDish){
                if (err) throw err;
                if (!err && favoriteWithDish == null) {
                    favorite.dishes.push(req.body._id);
                    favorite.save(function (err, favorite) {
                        if (err) throw err;
                        res.json(favorite);
                    });
                } else {
                    res.json(favorite);
                }
            });
        } else {
            // should create new record for current user in favorites
            Favorites.create({postedBy: req.decoded._doc._id, dishes: [req.body._id]}, function(err, favorite) {
                if (err) throw err;
                console.log('Favorite created! Id: ' + favorite._id);
                res.json(favorite);
            });
        }
    });
})
.delete(function(req, res, next) {
    Favorite.remove({'postedBy': req.decoded._doc._id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

favoriteRouter.route('/:dishId')
.all(Verify.verifyOrdinaryUser)
.delete(function(req, res, next) {
    Favorites.findOne({postedBy: req.decoded._doc._id, dishes: req.params.dishId}, function(err, favorite) {
        if (err) throw err;
        if (!err && favorite !== null) {
            var index = favorite.dishes.indexOf(req.params.dishId);
            favorite.dishes.splice(index, 1);
            favorite.save(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Dis not found with id: ' + req.params.dishId);
        }
    })
});

module.exports = favoriteRouter;
