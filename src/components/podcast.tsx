import React from "react";

const Podcast = () => {
  return (
    <div>
      <iframe
        className="border-r-8"
        src="https://open.spotify.com/embed/show/7wNAoRcAzNzEf51JhNH3vo?utm_source=generator&theme=0"
        width="100%"
        height="250"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Podcast Player"
      ></iframe>
    </div>
  );
};

export default Podcast;
