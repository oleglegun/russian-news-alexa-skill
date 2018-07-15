import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PlaybackStartedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted'
    },
    async handle(handlerInput) {
        log('---', 'PlaybackStarted')

        return handlerInput.responseBuilder.getResponse()
    },
}
