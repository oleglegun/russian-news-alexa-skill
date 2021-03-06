import * as ASK from 'ask-sdk-core'
import { DEBUG } from '../env'

export const Logger: ASK.ResponseInterceptor = {
    async process(handlerInput, response) {
        if (DEBUG) {
            console.log(
                '=== REQUEST ===\n',
                JSON.stringify(handlerInput.requestEnvelope.request, null, 2)
            )
            console.log('=== RESPONSE ===\n', JSON.stringify(response, null, 2))
        }
    },
}
