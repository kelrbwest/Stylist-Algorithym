import { useEffect, useRef } from 'react';

const STOCKIST_TAG = 'u18855';
const SCRIPT_SRC = 'https://stockist.co/embed/v1/widget.min.js';

/**
 * Embeds the Intimo Stockist.co studio locator widget.
 * Accepts a postCode prop — if provided, auto-searches on load.
 */
export default function StudioLocator({ postCode }) {
  const containerRef = useRef(null);
  const hasSearched = useRef(false);

  useEffect(() => {
    // Reset the widget container each time the component mounts
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const widgetDiv = document.createElement('div');
      widgetDiv.id = 'stockist-widget';
      widgetDiv.setAttribute('data-stockist-widget-tag', STOCKIST_TAG);
      containerRef.current.appendChild(widgetDiv);
    }

    // Load the Stockist script
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) existing.remove();

    // Clear any previous Stockist global state
    if (window.Stockist) {
      delete window.Stockist;
    }

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);

    // Auto-fill postcode once the widget has loaded
    hasSearched.current = false;
    const tryAutoSearch = () => {
      if (hasSearched.current) return;
      const input = document.querySelector('#stockist-widget .stockist-search-field');
      const btn = document.querySelector('#stockist-widget .stockist-search-button');
      if (input && btn && postCode) {
        hasSearched.current = true;
        // Set native value so Stockist sees it
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        ).set;
        nativeInputValueSetter.call(input, postCode);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        // Short delay then trigger search
        setTimeout(() => btn.click(), 300);
      }
    };

    // Poll briefly for the widget to render
    const interval = setInterval(tryAutoSearch, 500);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [postCode]);

  return (
    <section className="studio-locator">
      <div className="studio-locator-header">
        <h3 className="studio-locator-title">Visit a Fit Studio</h3>
        <p className="studio-locator-sub">
          Expert bra fitting, personal styling &amp; private studios.
          Book a complimentary appointment at your nearest studio.
        </p>
      </div>
      <div className="studio-locator-widget" ref={containerRef} />
    </section>
  );
}
