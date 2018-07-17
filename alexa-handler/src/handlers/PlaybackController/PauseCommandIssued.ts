import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PauseCommandIssuedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'PlaybackController.PauseCommandIssued'
    },
    handle(handlerInput) {
        log('---', 'PauseCommandIssued')

        return handlerInput.responseBuilder.getResponse()
    },
}
