const soa = require('simple-oauth2')
const fetch = require('node-fetch')

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
    }).then(result => {
        console.log("result", result)

        const token = result.access_token

        const url = `https://lichess.org/api/account`

        let config = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }

        console.log("fetching", url, config)      

        fetch(url, config).then(
            response => response.json().then(
                json => {
                    console.log(json)
                    return callback(null, {
                        statusCode: 302,
                        headers: {
                            Location: `https://amgilp.herokuapp.com?getpuzzles=${json.username}`,
                            'Cache-Control': 'no-cache'
                        },
                        body: ''
                    })
                },
            err => {
                console.log(err)
                return callback(null, {
                    statusCode: error.statusCode || 500,
                    body: `json parsing error`
                })
            }   
        ),
        err => {
            console.log("fetch error", err)
            return callback(null, {
                statusCode: error.statusCode || 500,
                body: `fetch error`
            })
        }
    )})
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
