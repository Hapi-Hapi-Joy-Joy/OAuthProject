# OAuthProject




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
