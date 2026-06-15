import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: '',
    category: '',
    image: '',
    inStock: true,
  });

  const categories = [
    'Vegetables & Fruits',
    'Dairy & Breakfast',
    'Meat & Fish',
    'Personal Care',
    'Cold Drinks & Juices',
    'Pasta & Noodles',
    'Bakery & Snacks',
    'Cleaning Essentials',
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        weight: formData.weight,
        category: formData.category,
        image: formData.image,
        inStock: formData.inStock,
      };

      console.log('Sending update:', productData);

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', productData);
        toast.success('Product added successfully!');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', weight: '', category: '', image: '', inStock: true });
      await fetchProducts();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Product deleted successfully');
        await fetchProducts();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      weight: product.weight,
      category: product.category,
      image: product.image || '',
      inStock: product.inStock,
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blinkit-yellow"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blinkit-dark">Admin Panel - Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', description: '', weight: '', category: '', image: '', inStock: true });
            setShowModal(true);
          }}
          className="bg-blinkit-yellow text-blinkit-dark px-4 py-2 rounded-full font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover rounded" 
                  />
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4">₹{product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - WITHOUT PRICE FIELD */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Weight/Quantity *</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                  placeholder="e.g., 500g, 1kg, 6 pcs"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blinkit-yellow"
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-gray-700">In Stock</label>
              </div>

              <button
                type="submit"
                className="w-full bg-blinkit-yellow text-blinkit-dark py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
              ⚠️ Note: To change the product price, please update it directly in MongoDB Compass.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;