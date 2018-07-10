import * as ASK from 'ask-sdk'
import { getNewsItems, getUserAttributes, putUserAttributes } from '../dynamo'

export const DynamoDBHelpers: ASK.RequestInterceptor = {
    async process(handlerInput) {
        const userId = handlerInput.requestEnvelope.context.System.user.userId

        handlerInput.attributesManager.setRequestAttributes({
            getNews: getNewsItems,
            getUser: async () => getUserAttributes(userId),
            putUser: async (attributes: IUserDDB) => putUserAttributes(userId, attributes),
        })
    },
}
