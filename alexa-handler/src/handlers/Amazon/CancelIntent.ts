import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const CancelIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        )
    },
    handle(handlerInput) {
        log('---', 'CancelIntent')

        return handlerInput.responseBuilder.getResponse()
    },
}
