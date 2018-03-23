const { generateNews } = require('./handlers')

const DEBUG = process.env['DEBUG']

exports.handler = function(event, context, callback) {
    let response

    if (DEBUG) console.log('--- DEBUG MODE ---')

    switch (event.action_type) {
        case 'log':
            response = {
                statusCode: 200,
                body: 'Logging',
            }
            break
        case 'generate':
        default:
            generateNews()
            response = {
                statusCode: 200,
                body: 'Generating news',
            }
            break
    }

    callback(null, response)
}
