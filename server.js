'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const querystring = require('querystring') //format params for queries


const goodOptions = {
    ops: {
        interval: 1000
    },
    reporters: {
        console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        http: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
        }, {
            module: 'good-http',
            args: ['http://prod.logs:3000', {
                wreck: {
                    headers: { 'x-api-key': 12345 }
                }
            }]
        }]
    }
};

const server = new hapi.Server()
server.connection({
  port: 3000
})
server.register([
  require('inert'), { register: require('good'), options: goodOptions }
],()=>{})

server.route({
  method:'GET',
  path:'/',
  handler:(req,reply)=>{
    reply.file('./login.html') 
  }
})
server.start(()=>{
console.log('server is running on port:', server.info.port)
})

