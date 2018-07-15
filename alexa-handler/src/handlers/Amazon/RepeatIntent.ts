import * as ASK from 'ask-sdk-core'
import { PlayNewsIntentHandler } from '../PlayNewsIntent'
import log from '../../log'

export const RepeatIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'
        )
    },
    handle(handlerInput) {
        log('---', 'RepeatIntent')

        return PlayNewsIntentHandler.handle(handlerInput)
    },
}
