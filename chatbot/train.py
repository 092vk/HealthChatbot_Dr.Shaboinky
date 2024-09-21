import json
from nltk_utils import tokenize,stem,bag_of_words
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader,Dataset
from model import NeuralNetwork

f = open('intents.json','r')
intents = json.load(f)

all_words = []
tags = []
xy = []
# getting tags , getting all the words , and relation b/w tag and sentence
for intent in intents['intents']:
    tag = intent['tag']
    tags.append(tag)
    for pattern in intent['patterns']:
        w = tokenize(pattern)
        all_words.extend(w)
        xy.append((w,tag))


all_words = [stem(w) for w in all_words if w not in ['?','!','.',',']]# removing punctuations
all_words = sorted(set(all_words)) # unique words and all sorted
tags = sorted(set(tags))

X_train = []
y_train = []

for (pattern_sentence,tag) in xy:
    bag = bag_of_words(pattern_sentence,all_words)
    X_train.append(bag)

    label = tags.index(tag)
    y_train.append(label)


X_train = np.array(X_train)
y_train = np.array(y_train)

class MyDataSet(Dataset):
    def __init__(self):
        self.n_samples = len(X_train)
        self.x_data = torch.tensor(X_train, dtype=torch.float32)
        self.y_data = torch.tensor(y_train, dtype=torch.long)
    
    def __getitem__(self,idx):
        return self.x_data[idx],self.y_data[idx]
    
    def __len__(self):
        return self.n_samples
    
dataset = MyDataSet()
batch_size=8
train_loader = DataLoader(dataset=dataset,batch_size=batch_size,shuffle=True,num_workers=0)

hidden_size = 10
input_size = len(all_words)
output_size = len(tags)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu' ) # using GPU
model = NeuralNetwork(input_size,hidden_size,output_size).to(device)


# loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(),lr=0.001)

for epoch in range(1000):
    for (words,labels) in train_loader:
        words = words.to(device)
        labels = labels.to(device) # adding data to same device as model

        # forward
        outputs = model(words)
        loss = criterion(outputs,labels)

        # backward and optimization step
        optimizer.zero_grad() # gradient shifts back to 0
        loss.backward() # calculating gradient of loss with respect to every parameter
        optimizer.step() # updating parameter using new gradients

    if (epoch+1) % 100 == 0:
        print(f"epoch{epoch+1}/1000,loss={loss.item():.4f}")

print(f"final loss ,loss={loss.item():.4f}")

data ={
    "model_state":model.state_dict(), # contains the model's parameters and state
    "input_size": input_size,
    "output_size": output_size,
    "hidden_size": hidden_size,
    "all_words": all_words,
    "tags": tags
}

FILE = "data.pth"
torch.save(data,FILE) # saving the model state along with some more information 

