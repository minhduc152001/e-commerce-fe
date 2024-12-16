import React, { useEffect, useState } from "react";

const ZaloBrowserWarning: React.FC = () => {
  const [isZaloBrowser, setIsZaloBrowser] = useState(false);

  // Function to detect Zalo in-app browser
  const detectZaloBrowser = () => {
    return /Zalo/.test(navigator.userAgent);
  };

  useEffect(() => {
    setIsZaloBrowser(detectZaloBrowser());
  }, []);

  // Function to redirect to an external browser
  const handleOpenInBrowser = () => {
    window.open(window.location.href, "_blank");
  };

  if (!isZaloBrowser) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <p>
          Bạn đang mở trong Zalo. Hãy mở trong trình duyệt trên thiết bị của bạn
          để có trải nghiệm tốt nhất!
        </p>
        <button onClick={handleOpenInBrowser} style={styles.button}>
          Mở trong Trình duyệt
        </button>
      </div>
    </div>
  );
};

export default ZaloBrowserWarning;

// Inline styles
const styles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center" as "center",
  },
  container: {
    backgroundColor: "black",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "80%",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
};
