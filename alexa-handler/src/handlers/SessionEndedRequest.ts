import * as ASK from 'ask-sdk'

export const SessionEndedRequestHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
    },
    handle(handlerInput) {
        // any cleanup logic goes here
        console.log('---', 'SessionEndedRequest')
        return handlerInput.responseBuilder.getResponse()
    },
}
