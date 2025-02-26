import React, { useState } from 'react';

export default function OlxLogo() {
  const [imageUrl, setImageUrl] = useState(
    "https://your-reliable-host.com/olx-logo.png" // Use your server or Cloudinary URL
  );

  return (
    <img
      src={imageUrl}
      alt="Dazzlone Logo"
      width="33px"
      height="33px"
      onError={() => setImageUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...")} // Base64 fallback
    />
  );
}
