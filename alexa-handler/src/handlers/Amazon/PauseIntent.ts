import * as ASK from 'ask-sdk'

export const PauseIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent'
        )
    },
    handle(handlerInput) {
        const context = handlerInput.requestEnvelope.context
        if (context.AudioPlayer && context.AudioPlayer.playerActivity === 'PLAYING') {
            return handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse()
        }

        return handlerInput.responseBuilder.getResponse()
    },
}
