import React from 'react';
import { FaWhatsapp, FaFacebook, FaTwitter, FaTelegram, FaShare } from "react-icons/fa";

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

const ShareButton = ({ title, link, isOpen, onOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Close menu if clicked outside
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.share-btn-dropdown')) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        className="btn btn-outline-primary"
        onClick={isOpen ? onClose : onOpen}
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "50%",
          padding: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        <FaShare className="me-1" />
      </button>
      {isOpen && (
        <div
          className="shadow rounded p-3 bg-white share-btn-dropdown"
          style={{
            position: "absolute",
            top: "110%",
            right: 0, // Change from left: 0 to right: 0
            minWidth: "180px",
            zIndex: 100,
            maxWidth: "calc(100vw - 32px)", // Prevent overflow on small screens
            boxSizing: "border-box",
            overflowX: "auto",
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