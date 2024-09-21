class Chatbox{
    constructor(){ //initial instance of opening the HTML
        this.args={
            openButton: document.querySelector('.chatbox__button'), // performs the <div> for chatbox__button, can be found in base.html
            chatBox: document.querySelector('.chat__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false; // in the start the state is false
        this.messages = []; // stores in all messages
        
    }

    display(){ // update the display when a certain action is performed
        const{openButton,chatBox,sendButton} = this.args;

        openButton.addEventListener('click',()=> this.toggleState(chatBox)) // when the chat button is clicked open the chatbox

        sendButton.addEventListener('click',()=>this.onSendButton(chatBox)) // send user message when send button is clicked

        //OR 
        
        // perform send button function when 'Enter' key is pressed
        const node = sendButton.querySelector('input'); // takes an <input>, in this case a string (key)
        node.addEventListener('keyup',({key})=> {
            if (key === "Enter"){
                this.onSendButton(chatBox)
            }
        })

    }
    // function for opening and closing the chatbox when the openButton is clicked
    toggleState(chatbox){ 
        this.state = !this.state; // true = false  OR  false = true
        
        if (this.state){
            chatbox.classList.add('chatbox--active') // check style.css for the css selector
        }
        else{
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch($SCRIPT_ROOT+'/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;

    }
}

const chatbox = new Chatbox();
chatbox.display();