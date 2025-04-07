import React, { useState, useMemo } from "react";
import { MessageCircle, PenTool as Tool, Search, X, Menu } from "lucide-react";
import DIYChatbot from "./DIYChatbot";

const transition = "transition-all duration-300 ease-in-out";

const SearchBar = ({ value, onChange, onFocus, onBlur, onClear }) => (
  <div className='relative'>
    <input
      type='text'
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder='Search for projects...'
      className={`w-full h-full px-4 py-5 bg-gray-900 border border-neutral-400 hover:border-blue-500 rounded-xl focus:outline-none ${transition}`}
      aria-label='Search projects'
    />
    {value && (
      <button
        onClick={onClear}
        aria-label='Clear search'
        className={`absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 ${transition}`}
      >
        <X className='h-5 w-5' />
      </button>
    )}
    <Search className='absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
  </div>
);

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const gradientText = useMemo(
    () => (
      <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500 animate-gradient'>
        Create. Build. Learn.
      </h1>
    ),
    []
  );

  return (
    <div className='relative h-screen bg-black text-white'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 bg-black border-b border-neutral-500 z-50'>
        <div className='flex items-center justify-between py-5 px-4'>
          <div className='flex items-center'>
            <Tool className='h-8 w-8 text-emerald-500' />
            <span className='ml-2 text-3xl uppercase font-bold'>
              DIY Master
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='flex items-center text-xl space-x-4'>
              <a
                href='/projects'
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md ${transition}`}
              >
                Projects
              </a>
              <a
                href='/tutorials'
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md ${transition}`}
              >
                Tutorials
              </a>
              <a
                href='/community'
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md ${transition}`}
              >
                Community
              </a>
              <a
                href='/about'
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md ${transition}`}
              >
                About
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label='Toggle menu'
              className='text-gray-300 hover:text-white p-2'
            >
              <Menu className='h-6 w-6' />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden bg-gray-900 pb-4 px-4'>
            <div className='flex flex-col space-y-2'>
              <a
                href='/projects'
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md ${transition}`}
              >
                Projects
              </a>
              <a
                href='/tutorials'
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md ${transition}`}
              >
                Tutorials
              </a>
              <a
                href='/community'
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md ${transition}`}
              >
                Community
              </a>
              <a
                href='/about'
                className={`text-gray-300 hover:text-white px-3 py-2 rounded-md ${transition}`}
              >
                About
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className='relative flex h-[90vh] bg-neutral-70 justify-center items-center pt-16'>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            {gradientText}
            <p className='mt-3 text-xl font-mono text-gray-300'>
              Discover thousands of DIY projects and join our community of
              makers.
            </p>

            {/* Search Bar */}
            <div className='mt-10 max-w-xl mx-auto'>
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onClear={handleSearchClear}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className='fixed bottom-4 right-4 z-50'>
        <DIYChatbot />
      </div>
    </div>
  );
};

export default Home;
