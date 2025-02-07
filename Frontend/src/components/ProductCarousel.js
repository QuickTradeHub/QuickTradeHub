import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-96 bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden shadow-lg">
      <img src={images[currentIndex]} alt={`${title} ${currentIndex + 1}`} className="object-cover w-full h-full" />
      
      <button 
        onClick={prevSlide} 
        className="absolute left-4 text-4xl text-white bg-gray-800 bg-opacity-50 p-3 rounded-full hover:bg-opacity-80 transition"
      >
        <FaChevronLeft />
      </button>

      <button 
        onClick={nextSlide} 
        className="absolute right-4 text-4xl text-white bg-gray-800 bg-opacity-50 p-3 rounded-full hover:bg-opacity-80 transition"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ProductCarousel;
