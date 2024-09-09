import Link from 'next/link';
import React from 'react';
import * as FaIcons from 'react-icons/fa';

  function Navbar() {
    return (
      <nav className="bg-[#333] text-white p-5">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/">Home</Link>
            </div>
            <ul className="flex">

              <li className="mx-3">
                <Link href="/products">
                  <FaIcons.FaBox size={24} className="text-white hover:text-gray-400" />
                </Link>
              </li>
              

              <li className="mx-3">
                <Link href="/carts">
                  <FaIcons.FaShoppingCart size={24} className="text-white hover:text-gray-400" />
                </Link>
              </li>
  
              <li className="mx-3">
                <Link href="/profile">
                  <FaIcons.FaUser size={24} className="text-white hover:text-gray-400" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}

export default Navbar;
