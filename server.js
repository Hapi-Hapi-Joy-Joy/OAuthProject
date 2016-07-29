'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const { oauth, encrypt, decrypt } = require('./src/utils')(require('crypto'), require('oauth').OAuth)
const path = require('path');

const qs = require('querystring') //format params for queries
const Twitter = require('twitter-node-client').Twitter; //this is the correct formulation for this--if I use twitter-js-client the server won't run

const server = new hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'public')
      }
    }
  }
})

// ******************
// var config = {
//         "consumerKey": process.env.TWITTER_CLIENT_ID,
//         "consumerSecret": process.env.CLIENT_SECRET,
//         "accessToken": process.env.TWITTER_ACCESS_TOKEN, // we need fill in from cookie
//         "accessTokenSecret": process.env.TWITTER_ACCESS_TOKEN_SECRET, //fill in from cookie?
//         "callBackUrl": "http://127.0.0.1:8080/auth/twitter/callback"
//     }
//
// var twitter = new Twitter(config);
//
// // Get 10 tweets with haiku hashtag
//
// twitter.getSearch({'q':'#haiku','count': 10}, error, success);
//
// // *****************



server.connection({ port: 3000 })

const handlers = require('./src/handlers.js')( oauth, server, encrypt, decrypt )

server.register([
  require('inert'), { register: require('good'), options: require('./src/options') }
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
  handler: handlers.doLogin
})

server.route({
  method:'GET',
  path:'/tokenised',
  handler: handlers.tokenised
})


server.route({
  method:'GET',
  path: '/{stuff*}',
  handler: {
    directory:{
      path:'public',
      listing:true
    }

  }
})
server.start(()=>{
  console.log('server is running on port:', server.info.port)
})
