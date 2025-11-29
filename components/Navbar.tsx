import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="shrink-0">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Aedura<span className="text-blue-500">.</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#product"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Product
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#vision"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Vision
            </Link>
            <Link
              href="#tech"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
            >
              Tech
            </Link>
          </div>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/login" rel="noopener noreferrer">
              Login
            </Link>
            <button className="hidden sm:flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 text-sm shadow-lg shadow-blue-500/30">
              Our Whitepaper
              <ArrowUpRight size={16} />
            </button>
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-900 transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden backdrop-animate z-40"
              onClick={closeMenu}
              style={{ top: "64px" }}
            />

            {/* Menu Panel */}
            <div className="fixed top-16 sm:top-20 right-0 bottom-0 w-full sm:w-80 bg-black/95 backdrop-blur-md border-l border-gray-800 md:hidden menu-slide-in z-50 overflow-y-auto">
              <div className="px-4 py-6 space-y-2">
                <Link
                  href="#product"
                  onClick={closeMenu}
                  className="menu-item block px-5 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-500/30"
                >
                  Product
                </Link>
                <Link
                  href="#features"
                  onClick={closeMenu}
                  className="menu-item block px-5 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-500/30"
                >
                  Features
                </Link>
                <Link
                  href="#vision"
                  onClick={closeMenu}
                  className="menu-item block px-5 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-500/30"
                >
                  Vision
                </Link>
                <Link
                  href="#tech"
                  onClick={closeMenu}
                  className="menu-item block px-5 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-500/30"
                >
                  Tech
                </Link>
                <button className="menu-item w-full mt-6 flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
                  Our Whitepaper
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
