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

exports.handler = (event, context, callback) => {
  const code = event.queryStringParameters.code
  const state = event.queryStringParameters.state

  client.authorizationCode.getToken({
    code: code,
    redirect_uri: process.env.CALLBACK_URL,    
  })
    .then(result => {
      const token = result.token
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
      })
    })    
    .catch((error) => {
      console.log('Access Token Error', error.message)
      console.log(error)
      return callback(null, {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          error: error.message,
        })
      })
    })
}