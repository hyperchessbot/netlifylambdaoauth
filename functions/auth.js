const soa = require('simple-oauth2')

const client = soa.create({
    client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
    },
    auth: {
        tokenHost: 'https://oauth.lichess.org',
        tokenPath: '/oauth',
        authorizePath: '/oauth/authorize',
    },
})

const authorizationURI = client.authorizationCode.authorizeURL({
    redirect_uri: process.env.CALLBACK_URL,    
    scope: '',    
    state: '',
  })

exports.handler = (event, context, callback) => {  
  const response = {
    statusCode: 302,
    headers: {
      Location: authorizationURI,
      'Cache-Control': 'no-cache'
    },
    body: ''
  }

  return callback(null, response)
}
