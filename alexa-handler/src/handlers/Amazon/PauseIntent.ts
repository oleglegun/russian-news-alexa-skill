import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PauseIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent'
        )
    },
    handle(handlerInput) {
        log('---', 'Pause')

        return handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse()
    },
}
