'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const querystring = require('querystring') //format params for queries
const {buildUrl, httpsRequest} = require('./utilities')

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
        console.log(error);
        reply(error)
      }
      else {
        reply.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
      }
    }) 
  }
})
server.route({
  method:'GET',
  path:'/tokenised',
  handler:(req,reply)=>{
    console.log(req)
  reply.file('./logged.html')}
})

server.start(()=>{
  console.log('server is running on port:', server.info.port)
})

