import React, { useEffect, useState } from 'react';

const Spacer = () => {
  const [webContentHeight, setWebContentHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const updateHeights = () => {
    const webContent = document.getElementById('web-content');
    const footer = document.getElementById('footer');

    if (webContent) {
      setWebContentHeight(webContent.offsetHeight);
    }
    if(footer) {
        setFooterHeight(footer.offsetHeight);
    }
  };

  useEffect(() => {
    updateHeights();

    // Wait for images to load before recalculating heights
    window.addEventListener('load', updateHeights);

    // Also handle resize events
    window.addEventListener('resize', updateHeights);

    return () => {
      window.removeEventListener('load', updateHeights);
      window.removeEventListener('resize', updateHeights);
    };
  }, []);

  return (
    <div style={{ height: `calc(100vh - ${webContentHeight}px - 125px)` }}></div>
  );
};

export default Spacer;