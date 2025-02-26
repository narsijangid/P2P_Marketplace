import React, { useState } from 'react';

export default function OlxLogo() {
  const [imageUrl, setImageUrl] = useState("https://i.ibb.co/hJ5gYB7x/imresizer-1739692796139-png.jpg");

  return (
    <img
      src={imageUrl}
      alt="Dazzlone Logo"
      width="33px"
      height="33px"
      onError={() => setImageUrl("https://static.thenounproject.com/png/3444048-200.png")} // Backup image
    />
  );
}
