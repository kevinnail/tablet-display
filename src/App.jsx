import { useEffect, useMemo, useState } from 'react';
import Slideshow from './components/Slideshow/Slideshow.jsx';
import Overlay from './components/Overlay/Overlay..jsx';

import glass01 from './assets/images/glass-01.jpg';
import glass02 from './assets/images/glass-02.jpg';
import glass03 from './assets/images/glass-03.jpg';

export default function App() {
  const imageUrls = useMemo(() => [glass01, glass02, glass03], []);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [screenOff, setScreenOff] = useState(false);
  const [panel, setPanel] = useState('none'); // 'none' | 'about' | 'links'

  useEffect(() => {
    if (!overlayVisible) return;

    const timeoutId = window.setTimeout(() => {
      setOverlayVisible(false);
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, [overlayVisible]);

  const showOverlay = () => {
    if (screenOff) return;
    setOverlayVisible(true);
  };

  const closePanelsAndOverlay = () => {
    setPanel('none');
    setOverlayVisible(false);
  };

  if (screenOff) {
    return (
      <div className="screen-off" onClick={() => setScreenOff(false)}>
        <div className="screen-off-hint">Tap to wake</div>
      </div>
    );
  }

  return (
    <div className="app-root" onClick={showOverlay}>
      <Slideshow imageUrls={imageUrls} slideIntervalMs={6000} onInteract={showOverlay} />

      <Overlay
        visible={overlayVisible}
        onPressAbout={() => setPanel('about')}
        onPressLinks={() => setPanel('links')}
        onPressOff={() => {
          closePanelsAndOverlay();
          setScreenOff(true);
        }}
      />

      <div className="footer-text">Glass art by Kevin Nail · tap for info · off</div>

      {panel === 'about' ? (
        <div className="panel" onClick={(event) => event.stopPropagation()}>
          <div className="panel-card">
            <div className="panel-title">About</div>
            <div className="panel-body">
              Glass art and interface designed and built by Kevin Nail.
              <br />
              <br />
              If you want to browse quietly, no need to interact. Tap anywhere to hide.
            </div>
            <button type="button" className="panel-close" onClick={closePanelsAndOverlay}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {panel === 'links' ? (
        <div className="panel" onClick={(event) => event.stopPropagation()}>
          <div className="panel-card">
            <div className="panel-title">See more work</div>
            <div className="panel-body">
              These can be online when the tablet has internet:
              <div className="panel-links">
                <a href="https://example.com" target="_blank" rel="noreferrer">
                  Website
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </div>
            </div>
            <button type="button" className="panel-close" onClick={closePanelsAndOverlay}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
