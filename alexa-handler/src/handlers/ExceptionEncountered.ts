import * as ASK from 'ask-sdk-core'
import log from './../log'

export const ExceptionEncounteredHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered'
    },
    handle(handlerInput) {
        log('---', 'ExceptionEncountered')
        console.log('\n' + JSON.stringify(handlerInput.requestEnvelope, null, 2))

        return handlerInput.responseBuilder.getResponse()
    },
}
