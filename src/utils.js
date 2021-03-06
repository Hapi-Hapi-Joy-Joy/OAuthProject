'use strict'
module.exports = (crypto, OAuth)=> { return {

  encrypt: (text)=>{
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  },
  decrypt:(text)=>{
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  },
  oauth: new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_CLIENT_ID,
    process.env.CLIENT_SECRET,
    '1.0',
    'http://localhost:3000/tokenised',
    'HMAC-SHA1'
  )
}}

