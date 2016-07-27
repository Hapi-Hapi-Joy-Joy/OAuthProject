'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const querystring = require('querystring') //format params for queries
const {buildUrl, httpsRequest} = require('./utilities')

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
    reply.redirect(buildUrl())    }
})
server.route({
  method:'GET',
  path:'/tokenized',
  handler:(req,reply)=>{
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

