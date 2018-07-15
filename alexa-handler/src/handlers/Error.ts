import * as ASK from 'ask-sdk-core'
import speech from '../speech'

export const ErrorHandler: ASK.ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput, error) {
        console.log('Error:', error)

        return handlerInput.responseBuilder
            .speak(speech.error)
            .reprompt(speech.error)
            .getResponse()
    },
}
