interface PreviewPlayerProps {
  videoUrl: string | null;
  isLoading: boolean;
}

export default function PreviewPlayer({ videoUrl, isLoading }: PreviewPlayerProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="w-full max-w-2xl mx-auto aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Preview will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <video
        src={videoUrl}
        controls
        className="w-full aspect-video rounded-lg shadow-lg"
        autoPlay
        loop
      />
    </div>
  );
} 