import { useEffect, useMemo, useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getSquareSizePx(viewportWidthPx, viewportHeightPx) {
  // Matches your CSS intent: square fits inside viewport with margin
  return 0.92 * Math.min(viewportWidthPx, viewportHeightPx);
}

function getMaxXOffsetPx(viewportWidthPx, viewportHeightPx) {
  const squareSizePx = getSquareSizePx(viewportWidthPx, viewportHeightPx);
  const horizontalGutterPx = Math.max(0, viewportWidthPx - squareSizePx);

  // Stay safely inside the gutter so we do not clip rounded corners/shadow
  return 0.45 * horizontalGutterPx;
}

function pickXOffsetPx(maxXOffsetPx) {
  if (maxXOffsetPx <= 1) return 0;

  // Bias toward using horizontal space: more often near edges than center
  const randomValue = Math.random();
  const sign = Math.random() < 0.5 ? -1 : 1;

  // Exponent < 1 biases toward larger magnitudes
  const magnitude = Math.pow(randomValue, 0.55) * maxXOffsetPx;

  return sign * magnitude;
}

export default function Slideshow({ imageUrls, slideIntervalMs, onInteract }) {
  const safeSlideIntervalMs = useMemo(() => {
    if (typeof slideIntervalMs !== 'number') return 6000;
    if (slideIntervalMs < 2000) return 2000;
    return slideIntervalMs;
  }, [slideIntervalMs]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // For crossfade
  const [previousImageUrl, setPreviousImageUrl] = useState(null);
  const initialImageUrl = imageUrls[0];
  const [currentImageUrl, setCurrentImageUrl] = useState(initialImageUrl);
  const [isFadingIn, setIsFadingIn] = useState(true);

  // For per-slide placement
  const [xOffsetPx, setXOffsetPx] = useState(0);
  const maxXOffsetPxRef = useRef(0);

  useEffect(() => {
    const viewportWidthPx = window.innerWidth;
    const viewportHeightPx = window.innerHeight;
    maxXOffsetPxRef.current = getMaxXOffsetPx(viewportWidthPx, viewportHeightPx);
    setXOffsetPx(pickXOffsetPx(maxXOffsetPxRef.current));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidthPx = window.innerWidth;
      const viewportHeightPx = window.innerHeight;
      maxXOffsetPxRef.current = getMaxXOffsetPx(viewportWidthPx, viewportHeightPx);
      // Do not force reposition on resize, only clamp current
      setXOffsetPx((previousOffsetPx) =>
        clamp(previousOffsetPx, -maxXOffsetPxRef.current, maxXOffsetPxRef.current)
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;
    if (!currentImageUrl) return;

    const intervalId = window.setInterval(() => {
      const nextIndex = (currentIndex + 1) % imageUrls.length;
      const nextImageUrl = imageUrls[nextIndex];

      setPreviousImageUrl(currentImageUrl);
      setCurrentImageUrl(nextImageUrl);
      setCurrentIndex(nextIndex);

      // Pick the position for the new slide before it fades in
      setXOffsetPx(pickXOffsetPx(maxXOffsetPxRef.current));

      // Trigger fade-in
      setIsFadingIn(false);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsFadingIn(true);
        });
      });
    }, safeSlideIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [currentIndex, currentImageUrl, imageUrls, safeSlideIntervalMs]);

  if (!currentImageUrl) {
    return (
      <div className="slideshow" onClick={onInteract}>
        <div className="slideshow-empty">No images found</div>
      </div>
    );
  }

  const foregroundStyle = {
    transform: `translate(calc(-50% + ${xOffsetPx}px), -50%)`,
  };

  return (
    <div className="slideshow" onClick={onInteract}>
      <div
        className="slideshow-background"
        style={{ backgroundImage: `url(${currentImageUrl})` }}
      />

      {previousImageUrl ? (
        <div className="slideshow-foreground-layer" style={foregroundStyle}>
          <img
            src={previousImageUrl}
            alt=""
            className="slideshow-image-contain slideshow-image-fade-out"
          />
        </div>
      ) : null}

      <div className="slideshow-foreground-layer" style={foregroundStyle}>
        <img
          src={currentImageUrl}
          alt=""
          className={[
            'slideshow-image-contain',
            isFadingIn ? 'slideshow-image-fade-in' : 'slideshow-image-fade-start',
          ].join(' ')}
        />
      </div>
    </div>
  );
}
