console.log("这是content.js");

const API_KEY = "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";
function createSidebar() {
  const sidebar = document.createElement("div");
  sidebar.id = "book-summary-sidebar";
  sidebar.style.cssText =
    "position: fixed; top: 0; right: 0; width: 350px; height: 100%; background-color: white; border-left: 1px solid #ccc; z-index: 9999; overflow-y: scroll; padding: 10px;";
  document.body.appendChild(sidebar);
  return sidebar;
}

function createChatUI() {
  const chatContainer = document.createElement("div");
  chatContainer.style.cssText =
    "display: flex; flex-direction: column; height: 100%;";

  const chatMessages = document.createElement("div");
  chatMessages.id = "chat-messages";
  chatMessages.style.cssText =
    "flex: 1; overflow-y: scroll; margin-bottom: 10px;";

  const inputContainer = document.createElement("div");
  inputContainer.style.cssText = "display: flex;";

  const input = document.createElement("input");
  input.id = "user-input";
  input.type = "text";
  input.placeholder = "Type your message here...";
  input.style.cssText = "flex: 1;";

  const sendButton = document.createElement("button");
  sendButton.id = "send-message";
  sendButton.textContent = "Send";
  sendButton.style.cssText = "width: 75px;";

  const clearButton = document.createElement("button");
  clearButton.id = "clear-chat";
  clearButton.textContent = "Clear";
  clearButton.style.cssText = "width: 75px;";

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  inputContainer.appendChild(clearButton);
  chatContainer.appendChild(chatMessages);
  chatContainer.appendChild(inputContainer);

  return chatContainer;
}

function appendMessage(role, content) {
  const chatMessages = document.getElementById("chat-messages");
  const messageElem = document.createElement("div");
  messageElem.style.cssText = "padding: 5px;";

  const messageContent = document.createElement("span");
  messageContent.textContent = content;

  if (role === "user") {
    messageContent.style.cssText = "font-weight: bold; color: blue;";
  } else {
    messageContent.style.cssText = "font-weight: bold; color: green;";
  }

  messageElem.appendChild(messageContent);
  chatMessages.appendChild(messageElem);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessageToGPT3(content) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
  onDOMContentLoaded();
}

function onDOMContentLoaded() {
  console.log("这是content.js的DOMContentLoaded");

  const sidebar = createSidebar();
  const chatUI = createChatUI();
  sidebar.appendChild(chatUI);

  document
    .getElementById("send-message")
    .addEventListener("click", async () => {
      const userInput = document.getElementById("user-input");
      const userMessage = userInput.value.trim();
      if (userMessage) {
        userInput.value = "";
        appendMessage("user", userMessage);
        appendMessage("assistant", "Loading...");

        const assistantMessage = await sendMessageToGPT3(userMessage);
        chatUI.lastChild.remove();
        appendMessage("assistant", assistantMessage);
      }
    });

  document
    .getElementById("user-input")
    .addEventListener("keypress", async (event) => {
      if (event.key === "Enter") {
        const userInput = document.getElementById("user-input");
        const userMessage = userInput.value.trim();
        if (userMessage) {
          userInput.value = "";
          appendMessage("user", userMessage);
          appendMessage("assistant", "Loading...");

          const assistantMessage = await sendMessageToGPT3(userMessage);
          chatUI.lastChild.remove();
          appendMessage("assistant", assistantMessage);
        }
      }
    });

  document.getElementById("clear-chat").addEventListener("click", () => {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";
  });
};

console.log("这是content.js end");
