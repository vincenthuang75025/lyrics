# Lyrics

[This project](https://lyrics.vvhuang.com) is my attempt at visualizing and connecting songs based on lyrical similarity. 

## Which songs are included?

I started with the ~3000 songs from [this GitHub compilation of song lyrics](https://github.com/Lyrics/lyrics) and filtered out the non-English ones. 

## How does the linking between songs work?

All verses from all songs are compared with one another. Each song verse is then embedded with a link to the most similar verse from a different song.

(Other details: if a verse repeats exactly, I only consider the first instance of the verse. The graph at the bottom of each song page shows all songs linked to on that page. Backlinks are not supported yet due to a technical issue with backlink scalability.)

## How do you determine similarity between verses?

I use fairly basic approaches from NLP. The main two metrics involved are Jaccard similarity with bag of words, and cosine similarity with BERT embeddings; the actual algorithm for determining a verse's most similar neighbor uses a combination of the two metrics. A modified version of the code I wrote for analysis can be found in `lyrics.ipynb`. 

## How was the website made?

The site was made using [Quartz](https://github.com/jackyzha0/quartz) (with minor changes mostly for styling). Quartz is a nice static site generator developed by my friend [Jacky](https://github.com/jackyzha0/). 
