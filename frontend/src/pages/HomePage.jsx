// frontend/src/pages/HomePage.jsx

import React from 'react';

import ProductList from '../components/ProductList';

import './HomePage.scss'
const HomePage = ({ selectedCategory , isLoggedIn }) => {
  return (
    <div className='k-home-page'>
      <h2 className='k-title-page'>Gana dinero y liberate todo lo que tus hijos ya no usan!</h2>
      <h3 className='k-subtitle-page'> Compra, vende e intercambia artículos infantiles de segunda mano de manera fácil y sostenible.</h3>
     <ProductList selectedCategory={selectedCategory} isLoggedIn={isLoggedIn}/>
    </div>
  );
};

export default HomePage;