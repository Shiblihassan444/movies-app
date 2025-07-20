"use client";

import { useState } from "react";
import { Movie } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieSectionProps {
  title: string;
  movies: { movie: Movie; category?: string }[];
  showSeeAll?: boolean;
}

export default function MovieSection({
  title,
  movies,
  showSeeAll = false,
}: MovieSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemWidth = 208; // 48 * 4 + 16 (gap)
  const maxScroll = Math.max(0, movies.length * itemWidth - 5 * itemWidth);

  const scrollLeft = () => {
    setScrollPosition((prev) => Math.max(0, prev - itemWidth * 3));
  };

  const scrollRight = () => {
    setScrollPosition((prev) => Math.min(maxScroll, prev + itemWidth * 3));
  };

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-1 h-6 bg-red-600 rounded-full"></div>
            {title}
          </h2>

          {showSeeAll && (
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
              SEE ALL
            </button>
          )}
        </div>

        {/* Movies Carousel */}
        {/* Desktop: Carousel with buttons, Mobile: Horizontal scroll */}
        <div className="relative hidden sm:block">
          {/* Navigation Buttons */}
          {scrollPosition > 0 && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {scrollPosition < maxScroll && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}
          {/* Movies Container */}
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300"
              style={{ transform: `translateX(-${scrollPosition}px)` }}
            >
              {movies.map((item, index) => (
                <div key={item.movie.id} className="flex-shrink-0">
                  <MovieCard
                    movie={item.movie}
                    category={item.category}
                    size="md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Mobile: horizontal scrollable row */}
        <div className="sm:hidden overflow-x-auto -mx-2 px-2">
          <div className="flex gap-2 flex-nowrap">
            {movies.map((item, index) => (
              <div key={item.movie.id} className="flex-shrink-0">
                <MovieCard
                  movie={item.movie}
                  category={item.category}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
