'use strict'
const https = require('https')
const querystring = require('querystring')
const crypto = require('crypto')

function httpsRequest(params, callback){
  let req = https.request(params, (res)=>{
    let response = ''
    res.on('data', (chunk)=>{
      response += chunk
    }) 
    res.on('end',(err)=>{
      if(err) throw err
      callback(response)
    })
  })
  req.on('err',(err)=>{
    console.log(err) 
  }) 
  try{
    req.write(params.body)
  } catch(e){
    if (e) console.log('no post request')
  }
  req.end()
}

function buildUrl(){
  let base = 'https://api.twitter.com/oauth/request_token'
  return base + '?'+ querystring.stringify({
    oauth_callback: process.env.REDIRECT_URI,
    scope:'user'
  })
}
function nonce(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generateSignature(obj){
  let first = obj.method
  let second = 'https://'+ obj.hostname + obj.path
  let third =  encodeURIComponent('oauth_callback')+ '=' + encodeURIComponent(process.env.REDIRECT_URI)
  let baseString = first+'&'+second+'&'+third 
  let signingKey = process.env.CONSUMER_SECRET + '&' + process.env.ACCESS_SECRET
  let hex =  crypto.createHmac('sha1',signingKey)
                   .update(baseString)
                   .digest('hex')
   return   new Buffer(hex, 'binary').toString('base64')
}


module.exports  = {
  httpsRequest,
  buildUrl,
  nonce,
  generateSignature
}
