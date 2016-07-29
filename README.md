# OAuthProject

OAuthProject: How Loud is Your Echo Chamber

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



##Endpoints:


###/login

this is the login page. It should have a button to click, at some point, to begin authentication with twitter

###/dologin   

this launches athentication through twitter

###/cookieTest

Once authenticated, try this url to see if cookies are working. An object will be displayed.
If you re not authenticated you will be redirected to login page


#####Frontend

work in progress
