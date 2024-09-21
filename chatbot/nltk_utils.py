import nltk
import numpy as np
nltk.download('punkt')
nltk.download('punkt_tab')
from nltk.stem.porter import PorterStemmer
stemmer = PorterStemmer()

# nltk.download('punkt')
nltk.download('wordnet')
nltk.download('omw-1.4')

def tokenize(sentence): # split a sentence into words
    return nltk.word_tokenize(sentence)

def stem(word): # find the common word in similar words ['organize','organizer','organer']
    return stemmer.stem(word.lower())

def bag_of_words(tokenized_sentence,all_words):
    tokenized_sentence = [stem(w) for w in tokenized_sentence]
    bag = np.zeros(len(all_words),dtype=np.float32) # gives a array of length of all words [0,0,0,0,0....,0]
    for index,word in enumerate(all_words):
        if word in tokenized_sentence: # gives unique array for each sentence [1,0,0,0,1,0,1]
            bag[index]=1.0

    return bag

