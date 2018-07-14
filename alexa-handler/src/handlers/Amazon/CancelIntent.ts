import * as ASK from 'ask-sdk-core'

export const CancelIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        )
    },
    handle(handlerInput) {
        const speechText = 'This is cancel intent'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Cancel Intent', speechText)
            .getResponse()
    },
}
