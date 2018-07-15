import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PlaybackStoppedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped'
    },
    async handle(handlerInput) {
        log('---', 'PlaybackStopped')

        return handlerInput.responseBuilder.getResponse()
    },
}
