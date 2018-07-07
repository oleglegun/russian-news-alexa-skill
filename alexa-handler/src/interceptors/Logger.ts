import * as ASK from 'ask-sdk'

const DEBUG = process.env['DEBUG']

export const LoggerInterceptor: ASK.ResponseInterceptor = {
    process(handlerInput, response) {
        if (DEBUG) {
            console.log('=== REQUEST ===\n', handlerInput.requestEnvelope)
            console.log('=== RESPONSE ===\n', response)
        }
    },
}
