import * as ASK from 'ask-sdk-core'
import log from '../log'

export const SessionEndedRequestHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
    },
    handle(handlerInput) {
        log('---', 'SessionEndedRequest')
        return handlerInput.responseBuilder.getResponse()
    },
}
