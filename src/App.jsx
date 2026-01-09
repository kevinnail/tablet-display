import { useEffect, useMemo, useState } from 'react';
import Slideshow from './components/Slideshow/Slideshow.jsx';
import Overlay from './components/Overlay/Overlay.jsx';

import { loadImagesFromFolder } from './utils/loadImages';

import qrCode from './assets/qrCode.png'
import slgLogo from './assets/logo-sq-1.png'

export default function App() {
const imageUrls = useMemo(() => loadImagesFromFolder(), []);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [screenOff, setScreenOff] = useState(false);
  const [panel, setPanel] = useState('none'); 

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
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div className="panel-title">See more work</div>

          </div>
            <div className="panel-body">
              <div className="panel-links">

                 <a href="https://stresslessglass.kevinnail.com">
                 <div style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'20px'}}>
                  <img
                    src={slgLogo}
                    alt=""
                    className="qrcode"
                  />

                  Website
            </div>
                </a>
                <div style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'20px'}}>
                  <img
                    src={qrCode}
                    alt=""
                    className="qrcode"
                  />

                <a href="https://instagram.com/stresslessglass" target="_blank" rel="noreferrer">
                  Instagram
                </a>
            </div>
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
