import * as ASK from 'ask-sdk-core'
import speech from '../../speech'
import log from '../../log'

export const FallbackIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
        )
    },
    handle(handlerInput) {
        log('---', 'FallbackIntent')

        return handlerInput.responseBuilder
            .speak(speech.error)
            .reprompt(speech.error)
            .getResponse()
    },
}
