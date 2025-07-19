"use client";

import { useState } from "react";
import { Episode } from "@/lib/tmdb";
import { ChevronLeft, ChevronRight, Play, List } from "lucide-react";
import Link from "next/link";

interface EpisodeNavigationProps {
  seriesId: string;
  currentEpisode: number;
  currentSeason: number;
  episodes: Episode[];
  seriesData: any;
  onEpisodeSelect: (episode: number) => void;
}

export default function EpisodeNavigation({
  seriesId,
  currentEpisode,
  currentSeason,
  episodes,
  seriesData,
  onEpisodeSelect,
}: EpisodeNavigationProps) {
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);

  // Find current episode index
  const currentIndex = episodes.findIndex(
    (ep) => ep.episode_number === currentEpisode
  );

  // Get previous and next 5 episodes (11 total: current + 5 before + 5 after)
  const startIndex = Math.max(0, currentIndex - 5);
  const endIndex = Math.min(episodes.length, currentIndex + 6);
  const visibleEpisodes = episodes.slice(startIndex, endIndex);

  const getEpisodeEmbedLink = (episodeNumber: number) => {
    const seasonKey = String(currentSeason);
    const episodeData = seriesData?.seasons?.[seasonKey]?.episodes?.find(
      (ep: any) => ep.episode === episodeNumber.toString()
    );
    return episodeData?.embedLink || "https://gobooly.strp2p.com/#w3xbr";
  };

  if (showAllEpisodes) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            All Episodes - Season {currentSeason}
          </h3>
          <button
            onClick={() => setShowAllEpisodes(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Show Less
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {episodes.map((episode) => {
            const seasonKey = String(currentSeason);
            const hasEmbedLink = seriesData?.seasons?.[
              seasonKey
            ]?.episodes?.some(
              (ep: any) => ep.episode === episode.episode_number.toString()
            );
            const isCurrentEpisode = episode.episode_number === currentEpisode;

            return (
              <div
                key={episode.id}
                className={`bg-gray-800 rounded-lg p-4 transition-all duration-200 ${
                  hasEmbedLink || isCurrentEpisode
                    ? "cursor-pointer hover:bg-gray-700"
                    : "opacity-50 cursor-not-allowed"
                } ${isCurrentEpisode ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => {
                  if (hasEmbedLink || isCurrentEpisode) {
                    onEpisodeSelect(episode.episode_number);
                    setShowAllEpisodes(false);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    {isCurrentEpisode ? (
                      <Play size={20} className="text-blue-500" />
                    ) : hasEmbedLink ? (
                      <span className="text-white font-semibold">
                        {episode.episode_number}
                      </span>
                    ) : (
                      <span className="text-gray-500 font-semibold">
                        {episode.episode_number}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold text-sm line-clamp-1 ${
                        hasEmbedLink || isCurrentEpisode
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      Episode {episode.episode_number}: {episode.name}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {episode.overview || "No description available"}
                    </p>
                    {episode.air_date && (
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(episode.air_date).toLocaleDateString()}
                      </p>
                    )}
                    {!hasEmbedLink && !isCurrentEpisode && (
                      <p className="text-red-400 text-xs mt-1 font-medium">
                        Not available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Episodes</h3>
        <button
          onClick={() => setShowAllEpisodes(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <List size={16} />
          See All Episodes
        </button>
      </div>

      {/* Quick Navigation - Previous and Next 5 Episodes */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {visibleEpisodes.map((episode) => {
          const isCurrentEpisode = episode.episode_number === currentEpisode;
          const seasonKey = String(currentSeason);
          const hasEmbedLink = seriesData?.seasons?.[seasonKey]?.episodes?.some(
            (ep: any) => ep.episode === episode.episode_number.toString()
          );

          return (
            <button
              key={episode.id}
              onClick={() => onEpisodeSelect(episode.episode_number)}
              disabled={!hasEmbedLink && !isCurrentEpisode}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[120px] ${
                isCurrentEpisode
                  ? "bg-blue-600 text-white shadow-lg"
                  : hasEmbedLink
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "bg-gray-900 text-gray-500 cursor-not-allowed opacity-50"
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">
                  {isCurrentEpisode && <span className="mr-1">▶</span>}
                  Ep {episode.episode_number}
                </div>
                <div
                  className="text-xs opacity-75 truncate max-w-24"
                  title={episode.name}
                >
                  {episode.name || "No title"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Previous/Next Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => onEpisodeSelect(currentEpisode - 1)}
          disabled={
            currentEpisode <= 1 ||
            !seriesData?.seasons?.[String(currentSeason)]?.episodes?.some(
              (ep: any) => ep.episode === (currentEpisode - 1).toString()
            )
          }
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="text-gray-400 text-sm">
          Episode {currentEpisode} of {episodes.length}
        </span>

        <button
          onClick={() => onEpisodeSelect(currentEpisode + 1)}
          disabled={
            currentEpisode >= episodes.length ||
            !seriesData?.seasons?.[String(currentSeason)]?.episodes?.some(
              (ep: any) => ep.episode === (currentEpisode + 1).toString()
            )
          }
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
