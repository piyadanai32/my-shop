import Link from 'next/link';
import React from 'react';

function Navbar() {
  return (
    <nav className='bg-[#333] text-white p-5'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center'>
            <div>
                <Link href="/">Home</Link>
            </div>
            <ul className='flex'>
                <li className='mx-3'><Link href="/products">Products</Link></li>
                <li className='mx-3'><Link href="/carts">Cart</Link></li>
            </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
