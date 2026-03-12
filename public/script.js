const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const intentLabel = document.getElementById("intentLabel");
const confidenceLabel = document.getElementById("confidenceLabel");
const API_BASE_URL =
  window.location.port === "3000" ? "" : "http://localhost:3000";

function addBubble(text, role) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  bubble.textContent = text;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

function setStatus(intent, confidence) {
  intentLabel.textContent = `Intent: ${intent || "-"}`;
  confidenceLabel.textContent =
    confidence === undefined || confidence === null
      ? "Confidence: -"
      : `Confidence: ${Number(confidence).toFixed(2)}`;
}

async function sendMessage(message) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Request failed.");
  }

  return response.json();
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) {
    return;
  }

  addBubble(message, "user");
  messageInput.value = "";
  sendButton.disabled = true;

  try {
    const data = await sendMessage(message);
    setStatus(data.intent, data.confidence);
    addBubble(data.response, "ai");
  } catch (error) {
    addBubble(`Error: ${error.message}`, "ai");
  } finally {
    sendButton.disabled = false;
    messageInput.focus();
  }
});

addBubble(
  "Welcome. Ask a question and I will classify intent, route to an expert prompt, and respond.",
  "ai"
);
