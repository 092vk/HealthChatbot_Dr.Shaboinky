class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        // openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const inputNode = chatBox.querySelector('input');
        inputNode.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const userMessage = textField.value.trim();
        if (userMessage === "") {
            return;
        }

        // Store the user's message
        const msg1 = { name: "User", message: userMessage };
        this.messages.push(msg1);
        this.updateChatText(chatbox);

        // Send the user's message to the server for prediction
        fetch('https://healthchatbot-dr-shaboinky-1.onrender.com', {
            method: 'POST',
            body: JSON.stringify({ message: userMessage }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            const msg2 = { name: "Sam", message: data.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = '';
        }).catch((error) => {
            console.error('Error:', error);
            const errorMsg = { name: "Sam", message: "Sorry, I couldn't process that." };
            this.messages.push(errorMsg);
            this.updateChatText(chatbox);
            textField.value = '';
        });
    }

    updateChatText(chatbox) {
        const messagesContainer = chatbox.querySelector('.chatbox__messages');
        
        // Clear existing messages
        messagesContainer.innerHTML = '';
    
        // Display all messages in order
        this.messages.forEach(item => {
            const messageDiv = document.createElement('div');
            messageDiv.className = item.name === "Sam" ? "messages__item messages__item--visitor" : "messages__item messages__item--operator";
            messageDiv.textContent = item.message;
            messagesContainer.appendChild(messageDiv);
        });
    
        // Scroll to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
}

const chatbox = new Chatbox();
chatbox.display();
