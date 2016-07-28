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
server.state('session', {
    ttl: 24 * 60 * 60 * 1000,     // One day
    isSecure: true,
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
    console.log('try to log credentials',req.auth.credentials)
    /*let session = req.state.session*/
    //if(!session) {
      //session = {

        //oauth_token: req.params.oauth_token,
        //oauth_verifier: req.params.oauth_verifier 
      //} 
    /*}*/
    console.log(req.params)
    reply.file('./logged.html')}
})

server.start(()=>{
  console.log('server is running on port:', server.info.port)
})


//const db = {
  //mattia:{
    //id:1
  //},
  //bradley:{
    //id:2
  //}
/*}*/
