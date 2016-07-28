'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const db = require('./db')
const handlers = require('./handlers.js')
const {oauth,encrypt,decrypt} = require('./utils')



const server = new hapi.Server()
server.connection({
  port: 3000
})

server.register([
  require('inert'), { register: require('good'), options: require('./options') }
],()=>{})

server.state('session', {
  ttl: 24 * 60 * 60 * 1000,     // One day
  isSecure: false,
  path: '/',
  encoding: 'base64json'
})

server.route({
  method:'GET',
  path:'/',
  handler:(req,reply)=>{
    reply.file('./login.html')
  }
})

server.route({
  method:'GET',
  path:'/dologin',
  handler:(req,reply)=>{
    oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
      if (error){ reply(error) }
      else{ 
        server.app[oauth_token] = oauth_token_secret
        reply.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token) 
      } 
    })
  }
})

server.route({
  method:'GET',
  path:'/tokenised',
  handler:(req,reply)=>{
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
              oauth_access_token: oauth_access_token,
            }
          }
          reply
            .file('./logged.html')
            .state('session', {
              user_id:encrypt(db[results.user_id].id),
            })
        }})
      }
})

server.route({
  method: 'GET',
  path: '/cookieTest',
  handler: (req, reply) => {
    const session = req.state.session
    if (session) {
      if(db[decrypt(session.user_id)]) {
        reply(`cookie: ${session}`)
      }
    } else {
      reply.redirect('/');
    }
  }
})
server.start(()=>{
  console.log('server is running on port:', server.info.port)
})
