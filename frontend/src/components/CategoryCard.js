import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const categoryImages = {
    'Vegetables & Fruits': 'https://plus.unsplash.com/premium_photo-1707242994139-fd1c5ab72aac?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=200',
    'Dairy & Breakfast': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fERhaXJ5fGVufDB8fDB8fHww?w=200',
    'Meat & Fish': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200',
    'Personal Care': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200',
    'Cold Drinks & Juices': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200',
    'Pasta & Noodles': 'https://images.unsplash.com/photo-1612966893103-790e549a2ab1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBhc3RhfGVufDB8fDB8fHww?w=200',
    'Bakery & Snacks': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
    'Cleaning Essentials': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200',
  };

  return (
    <div 
      onClick={() => navigate(`/products?category=${category}`)}
      className="flex-shrink-0 w-28 md:w-32 cursor-pointer group"
    >
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mx-auto shadow-md group-hover:shadow-lg transition">
        <img 
          src={categoryImages[category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'} 
          alt={category}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
      </div>
      <p className="text-center text-sm font-medium mt-2 text-blinkit-dark">{category}</p>
    </div>
  );
};

export default CategoryCard;