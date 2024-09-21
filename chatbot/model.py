import torch.nn as nn
import torch

class NeuralNetwork(nn.Module):
    def __init__(self,initial_size,hidden_size,num_classes):
        super(NeuralNetwork,self).__init__()
        self.l1=nn.Linear(initial_size,hidden_size) # first layer
        self.l2=nn.Linear(hidden_size,hidden_size) # second layer
        self.l3=nn.Linear(hidden_size,num_classes) # third layer
        self.relu=nn.ReLU() # activation function

    def forward(self,x):
        out = self.l1(x)
        out = self.relu(out)
        out = self.l2(out)
        out = self.relu(out)
        out = self.l3(out) # no need to use activation func here since will be using cross entropy
        return out
