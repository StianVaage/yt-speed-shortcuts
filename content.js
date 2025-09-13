if (window.ytSpeedControlLoaded) {
  // already loaded, exit early
} else {
  window.ytSpeedControlLoaded = true;

  let currentSettings = {
    fasterKey: "1",
    slowerKey: "2",
  };

  const SPEED_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  function getVideoElement() {
    return document.querySelector("video");
  }

  function getCurrentSpeedIndex(video) {
    const currentRate = video.playbackRate;
    const index = SPEED_LEVELS.indexOf(currentRate);
    return index !== -1 ? index : 3; // default to 1x if not found
  }

  function adjustSpeed(direction) {
    const video = getVideoElement();
    if (!video) {
      return;
    }

    const currentIndex = getCurrentSpeedIndex(video);
    let newIndex;

    if (direction === "faster") {
      newIndex = Math.min(currentIndex + 1, SPEED_LEVELS.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    const newSpeed = SPEED_LEVELS[newIndex];

    if (newSpeed !== undefined) {
      video.playbackRate = newSpeed;
      showSpeedNotification(newSpeed);
    }
  }

  function showSpeedNotification(speed) {
    const existingNotification = document.getElementById(
      "yt-speed-notification"
    );
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.id = "yt-speed-notification";
    notification.textContent = `Hastighet: ${speed}x`;
    notification.style.cssText = `
    position: fixed;
    top: 50px;
    right: 50px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    pointer-events: none;
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  function handleKeyPress(event) {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target.contentEditable === "true"
    ) {
      return;
    }

    const key = event.key;

    if (key === currentSettings.fasterKey) {
      event.preventDefault();
      adjustSpeed("faster");
    } else if (key === currentSettings.slowerKey) {
      event.preventDefault();
      adjustSpeed("slower");
    }
  }

  let isInitialized = false;

  function initializeSpeedControl() {
    if (isInitialized) return;
    isInitialized = true;
    document.addEventListener("keydown", handleKeyPress);
  }

  chrome.storage.sync.get(["fasterKey", "slowerKey"], (result) => {
    currentSettings.fasterKey = result.fasterKey || "1";
    currentSettings.slowerKey = result.slowerKey || "2";

    initializeSpeedControl();
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.fasterKey) {
      currentSettings.fasterKey = changes.fasterKey.newValue;
    }
    if (changes.slowerKey) {
      currentSettings.slowerKey = changes.slowerKey.newValue;
    }
  });
}
