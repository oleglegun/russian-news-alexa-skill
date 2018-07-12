import * as ASK from 'ask-sdk'

export const PlaybackFailedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackFailed'
    },
    async handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse()
    },
}
