"use client";
import React, { useState, useEffect } from "react";
import {
  BsChevronLeft,
  BsChevronRight,
  BsPlay,
  BsFileEarmarkPdf,
  BsImages,
  BsEye,
  BsX,
} from "react-icons/bs";
import ShareButton from "../shareButton/shareButton";
import ImageMagnifier from "./imageMagnifier";

const MediaViewer = ({
  media = [],
  productName = "",
  productSlug = "",
  baseUrl = "",
  brochure = null,
  catalog = null,
  videoLink = null,
  videoProvider = null,
  status = null,
  onMainImageChange = () => {},
}) => {
  const [mainMedia, setMainMedia] = useState(null);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [openShareId, setOpenShareId] = useState(null);
  const [displayMedia, setDisplayMedia] = useState([]);

  // Initialize main image and prepare media array
  useEffect(() => {
    const prepareMedia = () => {
      let allMedia = [...media];
      
      // Add video as a media item if available
      if (videoLink && videoProvider) {
        // Find a thumbnail for the video
        const thumbnail = media.length > 0 ? media[0].path : null;
        
        allMedia.push({
          type: "video",
          path: videoLink,
          thumbnail: thumbnail,
          provider: videoProvider,
        });
      }
      
      setDisplayMedia(allMedia);
      
      // Set initial main media
      if (allMedia.length > 0 && !mainMedia) {
        const firstImage = allMedia.find(item => item.type !== "video");
        setMainMedia(firstImage ? firstImage.path : null);
      }
    };
    
    prepareMedia();
  }, [media, videoLink, videoProvider]);

  const visibleThumbnails = displayMedia.slice(
    thumbnailIndex,
    thumbnailIndex + 6
  );

  const scrollThumbnails = (direction) => {
    const limit = Math.max(0, displayMedia.length - 6);
    const newIndex =
      direction === "left"
        ? Math.max(0, thumbnailIndex - 1)
        : Math.min(limit, thumbnailIndex + 1);
    setThumbnailIndex(newIndex);
  };

  const getEmbedUrl = (provider, url) => {
    if (!provider || !url) return "";

    switch (provider.toLowerCase()) {
      case "youtube": {
        const videoId = url.split("v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      case "vimeo": {
        const match = url.match(/vimeo\.com\/(\d+)/);
        const videoId = match?.[1];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
      }
      case "facebook": {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url
        )}&show_text=0&width=560`;
      }
      default:
        return "";
    }
  };

  // Update the setMainMedia function to also call the callback
  const handleMainMediaChange = (newMedia) => {
    setMainMedia(newMedia);
    onMainImageChange(newMedia);
  };

  return (
    <div className="position-relative">
      {/* Main Media Display */}
      <div className="bg-light rounded p-4 text-center mb-3 position-relative">
        {showVideo ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "400px",
            }}
          >
            <iframe
              src={getEmbedUrl(videoProvider, videoLink)}
              title={`${productName} Video`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />

            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
              onClick={() => setShowVideo(false)}
            >
              <BsX />
            </button>
          </div>
        ) : mainMedia ? (
          <div style={{ position: "relative" }}>
            {/* Use ImageMagnifier instead of regular img */}
            <ImageMagnifier
              src={mainMedia}
              alt={productName}
              magnifierHeight={250}
              magnifierWidth={250}
              zoomLevel={2.5}
            />
          </div>
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "400px" }}
          >
            <div className="text-muted">
              <BsEye size={48} />
              <p className="mt-2 mb-0">No image available</p>
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="position-absolute top-0 end-0 p-1">
          <div className="d-flex flex-column gap-2">
            <ShareButton
              title={productName}
              link={`${baseUrl}glasses/${productSlug}`}
              isOpen={openShareId === "main"}
              onOpen={() => setOpenShareId("main")}
              onClose={() => setOpenShareId(null)}
            />
          </div>
        </div>

        {/* Product Status Badge */}
        {status && (
          <div className="position-absolute top-0 start-0 p-3">
            <span
              className={`badge ${
                status === "approved" ? "bg-success" : "bg-warning"
              }`}
            >
              {status === "approved" ? "Approved" : "Pending"}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {displayMedia.length > 0 && (
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-secondary rounded-circle p-2 me-2"
            onClick={() => scrollThumbnails("left")}
            disabled={thumbnailIndex === 0}
            style={{ width: "40px", height: "40px" }}
          >
            <BsChevronLeft />
          </button>

          <div className="d-flex overflow-hidden flex-grow-1">
            {visibleThumbnails.map((item, idx) =>
              item.type === "video" ? (
                <div
                  key={`video-thumb`}
                  className="me-3"
                  style={{
                    cursor: "pointer",
                    minWidth: "80px",
                    position: "relative",
                  }}
                  onClick={() => setShowVideo(true)}
                >
                  <img
                    src={item.thumbnail || "/video-thumb.jpg"}
                    alt="Video thumbnail"
                    className="img-thumbnail border"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      filter: "brightness(0.7)",
                    }}
                  />
                  <span
                    className="position-absolute top-50 start-50 translate-middle"
                    style={{
                      color: "#fff",
                      fontSize: "2rem",
                      pointerEvents: "none",
                    }}
                  >
                    <BsPlay />
                  </span>
                </div>
              ) : (
                <div
                  key={item.path + idx}
                  className="me-3"
                  style={{ cursor: "pointer", minWidth: "80px" }}
                  onClick={() => {
                    handleMainMediaChange(item.path);
                    setShowVideo(false);
                  }}
                >
                  <img
                    src={item.path}
                    alt={`${productName} view ${idx + 1}`}
                    className={`img-thumbnail border ${
                      mainMedia === item.path
                        ? "border-primary border-2"
                        : "opacity-75"
                    }`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              )
            )}
          </div>

          <button
            className="btn btn-outline-secondary rounded-circle p-2 ms-2"
            onClick={() => scrollThumbnails("right")}
            disabled={thumbnailIndex >= displayMedia.length - 6}
            style={{ width: "40px", height: "40px" }}
          >
            <BsChevronRight />
          </button>
        </div>
      )}

      {/* Downloads Section */}
      {(brochure || catalog) && (
        <div className="mt-3">
          <div className="row g-2">
            {brochure && brochure.length > 0 && (
              <div className="col-6">
                <a
                  href={brochure[0].path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm w-100"
                >
                  <BsFileEarmarkPdf className="me-1" /> Brochure
                </a>
              </div>
            )}
            {catalog && catalog.length > 0 && (
              <div className="col-6">
                <a
                  href={catalog[0].path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary btn-sm w-100"
                >
                  <BsImages className="me-1" /> Catalog
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaViewer;