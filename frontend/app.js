import funFacts from './funFacts.js'; // Import fun facts from the external file

class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
        this.lastAPICallTime = null; // To track the last API call time
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

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
        textField.value = '';

        // Check if we can make an API call immediately or need to delay
        if (this.canMakeAPICall()) {
            this.makeAPICall(userMessage, chatbox);
        } else {
            // Display a fun fact or joke to keep the user engaged
            const randomFact = this.getRandomFunFact();
            const factMsg = { name: "Sam", message: randomFact };
            this.messages.push(factMsg);
            this.updateChatText(chatbox);

            // Calculate remaining time and delay the API call until 20 seconds have passed
            const timeLeft = 20000 - (new Date() - this.lastAPICallTime);
            setTimeout(() => {
                // Remove the fun fact message and make the API call
                this.messages.pop(); // Remove the fun fact/joke
                this.makeAPICall(userMessage, chatbox);
            }, timeLeft);
        }
    }

    canMakeAPICall() {
        // If this is the first call or 20 seconds have passed, allow the call
        if (!this.lastAPICallTime) {
            this.lastAPICallTime = new Date();
            return true;
        }

        const currentTime = new Date();
        const timeDifference = currentTime - this.lastAPICallTime;
        return timeDifference >= 20000; // 20 seconds in milliseconds
    }

    makeAPICall(userMessage, chatbox) {
        this.lastAPICallTime = new Date(); // Update the last API call time

        fetch('https://healthchatbot-dr-shaboinky-1.onrender.com/predict', {
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
        }).catch((error) => {
            console.error('Error:', error);

            const errorMsg = { name: "Sam", message: "Sorry, it looks bad. I would suggest you visit a doctor or a physician." };
            this.messages.push(errorMsg);
            this.updateChatText(chatbox);
        });
    }

    getRandomFunFact() {
        // Get a random fun fact or joke from the funFacts array
        const randomIndex = Math.floor(Math.random() * funFacts.length);
        return funFacts[randomIndex];
    }

    updateChatText(chatbox) {
        const messagesContainer = chatbox.querySelector('.chatbox__messages');
        
        // Clear existing messages
        messagesContainer.innerHTML = '';

        // Display all messages in order
        this.messages.forEach(item => {
            const messageDiv = document.createElement('div');
            messageDiv.className = item.name === "Saboinky" ? "messages__item messages__item--visitor" : "messages__item messages__item--operator";
            messageDiv.textContent = item.message;
            messagesContainer.appendChild(messageDiv);
        });

        // Scroll to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

const chatbox = new Chatbox();
chatbox.display();
