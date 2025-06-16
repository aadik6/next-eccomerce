import React, { useState } from 'react';
import { FaWhatsapp, FaFacebook, FaTwitter, FaTelegram,FaShare } from "react-icons/fa";

const socialPlatforms = [
  {
    name: "WhatsApp",
    icon: <FaWhatsapp color="#25D366" />,
    getUrl: (link, title) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + link)}`,
  },
  {
    name: "Facebook",
    icon: <FaFacebook color="#1877F3" />,
    getUrl: (link) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  },
  {
    name: "Twitter",
    icon: <FaTwitter color="#1DA1F2" />,
    getUrl: (link, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "Telegram",
    icon: <FaTelegram color="#0088cc" />,
    getUrl: (link, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}`,
  },
];

const ShareButton = ({ title, description, link, image }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        className="btn btn-outline-primary"
        onClick={() => setShowOptions((v) => !v)}
      >
        <FaShare className="me-1" />
      </button>
      {showOptions && (
        <div
          className="shadow rounded p-3 bg-white"
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            minWidth: "180px",
            zIndex: 100,
          }}
        >
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.getUrl(link, title)}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center mb-2 text-decoration-none text-dark"
              style={{ fontSize: "1.1rem" }}
            >
              <span style={{ fontSize: "1.5rem", marginRight: "8px" }}>
                {platform.icon}
              </span>
              {platform.name}
            </a>
          ))}
          <button
            className="btn btn-sm btn-light w-100 mt-2"
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;