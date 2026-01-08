import { useEffect, useMemo, useState } from 'react';

export default function Slideshow({ imageUrls, slideIntervalMs, onInteract }) {
  const safeSlideIntervalMs = useMemo(() => {
    if (typeof slideIntervalMs !== 'number') return 6000;
    if (slideIntervalMs < 2000) return 2000;
    return slideIntervalMs;
  }, [slideIntervalMs]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % imageUrls.length);
    }, safeSlideIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [imageUrls, safeSlideIntervalMs]);

  const currentImageUrl =
    Array.isArray(imageUrls) && imageUrls.length > 0
      ? imageUrls[currentIndex % imageUrls.length]
      : null;

  return (
    <div className="slideshow" onClick={onInteract}>
      {currentImageUrl ? (
        <img src={currentImageUrl} alt="" className="slideshow-image" />
      ) : (
        <div className="slideshow-empty">No images found</div>
      )}
    </div>
  );
}
