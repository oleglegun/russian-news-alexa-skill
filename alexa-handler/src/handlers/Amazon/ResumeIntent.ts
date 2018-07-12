import * as ASK from 'ask-sdk'
import { PlayNewsIntentHandler } from '../PlayNewsIntent'

export const ResumeIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent'
        )
    },
    handle(handlerInput) {
        return PlayNewsIntentHandler.handle(handlerInput)
    },
}
