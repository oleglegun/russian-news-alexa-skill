import * as ASK from 'ask-sdk'
import { DEBUG } from '../env'

export const Logger: ASK.ResponseInterceptor = {
    async process(handlerInput, response) {
        if (DEBUG) {
            console.log('=== REQUEST ===\n', handlerInput.requestEnvelope)
            console.log('=== RESPONSE ===\n', response)
        }
    },
}
