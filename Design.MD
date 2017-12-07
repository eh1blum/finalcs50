Design.MD

Chrome Extension:
We set out to create a technology that would return a political bias score of a new article. To make such a technology as accessible as possible to the user, we decided to make a Chrome Extension as it has the most convenient access point. Our Chrome Extension started with a shell of Manifest.json (our master file), Popup.js (contains the main function), Popup.html (contains design features of extension popup), and Icon.png (icon for the Chrome Extension). From there, we began to add additional files and capabilities.   

Algorithm:
We rate bias on two dimensions: polarizing wording and political lean. We decided on these two dimensions for practical reasons. New articles can be polarizing due to use of inflammatory or colorful wording. Further, articles can be biased by communicating information from a biased political angle. As such, we choose to rate bias along both dimensions. For bias level, we created three tiers: neutral, skewed, and bias. For political lean, we have two categories: liberal and conservative. 

Bias score and Political lean functions:
The functions we designed to calculate bias first reformat the arrays so that each word is in parentheses and the words are separated by commas. Doing so allows the code to find the difference between distinct words. These reformatted arrays are then passed as Sets because Sets have very useful properties. In particular, we use the intersection properties to find the number of overlapping words. We use the intersections as the basis to our bias score. Since the bias score is original calculated as number of words, we weighted it by total word count of the webpage in order to equalize of algorithm for use in any article. For political lean, we take the difference between the number of conservative words and the number of liberal words in order to find the net number of political charged words. 
  
Scraper:
In order to access words used in the article, we needed to scrape the webpage for words used. To do so, we created another file called content.js that listen to when the Chrome Extension is called (so that it is only called when needed) and then pull the data from the webpage and return that data as an array to the main function). We used the AddListener method to listen to the event of the Chrome Extension being opened. 

Text Files and Converter:
We created text files of conservative and liberal words that are common in American political discourse. For biased words, we used the bias text files from the 2016 CS50 Twitter Sentiments Pset. Because Chrome Extensions do not have a robust text file cabinet, we created a python converter function, because python is a good language to do so, and created new texts files with arrays of flagged words. 

Search History:
We added an additional feature that allows the user to see the number of liberal or conservative articles that they’ve viewed. To do this, we added a feature to our code that saves political lean results from each use case to an array in Chromes API Storage. Each time the Chrome Extension runs, we initialize a conservative article counter and a liberal article counter that iterate through the storage and count the number of each. This allows the user to see their use history. 



