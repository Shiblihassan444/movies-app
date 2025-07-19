import {
  getMovieDetails,
  getMoviesByIds,
  getTVSeriesDetails,
  getSeasonEpisodes,
} from "@/lib/tmdb";
import { getImageUrl, formatRating, getYear } from "@/lib/tmdb";

import MovieSection from "@/components/MovieSection";
import ClientEpisodeNavigation from "@/components/ClientEpisodeNavigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Star, Calendar, Clock } from "lucide-react";

interface WatchPageProps {
  params: {
    id: string;
  };
  searchParams: {
    episode?: string;
    season?: string;
  };
}

export default async function WatchPage({
  params,
  searchParams,
}: WatchPageProps) {
  // Fetch movies data from external URL
  const timestamp = new Date().getTime();
  const res = await fetch(
    `https://shiblihassan444.github.io/movie-data/movies.json?t=${timestamp}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch movies data");
  }
  const moviesData = await res.json();

  // Fetch series data
  let seriesData = null;
  try {
    const seriesRes = await fetch(
      `https://shiblihassan444.github.io/movie-data/series.json?t=${timestamp}`
    );
    if (seriesRes.ok) {
      seriesData = await seriesRes.json();
    }
  } catch (error) {
    console.log("Series data not available");
  }

  // Check if this is a series first
  let isSeries = false;
  let seriesInfo: any = null;
  if (seriesData) {
    seriesInfo = Object.values(seriesData).find(
      (s: any) => s.tmdbID === params.id
    );
    isSeries = !!seriesInfo;
  }

  if (isSeries && seriesInfo) {
    // Handle series viewing
    const currentEpisode = parseInt(searchParams.episode || "1");
    const currentSeason = parseInt(
      searchParams.season || (seriesInfo as any).season || "1"
    );

    const series = await getTVSeriesDetails(params.id);
    const episodes = await getSeasonEpisodes(params.id, currentSeason);

    const getEpisodeEmbedLink = () => {
      const episodeData = (seriesInfo as any).episodes?.find(
        (ep: any) => ep.episode === currentEpisode.toString()
      );
      return episodeData?.embedLink || "https://gobooly.strp2p.com/#w3xbr";
    };

    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        {/* Video Player */}
        <div className="relative w-full px-4 h-[40vh] sm:h-[60vh] bg-black">
          <iframe
            src={getEpisodeEmbedLink()}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
            title={`${series.name} - Season ${currentSeason} Episode ${currentEpisode}`}
          />
        </div>

        {/* Episode Navigation - Only for series */}
        <div className="max-w-7xl mx-auto px-4 w-full">
          <ClientEpisodeNavigation
            seriesId={params.id}
            currentEpisode={currentEpisode}
            currentSeason={currentSeason}
            episodes={episodes}
            seriesData={seriesInfo as any}
          />
        </div>

        {/* Series Details */}
        <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Series Poster */}
            <div className="lg:col-span-1">
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

                {/* Episode Overview */}
                {episodes[currentEpisode - 1]?.overview && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Episode Summary</h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {episodes[currentEpisode - 1].overview}
                    </p>
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

  // Handle movie viewing (existing logic)
  const movie = await getMovieDetails(params.id);

  // Find the embed link for this movie
  const heroArr = Array.isArray(moviesData.hero) ? moviesData.hero : [];
  const featuredArr = Array.isArray(moviesData.featured)
    ? moviesData.featured
    : [];
  const latestArr = Array.isArray(moviesData.latest) ? moviesData.latest : [];
  const allMovies = [...heroArr, ...featuredArr, ...latestArr];

  const movieData = allMovies.find((m: any) => m.tmdbID === params.id);
  const embedLink = movieData?.embedLink || "https://gobooly.strp2p.com/#w3xbr";

  // Latest Movies Section
  let latestSection = null;
  // Recommendation Movies Section
  let recommendationSection = null;
  // Find movies with the same category as the current movie (excluding itself)
  const currentCategory = movieData?.category;
  if (currentCategory) {
    const recommendedArr = allMovies.filter(
      (m: any) => m.category === currentCategory && m.tmdbID !== params.id
    );
    if (recommendedArr.length > 0) {
      const recommendedMovies = await getMoviesByIds(
        recommendedArr.map((m: any) => m.tmdbID)
      );
      const withCategories = recommendedMovies.map(
        (movie: any, idx: number) => {
          const entry = recommendedArr[idx] as Record<string, any>;
          if (typeof entry.category === "string") {
            return { movie, category: entry.category };
          }
          return { movie };
        }
      );
      recommendationSection = (
        <div className="mt-2">
          <MovieSection
            title={`Recommended in ${currentCategory}`}
            movies={withCategories}
          />
        </div>
      );
    }
  }
  if (latestArr.length > 0) {
    const latestMovies = await getMoviesByIds(
      latestArr.map((m: any) => m.tmdbID)
    );
    const withCategories = latestMovies.map((movie: any, idx: number) => {
      const entry = latestArr[idx] as Record<string, any>;
      if (typeof entry.category === "string") {
        return { movie, category: entry.category };
      }
      return { movie };
    });
    latestSection = (
      <div className="mt-16">
        <MovieSection title="Latest Movies" movies={withCategories} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      {/* Video Player */}
      <div className="relative w-full px-4 h-[20vh] sm:h-[60vh]">
        <iframe
          src={embedLink}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allowFullScreen
          title={movie.title}
        />
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1 max-w-[40%] md:max-w-[100%]">
            <img
              src={getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 bg-yellow-600 px-3 py-1 rounded-full">
                    <Star size={16} fill="currentColor" />
                    <span className="font-semibold">
                      {formatRating(movie.vote_average)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar size={16} />
                    <span>{getYear(movie.release_date)}</span>
                  </div>

                  {movie.runtime && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock size={16} />
                      <span>{movie.runtime} min</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre) => (
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
                  {movie.overview}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Release Date</h3>
                  <p className="text-gray-300">{movie.release_date}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rating</h3>
                  <p className="text-gray-300">
                    {formatRating(movie.vote_average)}/10
                  </p>
                </div>
              </div>
              {/* Cast Section */}
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-bold mb-4">Cast</h3>
                  <div className="flex flex-wrap gap-6">
                    {movie.credits.cast
                      .slice(0, 14)
                      .map((cast: import("@/lib/tmdb").CastMember) => (
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
      {recommendationSection}
      {latestSection}
      <Footer />
    </div>
  );
}
