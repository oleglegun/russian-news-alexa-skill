import * as ASK from 'ask-sdk'

export const StopIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        )
    },
    handle(handlerInput) {
        const speechText = 'This is stop intent'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Stop Intent', speechText)
            .getResponse()
    },
}
