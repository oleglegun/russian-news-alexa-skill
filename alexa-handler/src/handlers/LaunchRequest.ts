import * as ASK from 'ask-sdk'

export const LaunchRequestHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
        const speechText = 'Welcome'
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello!', speechText)
            .getResponse()
    },
}
