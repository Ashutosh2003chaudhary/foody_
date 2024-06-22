// src/components/Menu.tsx

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartIcon from "./CartIcon";
import { signOut, useSession } from "next-auth/react";

const Menu = ({ user }: { user: boolean }) => {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.isAdmin;

  const links = [
    { id: 1, title: "Homepage", url: "/" },
    { id: 2, title: "Menu", url: "/menu" },
    // Add more links as needed for your application
  ];

  const handleLinkClick = () => {
    setOpen(false); // Close the menu when a link is clicked
  };

  return (
    <div className="relative">
      <button
        aria-label="Toggle Menu"
        onClick={() => setOpen(!open)}
        className="cursor-pointer focus:outline-none"
      >
        <Image
          src={open ? "/close.png" : "/open.png"}
          alt="Open/Close Menu Icon"
          width={20}
          height={20}
        />
      </button>
      {open && (
        <div className="bg-red-400 text-white fixed left-0 top-0 w-full h-full flex items-center justify-center z-50">
          <div className="bg-slate-900 text-white w-full max-w-xs md:max-w-md lg:max-w-lg p-8 rounded-lg shadow-lg">
            <div className="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="text-white focus:outline-none"
              >
                <Image src="/close.png" alt="Close Menu" width={20} height={20} />
              </button>
            </div>
            <div className="mt-6">
              {links.map((item) => (
                <Link href={item.url} key={item.id} passHref>
                  <span
                    onClick={handleLinkClick}
                    className="block py-2 text-2xl text-white hover:bg-opacity-80 rounded transition duration-150 ease-in-out cursor-pointer"
                  >
                    {item.title}
                  </span>
                </Link>
              ))}
              <Link href="/cart" passHref>
                <span
                  onClick={handleLinkClick}
                  className="block py-2 text-2xl text-white hover:bg-opacity-80 rounded transition duration-150 ease-in-out cursor-pointer"
                >
                  <CartIcon 
                  />
                </span>
              </Link>
              <div className="mt-6">
                {status === "authenticated" ? (
                  <div className="flex flex-col justify-end">
                    <Link href="/orders" passHref>
                      <span
                        onClick={handleLinkClick}
                        className="block py-2 text-2xl text-white hover:bg-opacity-80 rounded transition duration-150 ease-in-out cursor-pointer"
                      >
                        Orders
                      </span>
                    </Link>
                    {isAdmin && (
                      <Link href="/add" passHref>
                        <span
                          onClick={handleLinkClick}
                          className="block py-2 text-2xl text-white hover:bg-opacity-80 rounded transition duration-150 ease-in-out cursor-pointer"
                        >
                          Add Product
                        </span>
                      </Link>
                    )}
                    <span
                      onClick={() => {
                        signOut();
                        setOpen(false); // Close menu on logout
                      }}
                      className="block  py-2 text-2xl text-white hover:bg-opacity-80 rounded transition duration-150 ease-in-out cursor-pointer"
                    >
                      Logout
                    </span>
                  </div>
                ) : (
                  <Link href="/login" passHref>
                    <span
                      onClick={handleLinkClick}
                      className="block py-2 text-2xl text-white hover:bg-opacity-80 rounded transition duration-150 ease-in-out cursor-pointer"
                    >
                      Login
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
