var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var BookSchema = new Schema({
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    author: {
      type: String,
      required: [true, 'Author is required']
    },
    rating: {
      type: Number,
      min: [0, 'Rating min value is 0'],
      max: [5, 'Rating max value is 5']
    },
    status: Boolean,
    file: String,
    image: String,
    created: Date,
    user: { type: Schema.ObjectId, ref: 'User' },
    bookId: Number,
    description: String
});

BookSchema.pre('save', function (next) {
  if (this.isNew) {
    this.created = new Date;
    next();
  }
});

BookSchema.plugin(autoIncrement.plugin, {
  model: 'Book',
  field: 'bookId',
  startAt: 1,
});

module.exports = mongoose.model('Book', BookSchema);
