import * as ASK from 'ask-sdk'

export const PlaybackStoppedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped'
    },
    async handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse()
    },
}
