const OPENAI_API_KEY = "your token";
// 获取元素
const chatBox = document.createElement("div");
chatBox.classList.add("chat-box");
chatBox.style.backgroundColor = "#fff";
chatBox.style.position = "fixed";
chatBox.style.bottom = "50px";
chatBox.style.right = "50px";
chatBox.style.width = "300px";
chatBox.style.height = "400px";

const chatArea = document.createElement("div");
chatArea.classList.add("chat-area");
chatArea.style.height = "calc(100% - 60px)";
chatArea.style.overflow = "auto";

const inputBox = document.createElement("div");
inputBox.classList.add("input-box");
inputBox.style.display = "flex";
inputBox.style.justifyContent = "space-between";
inputBox.style.alignItems = "center";
inputBox.style.height = "60px";
inputBox.style.padding = "10px";

const input = document.createElement("input");
input.style.flex = 1;
input.style.marginRight = "10px";

const sendBtn = document.createElement("button");
sendBtn.textContent = "发送";

const clearBtn = document.createElement("button");
clearBtn.textContent = "清空聊天记录";

// 添加元素到聊天框中
chatBox.appendChild(chatArea);
chatBox.appendChild(inputBox);
inputBox.appendChild(input);
inputBox.appendChild(sendBtn);
inputBox.appendChild(clearBtn);

// 将聊天框添加到页面中
document.body.appendChild(chatBox);

// 记录最近十条消息
const messages = [];

// 发送消息到GPT3.5 API并返回机器人的回复
async function sendMessage(message) {
  addMessage("user", message);
  updateMessages({ role: "user", content: message });
  chatArea.scrollTop = chatArea.scrollHeight;
  const messageElement = createMessage("assistant", "");
  getResponse(message, messageElement);
  updateMessages({ role: "assistant", content: messageElement.innerHTML });
  chatArea.scrollTop = chatArea.scrollHeight;
}

// 获取机器人的回复
async function getResponse(message, messageElement) {
  messages.unshift(systemPrompt);
  console.log(systemPrompt);
  console.log(messages);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [...messages, { role: "user", content: message }],
        stream: true,
      }),
    });
    // Read the response as a stream of data
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    messageElement.innerText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      // Massage and parse the chunk of data
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      const parsedLines = lines
      .map((line) => line.replace("data: ", ""))
        // .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
        .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
        .map((line) => JSON.parse(line)); // Parse the JSON string
        console.log(parsedLines)
      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        // Update the UI with the new content
        if (content) {
          messageElement.innerText += content;
        }
      }
    }
  } catch (error) {
    // Handle fetch request errors
    if (signal.aborted) {
      messageElement.innerText = "Request aborted.";
    } else {
      console.error("Error:", error);
      messageElement.innerText = "Error occurred while generating.";
    }
  } finally {
  }
}

// 添加消息到聊天区域
function addMessage(role, content) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(role);
  messageElement.textContent = content;
  chatArea.appendChild(messageElement);
}
// create 并且添加消息到聊天区域
function createMessage(role, content) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(role);
  messageElement.textContent = content;
  chatArea.appendChild(messageElement);
  return messageElement;
}

// 更新消息列表
function updateMessages(message) {
  messages.push(message);
  if (messages.length > 10) {
    messages.shift();
  }
}

// 发送消息
function sendMessageHandler() {
  const message = input.value.trim();
  if (message) {
    input.value = "";
    sendMessage(message);
  }
}

// 清空聊天记录
function clearMessagesHandler() {
  chatArea.innerHTML = "";
  messages = [];
}

// 监听发送按钮点击事件
sendBtn.addEventListener("click", sendMessageHandler);

// 监听输入框按下回车键事件
input.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessageHandler();
  }
});

// 监听清空按钮点击事件
clearBtn.addEventListener("click", clearMessagesHandler);

// 获取书籍信息
function getBookInfo() {
  const title = document.querySelector("#wrapper > h1 > span").textContent;
  const author = document.querySelector(
    "#info > span:nth-child(1) > a"
  ).textContent;
  const info = {
    title,
    author,
  };
  return info;
}
// 获取书籍信息
const bookInfo = getBookInfo();

// 构建 system prompt
const systemPrompt = {
  role: "system",
  content: `You are now chatting with the book "${bookInfo.title}" by ${bookInfo.author}`,
};
