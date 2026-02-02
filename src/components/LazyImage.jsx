import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, placeholder = '/placeholder.jpg' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={isLoaded ? src : placeholder}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-50'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
      {!isInView && (
        <div className={`w-full h-full bg-gray-200 animate-pulse ${className}`} />
      )}
    </div>
  );
};

export default LazyImage;