export default function Overlay({ visible, onPressAbout, onPressLinks, onPressOff }) {
  if (!visible) return null;

  return (
    <div className="overlay">
      <button type="button" className="overlay-button" onClick={onPressAbout}>
        About
      </button>

      <button type="button" className="overlay-button" onClick={onPressLinks}>
        See more work
      </button>

      <button type="button" className="overlay-button" onClick={onPressOff}>
        Turn screen off
      </button>
    </div>
  );
}
