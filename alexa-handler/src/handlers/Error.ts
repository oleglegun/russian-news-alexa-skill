import * as ASK from 'ask-sdk-core'
import speech from '../speech'

export const ErrorHandler: ASK.ErrorHandler = {
    canHandle() {
        return true
    },
    async handle(handlerInput, error) {
        console.log('Error:', error)

        const {
            getUser,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            throw new Error(`"user" is undefined`)
        }

        switch (user.Role) {
            case 'ADMIN':
            case 'TESTER':
                return handlerInput.responseBuilder
                    .speak(speech.errorTester)
                    .withSimpleCard('Russian News Error', error.stack ? error.stack : error.message)
                    .getResponse()

            default:
                return handlerInput.responseBuilder
                    .speak(speech.error)
                    .reprompt(speech.error)
                    .getResponse()
        }
    },
}
