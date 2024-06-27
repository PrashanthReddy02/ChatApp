// Initialize WebSocket connection
const socket = new WebSocket(`ws://${window.location.host}`);
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('send');
const nameInput = document.getElementById('nameInput');
const joinButton = document.getElementById('join');

// Store the user's name once they join
let username;

joinButton.addEventListener('click', () => {
  username = nameInput.value;
  if (username) {
    nameInput.disabled = true;
    joinButton.disabled = true;

    // Display welcome message
    const welcomeMessageContainer = document.getElementById('welcome-message');
    const newDiv = document.createElement('div');
    newDiv.textContent = `Hey ${username}! Welcome to the chat 🙋‍♂️`;
    newDiv.classList.add('chat-message');
    welcomeMessageContainer.appendChild(newDiv);
  }
});

socket.addEventListener('message', async (event) => {
  const terminal = document.getElementById('terminal');

  if (event.data instanceof Blob) {
    const text = await event.data.text();
    appendMessageToTerminal(terminal, text, false);
  } else {
    appendMessageToTerminal(terminal, event.data, false);
  }
});

function appendMessageToTerminal(terminal, message, isLocal) {
  const messageContainer = document.createElement('div');
  messageContainer.className = isLocal ? 'local-message' : 'other-message';

  const pre = document.createElement('pre');
  pre.textContent = message;

  messageContainer.appendChild(pre);
  terminal.appendChild(messageContainer);
}

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message && username) {
    socket.send(`${username}: ${message}`);
    appendMessageToTerminal(document.getElementById('terminal'), `${username}: ${message}`, true);
    messageInput.value = '';
  }
});
