import * as ASK from 'ask-sdk'

export const PlayNewsIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'PlayNewsIntent'
        )
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.speak('Play Intent').getResponse()
    },
}
