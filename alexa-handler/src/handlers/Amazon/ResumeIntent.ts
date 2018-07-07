import * as ASK from 'ask-sdk'

export const ResumeIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent'
        )
    },
    handle(handlerInput) {
        const speechText = 'This is resume intent'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Resume intent', speechText)
            .getResponse()
    },
}
