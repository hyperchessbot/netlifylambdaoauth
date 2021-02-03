const { update } = require('./octokit.js')

const fetch = require('node-fetch')

exports.handler = (event, context, callback) => {
    /*if (event.httpMethod !== 'POST') {
        return callback(null, {
            statusCode: 400,
            body: 'Method not allowed for this endpoint.',
            headers: {
                'Allow': 'POST'
            }
        })
    }*/

    const name = event.queryStringParameters.name;

    console.log("name", name)

    const path = `discordlambda/sites/${name}`

    console.log("path", path)

    const body = event.body

    console.log("body", body)

    update("hyperchessbot", "netlifylambdaoauth", path, body, result => {
      if(result.error) {
        return callback(null, {
            statusCode: 500,
            body: `Update error.`
        })
      }
      else {
        return callback(null, {
            statusCode: 200,
            body: 'Updated ok.'
        })
      }
    })        
}
