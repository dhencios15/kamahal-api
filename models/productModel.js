const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A Product must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        20,
        'A Product name must have less or equal then 20 characters',
      ],
      minlength: [
        8,
        'A Product name must have more or equal then 10 characters',
      ],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'A Product must have a description'],
      trim: true,
    },
    category: {
      type: Schema.ObjectId,
      ref: 'Category',
      required: [true, 'A Product must have a category'],
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: [true, 'A Product must have a price'],
    },
    imageCover: {
      type: String,
      required: [true, 'A Product must have a cover image'],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

productSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ productId: this._id });

  next();
});

productSchema.virtual('Reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  justOne: false,
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: '-__v -_id',
  });
  next();
});

const Product = model('Product', productSchema);

module.exports = Product;
