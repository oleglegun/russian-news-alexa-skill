import * as ASK from 'ask-sdk'

export const PlaybackStartedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted'
    },
    async handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse()
    },
}