const express = require('express');
const { getRecipeIngredients } = require('../controllers/recipeController');

const router = express.Router();

router.post('/suggest', getRecipeIngredients);

module.exports = router;