import * as ASK from 'ask-sdk'
import { getNewsItems, getUserAttributes, putUserAttributes } from '../dynamo'
import { createNewUser, getNextNewsItem } from '../helpers'

export const RequestAttributesInjector: ASK.RequestInterceptor = {
    async process(handlerInput) {
        const userId = handlerInput.requestEnvelope.context.System.user.userId

        const memoizeGetUserAttributes = (fn: IGetUserAttributes) => {
            let user: IUserDDB | undefined
            return async (id: string): Promise<IUserDDB | undefined> => {
                if (user) {
                    return user
                }
                user = await fn(userId)
                return user
            }
        }

        const getUserAttributesMemoized = memoizeGetUserAttributes(getUserAttributes)

        handlerInput.attributesManager.setRequestAttributes({
            createNewUser: () => createNewUser(handlerInput),
            getNews: getNewsItems,
            getNextNewsItem: async (currentNewsItemId: string) =>
                getNextNewsItem(handlerInput, currentNewsItemId),
            getUser: async () => getUserAttributesMemoized(userId),
            putUser: async (attributes: IUserDDB) => putUserAttributes(userId, attributes),
        } as IRequestAttributes)
    },
}
