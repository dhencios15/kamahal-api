const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// const favoriteSchema = newSchema({
//   productName: {
//     type: String,
//     required: [true, 'Please add a product name'],
//   },
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true,
//   },
// });

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'defailt.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  favorites: [
    {
      productId: {
        type: Schema.ObjectId,
        ref: 'Product',
      },
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'favorites.productId',
    select: 'name imageCover',
  });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model('User', userSchema);

module.exports = User;
