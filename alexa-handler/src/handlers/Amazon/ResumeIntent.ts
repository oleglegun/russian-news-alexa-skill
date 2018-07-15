import * as ASK from 'ask-sdk-core'
import { PlayNewsIntentHandler } from '../PlayNewsIntent'
import log from '../../log'

export const ResumeIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent'
        )
    },
    handle(handlerInput) {
        log('---', 'ResumeIntent')

        return PlayNewsIntentHandler.handle(handlerInput)
    },
}
