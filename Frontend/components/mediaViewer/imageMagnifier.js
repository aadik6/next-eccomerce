"use client";
import React, { useState, useRef } from "react";

const ImageMagnifier = ({ 
  src, 
  alt, 
  magnifierHeight = 200, 
  magnifierWidth = 200, 
  zoomLevel = 2 
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierXY, setMagnifierXY] = useState([0, 0]);
  const [imgSize, setImgSize] = useState([0, 0]);
  const imgRef = useRef(null);

  const mouseEnter = (e) => {
    const element = e.currentTarget;
    const { width, height } = element.getBoundingClientRect();
    setImgSize([width, height]);
    setShowMagnifier(true);
  };

  const mouseLeave = () => {
    setShowMagnifier(false);
  };

  const mouseMove = (e) => {
    const element = e.currentTarget;
    const { top, left } = element.getBoundingClientRect();
    
    // Calculate cursor position relative to the image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    
    setMagnifierXY([x, y]);
  };

  return (
    <div className="position-relative" style={{ display: "inline-block" }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="img-fluid"
        style={{ 
          maxHeight: "400px", 
          objectFit: "contain",
          cursor: "crosshair",
          width: "100%"
        }}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onMouseMove={mouseMove}
      />

      {/* Magnifier */}
      {showMagnifier && (
        <div
          className="position-fixed border border-2 border-dark rounded shadow-lg bg-white"
          style={{
            zIndex: 9999,
            pointerEvents: "none",
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: magnifierXY[1] - magnifierHeight / 2,
            left: imgRef.current ? 
              imgRef.current.getBoundingClientRect().right + 20 : 
              magnifierXY[0] + 10,
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgSize[0] * zoomLevel}px ${imgSize[1] * zoomLevel}px`,
            backgroundPositionX: `${-magnifierXY[0] * zoomLevel + magnifierWidth / 2}px`,
            backgroundPositionY: `${-magnifierXY[1] * zoomLevel + magnifierHeight / 2}px`,
          }}
        />
      )}

      {/* Lens overlay on the image */}
      {showMagnifier && (
        <div
          className="position-absolute border border-dark"
          style={{
            pointerEvents: "none",
            height: `${magnifierHeight / zoomLevel}px`,
            width: `${magnifierWidth / zoomLevel}px`,
            top: `${magnifierXY[1] - magnifierHeight / zoomLevel / 2}px`,
            left: `${magnifierXY[0] - magnifierWidth / zoomLevel / 2}px`,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;