import * as ASK from 'ask-sdk'
import { PauseIntentHandler } from './PauseIntent'

export const StopIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        )
    },
    handle(handlerInput) {
        return PauseIntentHandler.handle(handlerInput)
    },
}
