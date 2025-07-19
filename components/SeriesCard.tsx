"use client";

import Link from "next/link";
import { TVSeries } from "@/lib/tmdb";
import { getImageUrl, formatRating, getYear } from "@/lib/tmdb";
import { Star } from "lucide-react";

interface SeriesCardProps {
  series: TVSeries;
  size?: "sm" | "md" | "lg";
}

export default function SeriesCard({ series, size = "md" }: SeriesCardProps) {
  const cardSizes = {
    sm: "w-40 h-60",
    md: "w-48 h-72",
    lg: "w-56 h-80",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // Determine the link based on whether this is a season-specific card
  const linkHref = (series as any).isSeasonCard
    ? `/watch/series/${(series as any).originalId}?season=${
        (series as any).season
      }&episode=1`
    : `/watch/series/${series.id}?season=1&episode=1`;

  return (
    <Link href={linkHref}>
      <div className="group relative cursor-pointer transition-all duration-300 hover:scale-105">
        <div
          className={`${cardSizes[size]} relative overflow-hidden rounded-lg bg-gray-800`}
        >
          {/* Series Poster */}
          <img
            src={getImageUrl(series.poster_path)}
            alt={series.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Series Badge */}
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
            {(series as any).isSeasonCard
              ? `Season ${(series as any).season}`
              : "TV Series"}
          </div>

          {/* Rating */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            <span className="text-xs">{formatRating(series.vote_average)}</span>
          </div>

          {/* Series Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className={`${textSizes[size]} font-bold mb-1 line-clamp-2`}>
              {series.name}
            </h3>
            <p className="text-sm text-gray-300">
              {getYear(series.first_air_date)}
            </p>
            {!(series as any).isSeasonCard && series.number_of_seasons && (
              <p className="text-xs text-gray-400">
                {series.number_of_seasons} Season
                {series.number_of_seasons > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
