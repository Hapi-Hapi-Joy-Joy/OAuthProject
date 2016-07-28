'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const querystring = require('querystring') //format params for queries
const {buildUrl, httpsRequest, nonce, generateSignature} = require('./utilities')

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
    path:'/login',
    handler:(req,reply)=>{
     console.log(generateSignature(options)) 
      reply.file('./login.html')}
  })
  server.route({
    method:'GET',
    path:'/dologin',
    handler:(req,reply)=>{
      httpsRequest({
        hostname:'api.twitter.com',
        port: 443,
        method:'POST',
        path: '/oauth/request_token',
        headers:{
          oauth_consumer_key:process.env.TWITTER_CLIENT_ID,
          oauth_callback:process.env.REDIRECT_URI,
          oauth_nonce:nonce(32),// generate nonce,
          oauth_signature_method:'HMAC-SHA1',
          oauth_timestamp: Date.now(),
          oauth_signature: generateSignature(options),// signature
          oauth_versionL:1.0
        }
      },(res)=>{console.log(res)}) 
      } 
    })
  server.route({
    method:'GET',
    path:'/tokenized',
    handler:(req,reply)=>{
      server.log('info',req)
      httpsRequest({
        hostname:'',
        port: 443,
        method:'POST',
        path: '/login/oauth/access_token',
        headers:{
          'Accept':'application/json'
        },
        body: querystring.stringify({
          client_id: process.env.TWITTER_CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET, 
          code: req.query.code
        }) 
      },()=>{})
    }
  })

  server.start(()=>{
    console.log('server is running on port:', server.info.port)
  })
  //for testing
const options = {
  hostname:'api.twitter.com/',
  port: 443,
  method:'POST',
  path: '/oauth/request_token',
  headers:{
    'oauth_consumer_key':process.env.TWITTER_CLIENT_ID,
    'oauth_callback':process.env.REDIRECT_URI,
    'oauth_nonce':nonce(32),// generate nonce,
    'oauth_signature_method':'HMAC-SHA1',
    'oauth_timestamp': Date.now(),
    'oauth_signature': 'placeholder',// signature
    'oauth_versionL':1.0
  }
}


