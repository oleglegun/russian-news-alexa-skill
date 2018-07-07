import * as ASK from 'ask-sdk'

export const PauseIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent'
        )
    },
    handle(handlerInput) {
        const speechText = 'This is pause intent'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Pause intent', speechText)
            .getResponse()
    },
}
