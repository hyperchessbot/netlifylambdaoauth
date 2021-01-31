const fetch = require('node-fetch')

exports.handler = (event, context, callback) => {
    let url = `https://lichess.org/tv/channels`

    fetch(url, {}).then(
        response => response.json().then(
            json => {
                console.log(json)
                return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(json, null, 2)
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
    })
}
