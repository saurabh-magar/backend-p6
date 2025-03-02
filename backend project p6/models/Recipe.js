const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: String,
  desc: String,
  ingredients: String,
  image: String,
  cuisine: String,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
