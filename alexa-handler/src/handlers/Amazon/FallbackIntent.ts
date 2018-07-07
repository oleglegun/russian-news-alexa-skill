import * as ASK from 'ask-sdk'

export const FallbackIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
        )
    },
    handle(handlerInput) {
        const speechText = 'This is fallback intent'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Fallback intent', speechText)
            .getResponse()
    },
}
