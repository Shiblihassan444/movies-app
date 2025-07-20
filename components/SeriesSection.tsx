"use client";

import { useState } from "react";
import { TVSeries } from "@/lib/tmdb";
import SeriesCard from "./SeriesCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SeriesSectionProps {
  title: string;
  series: TVSeries[];
  showSeeAll?: boolean;
}

export default function SeriesSection({
  title,
  series,
  showSeeAll = false,
}: SeriesSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemWidth = 208; // 48 * 4 + 16 (gap)
  const maxScroll = Math.max(0, series.length * itemWidth - 5 * itemWidth);

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
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            {title}
          </h2>

          {showSeeAll && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
              SEE ALL
            </button>
          )}
        </div>

        {/* Series Carousel */}
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
          {/* Series Container */}
          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300"
              style={{ transform: `translateX(-${scrollPosition}px)` }}
            >
              {series.map((seriesItem) => (
                <div key={seriesItem.id} className="flex-shrink-0">
                  <SeriesCard series={seriesItem} size="md" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Mobile: horizontal scrollable row */}
        <div className="sm:hidden overflow-x-auto -mx-2 px-2">
          <div className="flex gap-2 flex-nowrap">
            {series.map((seriesItem) => (
              <div key={seriesItem.id} className="flex-shrink-0">
                <SeriesCard series={seriesItem} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
