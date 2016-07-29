'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const { oauth, encrypt, decrypt } = require('./src/utils')(require('crypto'), require('oauth').OAuth)
const path = require('path');

const server = new hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'public')
      }
    }
  }
})

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
  method: 'GET',
  path: '/cookieTest',
  handler:handlers.cookieTest
})

server.route({
  method: 'GET',
  path: '/twituser',
  handler: handlers.getUser
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
