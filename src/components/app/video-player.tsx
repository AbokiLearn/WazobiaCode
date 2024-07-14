import { getYouTubeEmbedUrl } from '@/lib/utils';

export default function VideoPlayer({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const embedUrl = getYouTubeEmbedUrl(url);
  return (
    <div className="flex mx-auto">
      <iframe
        className="aspect-video w-full h-[300px]"
        src={embedUrl}
        title={title}
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
