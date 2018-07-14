import * as ASK from 'ask-sdk-core'

export const PreviousIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent'
        )
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse()
    },
}
