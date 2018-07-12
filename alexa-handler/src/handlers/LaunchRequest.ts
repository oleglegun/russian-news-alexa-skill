import * as ASK from 'ask-sdk'
import speech from '../speech'
import { isAccessedToday } from '../helpers'
import { PlayNewsIntentHandler } from './PlayNewsIntent'

export const LaunchRequestHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    async handle(handlerInput) {
        const {
            getUser,
            createNewUser,
            putUser,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            // Create new user
            const newUser = createNewUser()
            await putUser(newUser)

            return handlerInput.responseBuilder
                .speak(speech.welcome)
                .reprompt('To start listening please say "start".')
                .getResponse()
        }

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
                ItemsConsumed: 1,
                SupportedInterfaces: Object.keys(
                    handlerInput.requestEnvelope.context.System.device.supportedInterfaces
                ),
            }
        }

        user.Invocations++
        user.LastAccess = new Date().toISOString()

        await putUser(user)

        return PlayNewsIntentHandler.handle(handlerInput)
    },
}
