const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Specific icon mapping - NO generic icons
const getIngredientIcon = (ingredientName) => {
  const lowerName = ingredientName.toLowerCase();
  
  // Dairy & Fats
  if (lowerName.includes('milk')) return '🥛';
  if (lowerName.includes('butter')) return '🧈';
  if (lowerName.includes('ghee')) return '🧈';
  if (lowerName.includes('cheese')) return '🧀';
  if (lowerName.includes('paneer')) return '🧀';
  if (lowerName.includes('yogurt') || lowerName.includes('curd')) return '🥛';
  if (lowerName.includes('cream')) return '🥛';
  if (lowerName.includes('oil')) return '🫒';
  
  // Eggs & Meat
  if (lowerName.includes('egg')) return '🥚';
  if (lowerName.includes('chicken')) return '🍗';
  if (lowerName.includes('mutton') || lowerName.includes('meat')) return '🍖';
  if (lowerName.includes('fish')) return '🐟';
  if (lowerName.includes('prawn')) return '🦐';
  
  // Vegetables
  if (lowerName.includes('onion')) return '🧅';
  if (lowerName.includes('tomato')) return '🍅';
  if (lowerName.includes('potato')) return '🥔';
  if (lowerName.includes('carrot')) return '🥕';
  if (lowerName.includes('garlic')) return '🧄';
  if (lowerName.includes('ginger')) return '🫚';
  if (lowerName.includes('chili') || lowerName.includes('chilli')) return '🌶️';
  if (lowerName.includes('capsicum') || lowerName.includes('bell pepper')) return '🫑';
  if (lowerName.includes('spinach')) return '🥬';
  if (lowerName.includes('cabbage')) return '🥬';
  if (lowerName.includes('cauliflower')) return '🥦';
  if (lowerName.includes('broccoli')) return '🥦';
  if (lowerName.includes('peas')) return '🟢';
  if (lowerName.includes('corn')) return '🌽';
  if (lowerName.includes('pumpkin')) return '🎃';
  if (lowerName.includes('mushroom')) return '🍄';
  
  // Fruits
  if (lowerName.includes('apple')) return '🍎';
  if (lowerName.includes('banana')) return '🍌';
  if (lowerName.includes('mango')) return '🥭';
  if (lowerName.includes('orange')) return '🍊';
  if (lowerName.includes('grape')) return '🍇';
  if (lowerName.includes('strawberry')) return '🍓';
  if (lowerName.includes('watermelon')) return '🍉';
  if (lowerName.includes('pineapple')) return '🍍';
  if (lowerName.includes('lemon')) return '🍋';
  if (lowerName.includes('mint')) return '🌿';
  
  // Grains & Pulses
  if (lowerName.includes('rice')) return '🍚';
  if (lowerName.includes('wheat') || lowerName.includes('atta') || lowerName.includes('flour')) return '🌾';
  if (lowerName.includes('lentil') || lowerName.includes('dal') || lowerName.includes('urad') || lowerName.includes('masoor') || lowerName.includes('chana') || lowerName.includes('toor')) return '🫘';
  if (lowerName.includes('rajma') || lowerName.includes('kidney bean')) return '🫘';
  if (lowerName.includes('chickpea') || lowerName.includes('chole')) return '🫘';
  if (lowerName.includes('pasta') || lowerName.includes('noodles')) return '🍝';
  if (lowerName.includes('bread')) return '🍞';
  
  // Spices & Seeds
  if (lowerName.includes('cumin') || lowerName.includes('jeera')) return '🌿';
  if (lowerName.includes('coriander') || lowerName.includes('dhania')) return '🌿';
  if (lowerName.includes('turmeric') || lowerName.includes('haldi')) return '🌿';
  if (lowerName.includes('red chili powder')) return '🌶️';
  if (lowerName.includes('garam masala')) return '🌿';
  if (lowerName.includes('cardamom') || lowerName.includes('elaichi')) return '🌿';
  if (lowerName.includes('cinnamon') || lowerName.includes('dalchini')) return '🌿';
  if (lowerName.includes('clove') || lowerName.includes('laung')) return '🌿';
  if (lowerName.includes('pepper') || lowerName.includes('kali mirch')) return '⚫';
  if (lowerName.includes('asafoetida') || lowerName.includes('hing')) return '🌿';
  if (lowerName.includes('mustard seeds') || lowerName.includes('rai')) return '🌿';
  if (lowerName.includes('fenugreek') || lowerName.includes('methi')) return '🌿';
  if (lowerName.includes('bay leaf') || lowerName.includes('tej patta')) return '🌿';
  if (lowerName.includes('caraway seeds') || lowerName.includes('shahjeera')) return '🌿';
  if (lowerName.includes('fennel seeds') || lowerName.includes('saunf')) return '🌿';
  if (lowerName.includes('poppy seeds') || lowerName.includes('khus khus')) return '🌿';
  if (lowerName.includes('sesame seeds') || lowerName.includes('til')) return '🌿';
  
  // Sweeteners
  if (lowerName.includes('sugar')) return '🍯';
  if (lowerName.includes('honey')) return '🍯';
  if (lowerName.includes('jaggery')) return '🍯';
  if (lowerName.includes('syrup')) return '🍯';
  
  // Nuts & Dry Fruits
  if (lowerName.includes('cashew') || lowerName.includes('kaju')) return '🥜';
  if (lowerName.includes('almond') || lowerName.includes('badam')) return '🥜';
  if (lowerName.includes('pistachio') || lowerName.includes('pista')) return '🥜';
  if (lowerName.includes('walnut') || lowerName.includes('akhrot')) return '🥜';
  if (lowerName.includes('raisin') || lowerName.includes('kishmish')) return '🍇';
  if (lowerName.includes('coconut')) return '🥥';
  if (lowerName.includes('dates')) return '🌴';
  
  // Liquids & Essences
  if (lowerName.includes('water')) return '💧';
  if (lowerName.includes('rose water')) return '🌹';
  if (lowerName.includes('lemon juice')) return '🍋';
  if (lowerName.includes('kewra essence') || lowerName.includes('kewra water')) return '🌸';
  if (lowerName.includes('essence') || lowerName.includes('extract')) return '🌸';
  
  // Saffron & Special
  if (lowerName.includes('saffron') || lowerName.includes('kesar')) return '🌸';
  
  // Salt & Baking
  if (lowerName.includes('salt')) return '🧂';
  if (lowerName.includes('baking') || lowerName.includes('soda') || lowerName.includes('bicarbonate')) return '🧂';
  
  // Herbs
  if (lowerName.includes('mint')) return '🌿';
  if (lowerName.includes('coriander leaves') || lowerName.includes('cilantro')) return '🌿';
  if (lowerName.includes('parsley')) return '🌿';
  if (lowerName.includes('basil')) return '🌿';
  if (lowerName.includes('rosemary')) return '🌿';
  if (lowerName.includes('thyme')) return '🌿';
  
  // If no match found, return the ingredient name as text (no generic icon)
  return ingredientName.charAt(0).toUpperCase(); // First letter as fallback
};

