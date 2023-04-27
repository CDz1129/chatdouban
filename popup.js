document.getElementById("show-summary").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: displaySummary,
    });
  });

  function displaySummary() {
    const infoElem = document.querySelector("#content > div > div.article > div.indent > div.subjectwrap.clearfix > div.subject.clearfix");
    const author = document.querySelector("#info > span:nth-child(1) > a");
    const bookname = document.querySelector("#mainpic > a");
    const summary = infoElem ? infoElem.innerText.trim() : "No summary found";
    console.log(infoElem);
    const sidebar =
      document.getElementById("book-summary-sidebar") || createSidebar();
    sidebar.innerHTML = summary;
    sidebar.innerHTML = createChatUI();

    function createSidebar() {
      const sidebar = document.createElement("div");
      sidebar.id = "book-summary-sidebar";
      sidebar.style.cssText =
        "position: fixed; top: 0; right: 0; width: 300px; height: 100%; background-color: white; border-left: 1px solid #ccc; z-index: 9999; overflow-y: scroll; padding: 10px;";
      document.body.appendChild(sidebar);
      return sidebar;
    }
    function createChatUI() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chat-container';
        chatContainer.style.cssText = 'display: flex; flex-direction: column; height: 100%;';
      
        const messagesContainer = document.createElement('div');
        messagesContainer.id = 'messages-container';
        messagesContainer.style.cssText = 'flex-grow: 1; overflow-y: scroll; padding: 10px;';
      
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = 'display: flex; padding: 10px;';
      
        const input = document.createElement('input');
        input.id = 'user-input';
        input.type = 'text';
        input.placeholder = 'Type your message here...';
        input.style.cssText = 'flex-grow: 1; padding: 5px;';
      
        const clearButton = document.createElement('button');
        clearButton.id = 'clear-messages';
        clearButton.innerText = 'Clear';
        clearButton.style.cssText = 'margin-left: 10px; padding: 5px;';
      
        const sendButton = document.createElement('button');
        sendButton.id = 'send-message';
        sendButton.innerText = 'Send';
        sendButton.style.cssText = 'margin-left: 10px; padding: 5px;';
      
        inputContainer.appendChild(input);
        inputContainer.appendChild(clearButton);
        inputContainer.appendChild(sendButton);
        chatContainer.appendChild(messagesContainer);
        chatContainer.appendChild(inputContainer);
      
        console.log(chatContainer);
        return chatContainer;
      }
  }
});
