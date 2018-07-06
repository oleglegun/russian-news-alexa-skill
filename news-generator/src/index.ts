import { DEBUG } from './env'
import { generateNews } from './handlers'

export async function handler(event, context, callback) {
    let response

    if (DEBUG) {
        console.log('--- DEBUG MODE ---')
    }

    switch (event.action_type) {
        case 'log':
            response = {
                body: 'Logging',
                statusCode: 200,
            }
            break
        case 'generate':
        default:
            try {
                await generateNews()

                response = {
                    body: 'Successfully generated.',
                    statusCode: 200,
                }
            } catch (err) {
                response = {
                    body: err.message,
                    statusCode: 500,
                }

                callback(err)
                return
            }
    }

    callback(null, response)
}
