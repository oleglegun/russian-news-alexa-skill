import * as ASK from 'ask-sdk-core'
import speech from '../../speech'
import log from '../../log'

export const FallbackIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
        )
    },
    async handle(handlerInput) {
        log('---', 'FallbackIntent')

        const {
            getUser,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            throw new Error('ErrorHandler: user is undefined')
        }

        switch (user.Role) {
            case 'ADMIN':
            case 'TESTER':
                return handlerInput.responseBuilder
                    .speak(speech.fallbackTester)
                    .withSimpleCard(
                        'Russian News Fallback',
                        JSON.stringify(handlerInput.requestEnvelope)
                    )
                    .getResponse()

            default:
                return handlerInput.responseBuilder.getResponse()
        }
        return handlerInput.responseBuilder.speak(speech.fallbackTester).getResponse()
    },
}
