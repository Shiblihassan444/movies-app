'use client';

import Link from 'next/link';
import { Movie } from '@/lib/tmdb';
import { getImageUrl, formatRating, getYear } from '@/lib/tmdb';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function MovieCard({ movie, category, size = 'md' }: MovieCardProps) {
  const cardSizes = {
    sm: 'w-40 h-60',
    md: 'w-48 h-72',
    lg: 'w-56 h-80'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <Link href={`/watch/${movie.id}`}>
      <div className="group relative cursor-pointer transition-all duration-300 hover:scale-105">
        <div className={`${cardSizes[size]} relative overflow-hidden rounded-lg bg-gray-800`}>
          {/* Movie Poster */}
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          {category && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
              {category}
            </div>
          )}
          
          {/* Rating */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            <span className="text-xs">{formatRating(movie.vote_average)}</span>
          </div>
          
          {/* Movie Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className={`${textSizes[size]} font-bold mb-1 line-clamp-2`}>
              {movie.title}
            </h3>
            <p className="text-sm text-gray-300">
              {getYear(movie.release_date)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}