const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
// const AppError = require('../utils/appError');

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) return next(new AppError('No user Found!', 404));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.addToFavorites = asyncHandler(async (req, res) => {
  const { favorites } = req.user;
  const { productId } = req.body;

  const newFav = favorites.map((fav) => {
    return { productId: fav.productId.id };
  });

  const indexOfFav = newFav.findIndex((x) => x.productId === productId);
  if (indexOfFav !== -1) {
    newFav.splice(indexOfFav, 1);
  } else if (indexOfFav > -1 || favorites.length >= 0) {
    newFav.push({ productId });
  }

  const favoriteProduct = await User.findByIdAndUpdate(
    req.user.id,
    {
      favorites: newFav,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: favoriteProduct,
  });
});
