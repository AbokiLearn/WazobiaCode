import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYouTubeThumbnail(url: string): string {
  const videoId = url.split('v=')[1];
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.split('v=')[1];
  return `https://www.youtube.com/embed/${videoId}`;
}
