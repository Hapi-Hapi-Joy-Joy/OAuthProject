'use strict'
let db = require('./db')
module.exports = (oauth, server, encrypt, decrypt) => { return {
  doLogin:(req,reply)=>{
    oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
      if (error){ reply(error) }
      else{ 
        server.app[oauth_token] = oauth_token_secret
        reply.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token) 
      } 
    })
  },

  tokenised:(req,reply)=>{
    oauth.getOAuthAccessToken(
      req.query.oauth_token,
      server.app[req.query.oauth_token],
      req.query.oauth_verifier,

      (error, oauth_access_token, oauth_access_token_secret, results) => {
        if (error) {
          console.log(error);
          reply("Authentication Failure!")
        }
        else {
          if (!db[results.user_id]) {
            db[results.user_id] = {
              screen_name: results.screen_name,
              id: results.user_id,
              oauth_access_token: oauth_access_token
            }
          }
          reply
            .file('./logged.html')
            .state('session', {
              user_id: encrypt(db[results.user_id].id),
            })
        }})
  },
  cookieTest:(req, reply) => {
      const session = req.state.session
      if (session) {
            if(db[decrypt(session.user_id)]) {
                    reply(`cookie: ${session}`)
                  }
          } else {
                reply.redirect('/');
              }
    }
}}



