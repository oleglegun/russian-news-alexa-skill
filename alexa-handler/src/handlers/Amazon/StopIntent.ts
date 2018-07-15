import * as ASK from 'ask-sdk-core'
import { PauseIntentHandler } from './PauseIntent'
import log from '../../log'

export const StopIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        )
    },
    handle(handlerInput) {
        log('---', 'StopIntent')

        return PauseIntentHandler.handle(handlerInput)
    },
}
