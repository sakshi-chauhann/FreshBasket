import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Search, X, Plus, Check, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

// Icon mapping for ingredients
const getIngredientIcon = (name) => {
  const lowerName = name.toLowerCase();
  
  // Meat & Fish
  if (lowerName.includes('mutton')) return '🍖';
  if (lowerName.includes('chicken')) return '🍗';
  if (lowerName.includes('fish')) return '🐟';
  if (lowerName.includes('prawn')) return '🦐';
  if (lowerName.includes('meat')) return '🍖';
  
  // Vegetables
  if (lowerName.includes('onion')) return '🧅';
  if (lowerName.includes('tomato')) return '🍅';
  if (lowerName.includes('potato')) return '🥔';
  if (lowerName.includes('carrot')) return '🥕';
  if (lowerName.includes('garlic')) return '🧄';
  if (lowerName.includes('ginger')) return '🫚';
  if (lowerName.includes('chili')) return '🌶️';
  if (lowerName.includes('capsicum')) return '🫑';
  if (lowerName.includes('spinach')) return '🥬';
  
  // Fruits
  if (lowerName.includes('apple')) return '🍎';
  if (lowerName.includes('banana')) return '🍌';
  if (lowerName.includes('mango')) return '🥭';
  if (lowerName.includes('orange')) return '🍊';
  
  // Dairy
  if (lowerName.includes('milk')) return '🥛';
  if (lowerName.includes('butter')) return '🧈';
  if (lowerName.includes('cheese')) return '🧀';
  if (lowerName.includes('paneer')) return '🧀';
  if (lowerName.includes('yogurt')) return '🥛';
  if (lowerName.includes('cream')) return '🥛';
  
  // Grains
  if (lowerName.includes('rice')) return '🍚';
  if (lowerName.includes('flour')) return '🌾';
  if (lowerName.includes('poha')) return '🍲';
  if (lowerName.includes('pasta')) return '🍝';
  if (lowerName.includes('bread')) return '🍞';
  
  // Spices
  if (lowerName.includes('cumin')) return '🌿';
  if (lowerName.includes('coriander')) return '🌿';
  if (lowerName.includes('turmeric')) return '🌿';
  if (lowerName.includes('garam masala')) return '🌿';
  if (lowerName.includes('cardamom')) return '🌿';
  if (lowerName.includes('cinnamon')) return '🌿';
  if (lowerName.includes('vanilla')) return '🌿';
  
  // Others
  if (lowerName.includes('sugar')) return '🍯';
  if (lowerName.includes('salt')) return '🧂';
  if (lowerName.includes('oil')) return '🫒';
  if (lowerName.includes('water')) return '💧';
  if (lowerName.includes('egg')) return '🥚';
  if (lowerName.includes('honey')) return '🍯';
  if (lowerName.includes('cashew')) return '🥜';
  if (lowerName.includes('almond')) return '🥜';
  if (lowerName.includes('pistachio')) return '🥜';
  
  // Default: return first letter
  return name.charAt(0).toUpperCase();
};

const RecipePage = () => {
  const [dishName, setDishName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!dishName.trim()) {
      toast.error('Please enter a dish name');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/recipe/suggest', { dishName: dishName.trim() });
      
      if (response.data.success && response.data.ingredients.length > 0) {
        const ingredientsWithSelection = response.data.ingredients.map(ing => ({
          ...ing,
          selected: true,
          id: Date.now().toString() + Math.random().toString(),
          price: 50
        }));
        setIngredients(ingredientsWithSelection);
        setSelectedIngredients(ingredientsWithSelection);
        toast.success(`Found ${ingredientsWithSelection.length} ingredients for ${dishName}!`);
      } else {
        toast.error('No ingredients found for this dish');
      }
    } catch (error) {
      console.error('Recipe error:', error);
      toast.error('Failed to get recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (index) => {
    const updated = [...ingredients];
    updated[index].selected = !updated[index].selected;
    setIngredients(updated);
    setSelectedIngredients(updated.filter(ing => ing.selected));
  };

  const addToCartHandler = (ingredient) => {
    addToCart({
      id: Date.now().toString() + Math.random().toString(),
      name: ingredient.name,
      price: ingredient.price || 50,
      weight: ingredient.quantity,
      image: null
    }, 1);
    toast.success(`${ingredient.name} added to cart!`);
  };

  const addAllToCart = () => {
    selectedIngredients.forEach(ing => {
      addToCart({
        id: Date.now().toString() + Math.random().toString(),
        name: ing.name,
        price: ing.price || 50,
        weight: ing.quantity,
        image: null
      }, 1);
    });
    toast.success(`Added ${selectedIngredients.length} items to cart!`);
  };

  const totalPrice = selectedIngredients.reduce((sum, i) => sum + (i.price || 50), 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blinkit-dark mb-2">
          What to Cook? 🍳
        </h1>
        <p className="text-gray-600">
          Type ANY dish and AI will list ALL ingredients you need!
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="e.g., Biryani, Dal Makhani, Butter Chicken, Gulab Jamun..."
            className="w-full px-6 py-4 pl-14 pr-24 text-lg border border-gray-300 rounded-full focus:outline-none focus:border-blinkit-yellow shadow-md"
          />
          <Search className="absolute left-5 top-4 w-6 h-6 text-gray-400" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bg-blinkit-yellow text-blinkit-dark px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Find'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 animate-spin text-blinkit-yellow mx-auto mb-4" />
          <p className="text-gray-500">AI is finding ingredients for you...</p>
        </div>
      )}

      {ingredients.length > 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
            <h2 className="text-2xl font-bold text-blinkit-dark">
              Ingredients for {dishName}
            </h2>
            <button
              onClick={addAllToCart}
              className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add All to Cart (₹{totalPrice})
            </button>
          </div>

          <p className="text-gray-500 mb-4 text-sm">
            ✅ Click on any item to remove if you already have it at home
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id || index}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition ${
                  ingredient.selected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 opacity-60'
                }`}
                onClick={() => toggleIngredient(index)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl w-10 text-center">{getIngredientIcon(ingredient.name)}</span>
                  {ingredient.selected ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${ingredient.selected ? 'text-blinkit-dark' : 'line-through text-gray-400'}`}>
                      {ingredient.name}
                    </p>
                    <p className="text-sm text-gray-500">{ingredient.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCartHandler(ingredient);
                  }}
                  disabled={!ingredient.selected}
                  className="bg-blinkit-yellow text-blinkit-dark px-4 py-1.5 rounded-lg font-semibold hover:bg-yellow-400 transition disabled:opacity-50 text-sm"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
            🤖 AI-generated ingredients for {dishName}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-500 mb-3">Try these popular dishes:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Custard', 'Biryani', 'Pasta', 'Pizza', 'Butter Chicken', 'Dal Makhani', 'Paneer Tikka', 'Gulab Jamun'].map((dish) => (
            <button
              key={dish}
              onClick={() => setDishName(dish)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-blinkit-yellow transition"
            >
              {dish}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;