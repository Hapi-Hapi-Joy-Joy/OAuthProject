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

          const session = req.state.session
          if (session) {
              const user = db[decrypt(session.user_id)].screen_name
              if(user) {
                reply(`<h1>Hello there, ${user}</h1>`)
              } else {
                reply.redirect('/');
              }
          }
          }
        }})
  }
}}
