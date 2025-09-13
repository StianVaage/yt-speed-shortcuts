const DEFAULT_SETTINGS = {
  fasterKey: "1",
  slowerKey: "2"
};

function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
    document.getElementById("fasterKey").value = result.fasterKey;
    document.getElementById("slowerKey").value = result.slowerKey;
  });
}

function setupKeyRecording() {
  const inputs = document.querySelectorAll(".key-input");

  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.classList.add("recording");
      input.value = "Press a key...";
    });

    input.addEventListener("keydown", (e) => {
      e.preventDefault();
      const key = e.key;

      if (["Tab", "Shift", "Control", "Alt", "Meta"].includes(key)) {
        return;
      }

      input.value = key;
      input.classList.remove("recording");
      input.blur();
    });

    input.addEventListener("blur", () => {
      input.classList.remove("recording");
      if (input.value === "Press a key...") {
        input.value = "";
      }
    });
  });
}

function saveSettings() {
  const fasterKey = document.getElementById("fasterKey").value;
  const slowerKey = document.getElementById("slowerKey").value;

  if (!fasterKey || !slowerKey) {
    showStatus("Both shortcuts must be set!", false);
    return;
  }

  if (fasterKey === slowerKey) {
    showStatus("Shortcuts cannot be the same!", false);
    return;
  }

  chrome.storage.sync.set(
    {
      fasterKey: fasterKey,
      slowerKey: slowerKey
    },
    () => {
      showStatus("Settings saved!", true);
    }
  );
}

function showStatus(message, isSuccess) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${isSuccess ? "success" : "error"}`;
  status.style.display = "block";

  setTimeout(() => {
    status.style.display = "none";
  }, 3000);
}

document.getElementById("saveSettings").addEventListener("click", saveSettings);
document.getElementById("resetSettings").addEventListener("click", () => {
  chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
    loadSettings();
    showStatus("Settings reset!", true);
  });
});

loadSettings();
setupKeyRecording();