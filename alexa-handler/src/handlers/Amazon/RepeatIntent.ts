import * as ASK from 'ask-sdk-core'
import { PlayNewsIntentHandler } from '../PlayNewsIntent'

export const RepeatIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'
        )
    },
    handle(handlerInput) {
        return PlayNewsIntentHandler.handle(handlerInput)
    },
}
