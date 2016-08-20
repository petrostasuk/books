var Book = require('../models/Book');
var fs = require('fs');
var async = require('async');

module.exports = {

  // GET /books
  query: function (req, res) {
    var where = req.query.search ?
      {'$or' : [
        {author: { "$regex": req.query.search, "$options": "i" }},
        {title: { "$regex": req.query.search, "$options": "i" }}
      ]} : {};
    async.parallel({
      count: function (cb) {
        Book.where(where).and({user: req.user.id}).count(function (err, count) {
          cb(err, count);
        });
      },
      books: function (cb) {
        var query = Book.find(where);
        query.and({user: req.user.id});
        if (req.query.limit) {
          query.limit(+req.query.limit)
        }
        if (req.query.skip) {
          query.skip(+req.query.skip)
        }
        if (req.query.sort) {
          query.sort(req.query.sort);
        }

        query.exec(function (err, books) {
          cb(err, books);
        });
      }
    }, function (err, results) {
      if (err) {
        return res.status(500).json(err);
      }
      res.set('Access-Control-Expose-Headers', 'Pagination-Count');
      res.set('Pagination-Count', results.count);
      res.status(200).json(results.books);
    });
  },

  // GET /books/:id
  queryOne: function (req, res) {
    Book.findOne({_id: req.params.id, user: req.user.id}).exec(function (err, book) {
      if (err) return res.status(500).json(err);
      if (!book) return res.status(404).send('Not found');
      res.json(book);
    })
  },

  // POST /books OR POST /books/:id
  save: function (req, res) {
    var body = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (req.files && req.files.image && req.files.image[0] !== undefined) {
      body.image = req.files.image[0].filename;
    }
    if (req.files && req.files.file && req.files.file[0] !== undefined) {
      body.file = req.files.file[0].filename;
    }
    if (!req.params.id) {
      body.user = req.user.id;
      Book.create(body, function (err, book) {
        if (!err) {
          res.status(200).json(book);
        } else {
          res.status(400).json(err);
        }
      });
    } else {
      Book.findByIdAndUpdate(req.params.id, { $set: body}, function (err, book) {
        if (err) return res.status(400).json(err);
        res.send(book);
      });
    }
  },

  // DELETE /books/:id
  delete: function (req, res) {
    Book.findById(req.params.id).exec(function (err, book) {
      if (err) return res.status(500).json(err);
      if (!book) return res.status(404).send('Not found');
      if (book.user != req.user.id) return res.status(403).send('Forbidden');
      book.remove(function () {
        res.status(200).send(book);
      });
    });
  },

};
