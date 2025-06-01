import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface DownloadButtonProps {
  videoUrl: string | null;
  isLoading: boolean;
}

export default function DownloadButton({ videoUrl, isLoading }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!videoUrl) return;
    
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'animated-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !videoUrl) {
    return null;
  }

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
      Download Video
    </button>
  );
} 