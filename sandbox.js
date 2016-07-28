'use strict'
const crypto = require('crypto')
function generateSignature(obj){
  let first = obj.method
  let second = obj.hostname+obj.path
  let third =  encodeURIComponent(oauth_callback)+ '=' + encodeURIComponent(process.dev.REDIRECT_URI)
  let baseString = first+'&'+second+'&'+third 
  let signingKey = process.env.CONSUMER_SECRET + '&' + process.env.ACCESS_SECRET
  return crypto('sha1',signingKey).update(baseString)
}

console.log(generateSignature(options))
