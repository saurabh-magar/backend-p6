const express = require("express");
const multer = require("multer");
const path = require("path");
const Recipe = require("../models/Recipe");

const router = express.Router();

// **Multer Storage for Image Uploads**
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// **Add Recipe**
router.post("/add-recipe", upload.single("image"), async (req, res) => {
  try {
    const { title, desc, ingredients, cuisine } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !desc || !ingredients || !cuisine || !image)
      return res.status(400).json({ message: "All fields are required" });

    const newRecipe = new Recipe({ title, desc, ingredients, image, cuisine });
    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully!", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ message: "Error adding recipe", error });
  }
});

// **Get All Recipes**
router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error });
  }
});

// **Get Recipe by ID**
router.get("/recipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found!" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe", error });
  }
});

// **Get All Recipes**
router.get("/get-recipes", async (req, res) => {
    try {
      const recipes = await Recipe.find();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recipes", error });
    }
  });
  

module.exports = router;
