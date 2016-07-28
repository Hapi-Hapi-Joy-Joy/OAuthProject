'use strict'
const hapi = require('hapi')
const env = require('env2')('./config.env');
const qs = require('querystring') //format params for queries
const Twitter = require('twitter-node-client').Twitter; //this is the correct formulation for this--if I use twitter-js-client the server won't run


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

console.log(process.env.BASE_URL);

var error = function (err, response, body) {
  console.log('ERROR [%s]', error);
  //  console.log('ERROR [%s]', JSON.stringify(err));  This is an alternative, poss more readable error log.
};

var success = function (data) {
  console.log('Data [%s]', data);
  // updateResults(data);
};


var config = {
        "consumerKey": process.env.TWITTER_CONSUMER_KEY,
        "consumerSecret": process.env.TWITTER_CONSUMER_SECRET,
        "accessToken": process.env.TWITTER_ACCESS_TOKEN,
        "accessTokenSecret": process.env.TWITTER_ACCESS_TOKEN_SECRET,
        "callBackUrl": "http://127.0.0.1:8080/auth/twitter/callback"
    }

var twitter = new Twitter(config);

// Get 10 tweets with haiku hashtag

twitter.getSearch({'q':'#haiku','count': 10}, error, success);

const server = new hapi.Server()
server.connection({
  port: 3000
})
server.register([
  require('inert'), { register: require('good'), options: goodOptions }
],()=>{})

server.route([{
  method:'GET',
  path:'/',
  handler:(req,reply)=>{
    reply.file('./login.html')
  }
},
])

server.start(()=>{
console.log('server is running on port:', server.info.port)
})
