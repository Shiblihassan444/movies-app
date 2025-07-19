const TMDB_API_KEY = "b14140182365c8366913665e9e664d1a";

export interface CastMember {
  cast_id?: number;
  credit_id?: string;
  name: string;
  character?: string;
  profile_path?: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    cast: CastMember[];
  };
}

export interface TVSeries {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  credits?: {
    cast: CastMember[];
  };
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
  still_path?: string;
}

export async function getMovieDetails(tmdbID: string): Promise<Movie> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
}

export async function getTVSeriesDetails(tmdbID: string): Promise<TVSeries> {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tmdbID}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch TV series details");
  }

  return response.json();
}

export async function getSeasonEpisodes(
  tmdbID: string,
  seasonNumber: number
): Promise<Episode[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tmdbID}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch season episodes");
  }

  const seasonData = await response.json();
  return seasonData.episodes || [];
}

export async function getMoviesByIds(tmdbIDs: string[]): Promise<Movie[]> {
  const promises = tmdbIDs.map((id) => getMovieDetails(id));
  return Promise.all(promises);
}

export async function getTVSeriesByIds(tmdbIDs: string[]): Promise<TVSeries[]> {
  const promises = tmdbIDs.map((id) => getTVSeriesDetails(id));
  return Promise.all(promises);
}

export function getImageUrl(
  path: string,
  size: "w500" | "w780" | "original" = "w500"
): string {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString();
}

export function getSeriesKeyByTmdbId(
  seriesData: any,
  tmdbId: string
): string | null {
  for (const key in seriesData) {
    if (seriesData[key].tmdbID === tmdbId) {
      return key;
    }
  }
  return null;
}
