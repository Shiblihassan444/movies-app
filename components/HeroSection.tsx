'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Movie } from '@/lib/tmdb';
import { getImageUrl, getYear } from '@/lib/tmdb';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  movies: Movie[];
}

export default function HeroSection({ movies }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [movies.length]);

  if (!movies.length) return null;

  const currentMovie = movies[currentSlide];

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(currentMovie.backdrop_path, 'original')}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4">
        <div className="text-white max-w-2xl">
          <div className="mb-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              MOVIE
            </span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            {currentMovie.title}
          </h1>
          
          <p className="text-xl mb-2 text-gray-300">
            {getYear(currentMovie.release_date)}
          </p>
          
          <p className="text-lg mb-8 text-gray-300 line-clamp-3">
            {currentMovie.overview}
          </p>
          
          <Link href={`/watch/${currentMovie.id}`}>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <Play size={20} />
              Watch Now
            </button>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % movies.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-red-600' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}