fetch('https://cdn.jsdelivr.net/gh/JuanCloud28/KEEK-CDN/Metrojets/players.json')
    .then(response => response.json())
    .then(data => {
        players = data.players;
        console.log(data); // Array of JSON objects
    })
    .catch(error => console.error('Error fetching JSON:', error));


let currentIndex = 0; // Controls the current pair of the conversation
let playerIndex = 0;
let players = {};

function openChatModal(playerIndexParam) {
    // Inject or show the modal in the DOM
    document.getElementById('chat-modal').style.display = 'block';
    document.getElementById('send-button').disabled = false;
    playerIndex = playerIndexParam;

    // Restart the chat
    currentIndex = 0;
    document.getElementById('chat-window').innerHTML = '';
    if (players[playerIndex].questions.length > 0) {
        document.getElementById('question-display').value = players[playerIndex].questions[currentIndex].question;
    }

    // Assign the event listener to the "Send" button
    const sendButton = document.getElementById('send-button');
    // First remove any previous listeners to avoid duplicates
    sendButton.removeEventListener('click', handleSend);
    sendButton.addEventListener('click', handleSend);
}

// Function to close the modal
function closeModal() {
    document.getElementById('chat-modal').style.display = 'none';
    document.getElementById('question-display').value = '';
}

// Function to add messages to the chat window
function appendMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ' + sender;
    messageElement.textContent = text;
    const chatWindow = document.getElementById('chat-window');
    chatWindow.appendChild(messageElement);
    // Keep the scroll down to see the last message
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Add the question to the chat window (simulate that the user sends it)

function handleSend() {
    if (currentIndex >= players[playerIndex].questions.length) {
        alert('The chat has ended.');
        return;
    }

    appendMessage(players[playerIndex].questions[currentIndex].question, 'user');
    document.getElementById('send-button').disabled = true;

    const chatWindow = document.getElementById('chat-window');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message typing';
    typingIndicator.textContent = `${players[playerIndex].name} is typing...`;
    chatWindow.appendChild(typingIndicator);

    setTimeout(function () {
        typingIndicator.remove();
        appendMessage(players[playerIndex].questions[currentIndex].answer, 'player');

        currentIndex++;
        if (currentIndex < players[playerIndex].questions.length) {
            document.getElementById('question-display').value = players[playerIndex].questions[currentIndex].question;
            document.getElementById('send-button').disabled = false;
        } else {
            document.getElementById('question-display').value = 'The chat has ended.';
        }
    }, 2000);
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('send-button').addEventListener('click', handleSend);
    const chatWindow = document.getElementById("chat-window");

    // Hide the scrollbar visually
    chatWindow.style.overflowY = "auto";
    chatWindow.style.scrollbarWidth = "none"; // Firefox
    chatWindow.style.msOverflowStyle = "none"; // IE/Edge
    chatWindow.classList.add("hide-scroll");

    const style = document.createElement("style");
    style.innerHTML = `
        #chat-window::-webkit-scrollbar {
            display: none; /* Chrome, Safari */
        }
    `;
    document.head.appendChild(style);

    // Auto scroll down when messages are added
    const observer = new MutationObserver(() => {
        chatWindow.scrollTo({
            top: chatWindow.scrollHeight,
            behavior: "smooth"
        });
    });
    observer.observe(chatWindow, { childList: true });
});
