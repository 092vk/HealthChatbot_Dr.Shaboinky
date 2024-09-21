import random
import json
import torch
from nltk_utils import tokenize, bag_of_words
from model import NeuralNetwork

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load intents
with open('intents.json', 'r') as f:
    intents = json.load(f)

# Load model data
data = torch.load("data.pth", map_location='cpu')
model_state = data['model_state']
input_size = data['input_size']
hidden_size = data['hidden_size']
output_size = data['output_size']
all_words = data['all_words']
tags = data['tags']

# Initialize model
model = NeuralNetwork(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

bot_name = "Sam"

def get_message(sentence):
    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])  # 1 row
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.75:
        for intent in intents["intents"]:
            if tag == intent['tag']:
                return random.choice(intent['responses']), prob.item()
    else:
        return "Sorry, I do not understand...", 0.0
