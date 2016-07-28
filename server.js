'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const querystring = require('querystring') //format params for queries
const {buildUrl, httpsRequest} = require('./utilities')

const db = {}

var OAuth = require('oauth').OAuth

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  process.env.TWITTER_CLIENT_ID,
  process.env.CLIENT_SECRET,
  '1.0',
  'http://localhost:3000/tokenised',
  'HMAC-SHA1'
)

const server = new hapi.Server()
server.connection({
  port: 3000
})
server.register([
  require('inert'), { register: require('good'), options: require('./options')() }
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
    oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
      if (error) {
        reply(error)
      }
      else {
        server.app.oauth= {
          oauth_token:{
            token_secret: oauth_token_secret
          }
        }
        reply.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
      }
    })
  }
})
server.route({
  method:'GET',
  path:'/tokenised',
  config: {
    state: {
      parse: true,
      failAction: 'log'
    }
  },
  handler:(req,reply)=>{
    oauth.getOAuthAccessToken(
      req.query.oauth_token,
      server.app.oauth.oauth_token.token_secret,
      req.query.oauth_verifier,

      function(error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
          console.log(error);
          reply("Authentication Failure!")
        }
        else {
          console.log('done ',results)
          if (!db[oauth_access_token]) {
            db[oauth_access_token] = {
              screen_name: results.screen_name,
              id: results.user_id,
              oauth_access_token: oauth_access_token
            }
          }
          console.log('logging the database: ', db);
          console.log(db[oauth_access_token])
          reply
            .file('./logged.html')
            .state('session', db[oauth_access_token])
      }
  })
}
})
server.route({
  method: 'GET',
  path: '/cookieTest',
  handler: (req, reply) => {
    const session = req.state.session
    if (session) {
      if(req.state.session.screen_name === db[req.state.session.oauth_access_token].screen_name
         && req.state.session.id === db[req.state.session.oauth_access_token].id) {
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
