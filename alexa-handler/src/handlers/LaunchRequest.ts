import * as ASK from 'ask-sdk-core'
import { isAccessedToday } from '../helpers'
import speech from '../speech'
import { PlayNewsIntentHandler } from './PlayNewsIntent'
import log from '../log'

export const LaunchRequestHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    async handle(handlerInput) {
        log('---', 'LaunchRequest')

        const {
            getUser,
            createNewUser,
            putUser,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        // New user
        if (!user) {
            // Create new user
            const newUser = createNewUser()
            await putUser(newUser)

            return handlerInput.responseBuilder
                .speak(speech.welcome)
                .reprompt('To start listening please say "start".')
                .getResponse()
        }

        // Recurring user
        if (!isAccessedToday(user)) {
            user.DaysActive++
        }

        // Devices
        const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId

        if (user.Devices[deviceId]) {
            // Device found
            user.Devices[deviceId].ItemsConsumed++
        } else {
            // Add new device
            user.Devices[deviceId] = {
                ItemsConsumed: 0,
                SupportedInterfaces: Object.keys(
                    handlerInput.requestEnvelope.context.System.device.supportedInterfaces
                ),
            }
        }

        user.Invocations++
        user.LastAccess = new Date().toISOString()

        await putUser(user)

        if (user.Invocations === 2) {
            // Second invocation
            return handlerInput.responseBuilder.speak(speech.secondInvocation).getResponse()
        }

        return PlayNewsIntentHandler.handle(handlerInput)
    },
}
