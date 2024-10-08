import React from 'react';

function ProductsS ({ cartItems })  {
  const totalPrice = cartItems.reduce((total, item) => 
    total + item.product.price * item.quantity, 0
  );

  return (
    <div className=" bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">รวมราคา</h2>
      <p className="text-gray-800 text-lg">ราคา {totalPrice.toFixed(2)} บาท </p>                {/* 2 คือทศนิยม 2 ตำแหน่ง*/ }
    </div>
  );
};

export default ProductsS;
