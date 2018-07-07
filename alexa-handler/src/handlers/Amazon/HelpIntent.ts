import * as ASK from 'ask-sdk'

export const HelpIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
        )
    },
    handle(handlerInput) {
        const speechText = 'This is help intent'

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Help intent', speechText)
            .getResponse()
    },
}
