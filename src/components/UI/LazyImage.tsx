import React from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, width, height }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        // Fallback to placeholder on error
        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMkM4Ljk1NDMgMjIgMCAxMy4wNDU3IDAgMTJDMCAxMC45NTQzIDguOTU0MyAyIDIwIDJDMzEuMDQ1NyAyIDQwIDEwLjk1NDMgNDAgMTJDNDAgMTMuMDQ1NyAzMS4wNDU3IDIyIDIwIDIyWiIgZmlsbD0iI0Q0RDRENCIvPgo8L3N2Zz4K';
      }}
    />
  );
};

export default LazyImage;