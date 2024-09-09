import Link from "next/link";
import React from "react";
import * as FaIcons from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-[#fa4727] text-white p-5 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          
          <div>
            <Link href="/" className="flex items-center">
              <FaIcons.FaHome
                size={24}
                className="text-white mr-2"
              />
              <span className="text-white">หน้าหลัก</span>
            </Link>
          </div>

          {/* Navigation Icons */}
          <ul className="flex space-x-6">
            <li>
              <Link href="/products" className="flex items-center">
                <FaIcons.FaBox
                  size={24}
                  className="text-white mr-2"
                />
                <span className="text-white">คลังสินค้า</span>
              </Link>
            </li>

            <li>
              <Link href="/carts" className="flex items-center">
                <FaIcons.FaShoppingCart
                  size={24}
                  className="text-white mr-2"
                />
                <span className="text-white">ตะกร้า</span>
              </Link>
            </li>

            <li>
              <Link href="/profile" className="flex items-center">
                <FaIcons.FaUser
                  size={24}
                  className="text-white mr-2"
                />
                <span className="text-white">โปรไฟล์ของฉัน</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
