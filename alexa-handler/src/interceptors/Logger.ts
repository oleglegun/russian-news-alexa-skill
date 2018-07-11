import * as ASK from 'ask-sdk'
import { DEBUG } from '../env'

export const Logger: ASK.ResponseInterceptor = {
    async process(handlerInput, response) {
        if (DEBUG) {
            console.log('=== REQUEST ===\n', JSON.stringify(handlerInput.requestEnvelope, null, 2))
            console.log('=== RESPONSE ===\n', JSON.stringify(response, null, 2))
        }
    },
}