const getRecipeIngredients = async (req, res) => {
  try {
    const { dishName } = req.body;
    
    if (!dishName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a dish name',
      });
    }
    
    const prompt = `List ALL ingredients needed to make "${dishName}" at home.
Return ONLY a JSON array. Each object must have "name" and "quantity".
Example: [{"name": "Milk", "quantity": "500ml"}, {"name": "Sugar", "quantity": "4 tbsp"}]
No other text. Only the JSON array. Make ingredient names simple.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
    });

    const aiText = completion.choices[0]?.message?.content || '[]';
    console.log('GROQ Response:', aiText);
    
    let ingredients;
    try {
      const cleanText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      ingredients = JSON.parse(cleanText);
    } catch (parseError) {
      const match = aiText.match(/\[[\s\S]*\]/);
      ingredients = match ? JSON.parse(match[0]) : [];
    }
    
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('No ingredients found');
    }
    
    // Add icons to each ingredient
    const ingredientsWithIcons = ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: ingredient.quantity || 'As needed',
      icon: getIngredientIcon(ingredient.name)
    }));
    
    res.status(200).json({
      success: true,
      dishName: dishName,
      ingredients: ingredientsWithIcons,
      message: `Found ${ingredientsWithIcons.length} ingredients for ${dishName}`,
      aiPowered: true,
    });
    
  } catch (error) {
    console.error('GROQ AI Error:', error);
    
    res.status(200).json({
      success: true,
      dishName: dishName,
      ingredients: [],
      message: 'Unable to get ingredients',
      aiPowered: false,
    });
  }
};

module.exports = { getRecipeIngredients };