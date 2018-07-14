import * as ASK from 'ask-sdk-core'

export const PauseIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent'
        )
    },
    handle(handlerInput) {
        const context = handlerInput.requestEnvelope.context

        return handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse()
    },
}
