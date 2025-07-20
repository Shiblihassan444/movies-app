"use client";
import HeroSection from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import SeriesSection from "@/components/SeriesSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getMoviesByIds, getTVSeriesByIds } from "@/lib/tmdb";
import { useState } from "react";
import { Search } from "lucide-react";

import React from "react";

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex justify-center mt-6 mb-[-30px] px-4 w-full">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search movies and series..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 sm:pl-10 px-3 sm:px-4 py-2 rounded-lg w-full bg-zinc-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [moviesData, setMoviesData] = React.useState<any>(null);
  const [seriesData, setSeriesData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sections, setSections] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const timestamp = new Date().getTime();

        // Fetch movies data
        const moviesRes = await fetch(
          `https://shiblihassan444.github.io/movie-data/movies.json?t=${timestamp}`
        );
        if (!moviesRes.ok) throw new Error("Failed to fetch movies data");
        const moviesData = await moviesRes.json();
        setMoviesData(moviesData);

        // Fetch series data
        const seriesRes = await fetch(
          `https://shiblihassan444.github.io/movie-data/series.json?t=${timestamp}`
        );
        if (seriesRes.ok) {
          const seriesData = await seriesRes.json();
          console.log("Series data loaded:", seriesData);
          setSeriesData(seriesData);
        } else {
          console.warn("Failed to fetch series data");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const renderSections = async () => {
      if (!moviesData) return;

      const sectionKeys = Object.keys(moviesData).sort((a, b) => {
        if (a === "hero") return -1;
        if (b === "hero") return 1;
        return 0;
      });

      const formatTitle = (key: string) => {
        if (key.toLowerCase() === "latest") return "Latest Movies";
        if (key.toLowerCase() === "featured") return "Featured";
        if (key === "Action") return "Action";
        if (key === "hero") return "";
        return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      };

      const movieSections = await Promise.all(
        sectionKeys.map(async (key) => {
          const moviesArr = moviesData[key];
          if (!Array.isArray(moviesArr) || moviesArr.length === 0) return null;
          const movies = await getMoviesByIds(
            moviesArr.map((m: any) => m.tmdbID)
          );
          if (key === "hero") {
            return (
              <React.Fragment key="hero">
                <HeroSection movies={movies} />
                <SearchBar value={search} onChange={setSearch} />
              </React.Fragment>
            );
          }
          // Combine with categories if present
          let filtered = movies;
          let filteredArr = moviesArr;
          if (search.trim()) {
            filtered = movies.filter((movie: any) =>
              movie.title?.toLowerCase().includes(search.toLowerCase())
            );
            filteredArr = moviesArr.filter((_: any, idx: number) =>
              movies[idx]?.title?.toLowerCase().includes(search.toLowerCase())
            );
            if (filtered.length === 0) return null;
          }
          const withCategories = filtered.map((movie: any, idx: number) => {
            const entry = filteredArr[idx] as Record<string, any>;
            if (typeof entry?.category === "string") {
              return { movie, category: entry.category };
            }
            return { movie };
          });
          const title = formatTitle(key);
          return (
            <MovieSection
              key={String(key)}
              title={title}
              movies={withCategories}
            />
          );
        })
      );

      // Add series section if series data is available
      let seriesSection = null;
      if (seriesData) {
        try {
          console.log("Processing series data:", seriesData);
          const seriesKeys = Object.keys(seriesData);
          console.log("Series keys:", seriesKeys);
          if (seriesKeys.length > 0) {
            const seriesIds = seriesKeys.map((key) => seriesData[key].tmdbID);
            console.log("Series IDs:", seriesIds);
            const series = await getTVSeriesByIds(seriesIds);
            console.log("Fetched series from TMDB:", series);

            // Create season-specific cards for series with multiple seasons
            const expandedSeries: any[] = [];
            console.log("Starting to process series for season expansion...");
            series.forEach((serie: any, index: number) => {
              const seriesKey = seriesKeys[index];
              const seriesInfo = seriesData[seriesKey];
              console.log(`Processing ${seriesKey}:`, seriesInfo);

              if (seriesInfo && seriesInfo.seasons) {
                const seasonNumbers = Object.keys(seriesInfo.seasons);
                console.log(
                  `${seriesKey} has ${seasonNumbers.length} seasons:`,
                  seasonNumbers
                );

                // For series with multiple seasons, create separate cards for each season
                if (seasonNumbers.length > 1) {
                  console.log(
                    `Creating separate cards for ${seriesKey} seasons`
                  );
                  seasonNumbers.forEach((seasonNumber) => {
                    const seasonCard = {
                      ...serie,
                      id: `${serie.id}-season-${seasonNumber}`, // Unique ID for each season
                      originalId: serie.id, // Keep original ID for linking
                      season: parseInt(seasonNumber),
                      name: `${serie.name} - Season ${seasonNumber}`,
                      isSeasonCard: true,
                    };
                    console.log(`Created season card:`, seasonCard);
                    expandedSeries.push(seasonCard);
                  });
                } else {
                  // For series with only one season, keep as single card
                  console.log(`Keeping ${seriesKey} as single card`);
                  expandedSeries.push(serie);
                }
              } else {
                // Fallback for series without season data
                console.log(
                  `No season data for ${seriesKey}, keeping as single card`
                );
                expandedSeries.push(serie);
              }
            });
            console.log("Final expandedSeries:", expandedSeries);

            let filteredSeries = expandedSeries;
            if (search.trim()) {
              filteredSeries = expandedSeries.filter((serie: any) =>
                serie.name?.toLowerCase().includes(search.toLowerCase())
              );
            }

            if (filteredSeries.length > 0) {
              console.log(
                "Creating series section with",
                filteredSeries.length,
                "series/seasons"
              );
              seriesSection = (
                <SeriesSection
                  key="tv-series"
                  title="TV Series"
                  series={filteredSeries}
                  showSeeAll={true}
                />
              );
            }
          }
        } catch (err) {
          console.error("Error loading series:", err);
        }
      } else {
        console.log("No series data available");
      }

      const allSections = [...movieSections.filter(Boolean)];
      if (seriesSection) {
        allSections.push(seriesSection);
      }
      setSections(allSections.filter(Boolean));
    };
    renderSections();
  }, [moviesData, seriesData, search]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      {loading ? (
        <div className="text-white text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : (
        <>
          <div className="block sm:hidden overflow-x-auto whitespace-nowrap">
            {sections}
          </div>
          <div className="hidden sm:block">{sections}</div>
        </>
      )}
      <Footer />
    </div>
  );
}
