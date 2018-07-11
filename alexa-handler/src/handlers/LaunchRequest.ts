import * as ASK from 'ask-sdk'
import { welcomeSpeech } from '../speech'
import { PlayNewsIntentHandler } from './PlayNewsIntent'

export const LaunchRequestHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'

        // handlerInput.attributesManager.getPersistentAttributes()
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes
        const user = await requestAttributes.getUser()
        console.log('user:', user)

        if (!user) {
            // Create new user
            const newUser = requestAttributes.createNewUser()
            await requestAttributes.putUser(newUser)

            return handlerInput.responseBuilder
                .speak(welcomeSpeech)
                .reprompt('To start listening please say "start".')
                .getResponse()
        }

        return PlayNewsIntentHandler.handle(handlerInput)
    },
}
