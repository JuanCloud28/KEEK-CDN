fetch('https://cdn.jsdelivr.net/gh/JuanCloud28/KEEK-CDN/Metrojets/players.json')
    .then(response => response.json())
    .then(data => {
        players = data.players;
        console.log(data); // Array de objetos JSON
    })
    .catch(error => console.error('Error fetching JSON:', error));


let currentIndex = 0; // Controla el par actual de la conversación
let playerIndex = 0;
let players = {};

function openChatModal(playerIndexParam) {
    // Inyecta o muestra el modal en el DOM
    document.getElementById('chat-modal').style.display = 'block';
    document.getElementById('send-button').disabled = false;
    playerIndex = playerIndexParam;

    // Reinicia la conversación y actualiza la pregunta, etc.
    currentIndex = 0;
    document.getElementById('chat-window').innerHTML = '';
    if (players[playerIndex].questions.length > 0) {
        document.getElementById('question-display').value = players[playerIndex].questions[currentIndex].question;
    }

    // Asigna el event listener al botón "Enviar" en este momento, ya que ya está presente
    const sendButton = document.getElementById('send-button');
    // Primero elimina cualquier listener previo para evitar duplicados
    sendButton.removeEventListener('click', handleSend);
    sendButton.addEventListener('click', handleSend);
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('chat-modal').style.display = 'none';
    document.getElementById('question-display').value = '';
}

// Función para agregar mensajes a la ventana del chat
function appendMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ' + sender;
    messageElement.textContent = text;
    const chatWindow = document.getElementById('chat-window');
    chatWindow.appendChild(messageElement);
    // Mantiene el scroll hacia abajo para ver el último mensaje
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Agrega la pregunta a la ventana del chat (simula que el usuario la envía)

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
});
