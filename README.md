# OAuthProject

OAuthProject: How Loud is Your Echo Chamber

**This is a work in progress**

##Goals:
Third Party Authentication with Twitter.  
1) Display signed in person's 20 latest tweets

2) Allow signed in person to search their tweets by hashtag

3) Allow signed in person to search the tweets of people they are following by hashtag.  

4) Display results for those 2 searches side by side, to allow person to compare how extensively the opinions (chosen by hashtag subject) of their tweets differ from those of the people they follow.

##Stretch Goals:
Have actual sentiment analysis on tweets; possibly even graph results of sentiment analysis.



#####Backend

The backend allows oauth authentication with twitter. It then uses session and cookies to keep user logged in.
The cookie content is encrypted.

Data is saved in an object and in the server cache.

##Quick Start Guide:

Clone this repo, and then ```npm install```. There are some separate branches **Twitwork** and **googleoauth** that we created alongside our main project in an attempt to get it all working - PLEASE DO NOT MERGE THEM. They will crash and break everything and we will be very sad.

```npm start``` runs our project on Localhost:3000, click through to sign in to Twitter.  You will then be redirected to a welcome page.
