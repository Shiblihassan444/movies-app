"use client";

import { useRouter } from "next/navigation";
import EpisodeNavigation from "@/components/EpisodeNavigation";

interface ClientEpisodeNavigationProps {
  seriesId: string;
  currentEpisode: number;
  currentSeason: number;
  episodes: any[];
  seriesData: any;
}

export default function ClientEpisodeNavigation({
  seriesId,
  currentEpisode,
  currentSeason,
  episodes,
  seriesData,
}: ClientEpisodeNavigationProps) {
  const router = useRouter();

  const handleEpisodeSelect = (episodeNumber: number) => {
    const newUrl = `/watch/${seriesId}?season=${currentSeason}&episode=${episodeNumber}`;
    router.push(newUrl);
  };

  return (
    <EpisodeNavigation
      seriesId={seriesId}
      currentEpisode={currentEpisode}
      currentSeason={currentSeason}
      episodes={episodes}
      seriesData={seriesData}
      onEpisodeSelect={handleEpisodeSelect}
    />
  );
}
