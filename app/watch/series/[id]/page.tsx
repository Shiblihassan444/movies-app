"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getTVSeriesDetails,
  getSeasonEpisodes,
  getImageUrl,
  formatRating,
  getYear,
  getSeriesKeyByTmdbId,
} from "@/lib/tmdb";
import EpisodeNavigation from "@/components/EpisodeNavigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Star, Calendar, Tv } from "lucide-react";

interface SeriesWatchPageProps {
  params: {
    id: string;
  };
}

export default function SeriesWatchPage({ params }: SeriesWatchPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [series, setSeries] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [seriesData, setSeriesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current episode and season from URL params
  const currentEpisode = parseInt(searchParams.get("episode") || "1");
  const currentSeason = parseInt(searchParams.get("season") || "1");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch series details from TMDB
        const seriesDetails = await getTVSeriesDetails(params.id);
        setSeries(seriesDetails);

        // Fetch season episodes from TMDB
        const seasonEpisodes = await getSeasonEpisodes(
          params.id,
          currentSeason
        );
        setEpisodes(seasonEpisodes);

        // Fetch local series data
        const seriesRes = await fetch(
          `https://shiblihassan444.github.io/movie-data/series.json?t=${new Date().getTime()}`
        );
        if (seriesRes.ok) {
          const localSeriesData = await seriesRes.json();
          // Find the series data by tmdbID
          const seriesKey = getSeriesKeyByTmdbId(localSeriesData, params.id);
          if (seriesKey) {
            setSeriesData(localSeriesData[seriesKey]);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch series data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, currentSeason]);

  const handleEpisodeSelect = (episodeNumber: number) => {
    const newUrl = `/watch/series/${params.id}?season=${currentSeason}&episode=${episodeNumber}`;
    router.push(newUrl);
  };

  const getEpisodeEmbedLink = () => {
    if (!seriesData?.seasons?.[currentSeason]?.episodes)
      return "https://gobooly.strp2p.com/#w3xbr";

    const episodeData = seriesData.seasons[currentSeason].episodes.find(
      (ep: any) => ep.episode === currentEpisode.toString()
    );
    return episodeData?.embedLink || "https://gobooly.strp2p.com/#w3xbr";
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">Loading series...</div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center text-red-500">
          {error || "Series not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      {/* Video Player */}
      <div className="relative w-fullh-[20vh] sm:h-[60vh]">
        <iframe
          src={getEpisodeEmbedLink()}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          title={`${series.name} - Season ${currentSeason} Episode ${currentEpisode}`}
        />
      </div>

      {/* Episode Navigation */}
      {episodes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 w-full">
          <EpisodeNavigation
            seriesId={params.id}
            currentEpisode={currentEpisode}
            currentSeason={currentSeason}
            episodes={episodes}
            seriesData={seriesData}
            onEpisodeSelect={handleEpisodeSelect}
          />
        </div>
      )}

      {/* Series Details */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Series Poster */}
          <div className="lg:col-span-1 max-w-[40%] md:max-w-[100%]">
            <img
              src={getImageUrl(series.poster_path, "w500")}
              alt={series.name}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Series Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-4xl font-bold mb-4">{series.name}</h1>
                <div className="text-lg text-gray-300 mb-4">
                  Season {currentSeason}, Episode {currentEpisode}
                  {episodes[currentEpisode - 1] && (
                    <span className="block text-xl font-semibold text-white mt-1">
                      "{episodes[currentEpisode - 1].name}"
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 bg-yellow-600 px-3 py-1 rounded-full">
                    <Star size={16} fill="currentColor" />
                    <span className="font-semibold">
                      {formatRating(series.vote_average)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar size={16} />
                    <span>{getYear(series.first_air_date)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-300">
                    <Tv size={16} />
                    <span>
                      {series.number_of_seasons} Season
                      {series.number_of_seasons > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Genres */}
                {series.genres && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {series.genres.map((genre: any) => (
                      <span
                        key={genre.id}
                        className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {series.overview}
                </p>
              </div>

              {/* Current Episode Overview */}
              {episodes[currentEpisode - 1]?.overview && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Episode Summary</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {episodes[currentEpisode - 1].overview}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">First Air Date</h3>
                  <p className="text-gray-300">{series.first_air_date}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rating</h3>
                  <p className="text-gray-300">
                    {formatRating(series.vote_average)}/10
                  </p>
                </div>
              </div>

              {/* Cast Section */}
              {series.credits?.cast && series.credits.cast.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-bold mb-4">Cast</h3>
                  <div className="flex flex-wrap gap-6">
                    {series.credits.cast.slice(0, 14).map((cast: any) => (
                      <div
                        key={cast.cast_id || cast.credit_id}
                        className="flex flex-col items-center w-24"
                      >
                        {cast.profile_path ? (
                          <img
                            src={getImageUrl(cast.profile_path, "w500")}
                            alt={cast.name}
                            className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-700"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-2 text-gray-400 text-xl">
                            ?
                          </div>
                        )}
                        <span
                          className="text-sm font-semibold text-white text-center truncate w-full"
                          title={cast.name}
                        >
                          {cast.name}
                        </span>
                        {cast.character && (
                          <span
                            className="text-xs text-gray-400 text-center truncate w-full"
                            title={cast.character}
                          >
                            {cast.character}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
