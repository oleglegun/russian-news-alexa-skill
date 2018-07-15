import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PlaybackFailedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackFailed'
    },
    async handle(handlerInput) {
        log('---', 'PlaybackFailed')

        return handlerInput.responseBuilder.getResponse()
    },
}
