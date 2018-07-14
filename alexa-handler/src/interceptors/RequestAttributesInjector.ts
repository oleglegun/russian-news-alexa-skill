import * as ASK from 'ask-sdk-core'
import { getNewsItems, getUserAttributes, putUserAttributes } from '../dynamo'
import { createNewUser, extractToken, generateAudioMetadata, getNextNewsItem } from '../helpers'

export const RequestAttributesInjector: ASK.RequestInterceptor = {
    async process(handlerInput) {
        const userId = handlerInput.requestEnvelope.context.System.user.userId

        const memoizeGetUserAttributes = (fn: (id: string) => Promise<IUserDDB | undefined>) => {
            let user: IUserDDB | undefined
            return async (id: string): Promise<IUserDDB | undefined> => {
                if (user) {
                    return user
                }
                user = await fn(userId)
                return user
            }
        }

        const memoizeGetNewsItems = (fn: () => Promise<INewsItemDDB[]>) => {
            let news: INewsItemDDB[]
            return async (): Promise<INewsItemDDB[]> => {
                if (news) {
                    return news
                }
                news = await fn()
                return news
            }
        }

        const getUserAttributesMemoized = memoizeGetUserAttributes(getUserAttributes)
        const getNewsItemsMemoized = memoizeGetNewsItems(getNewsItems)

        handlerInput.attributesManager.setRequestAttributes({
            createNewUser: () => createNewUser(handlerInput),
            extractToken: () => extractToken(handlerInput),
            generateAudioMetadata,
            getNews: getNewsItemsMemoized,
            getNextNewsItem: async (currentNewsItemId: string) =>
                getNextNewsItem(handlerInput, currentNewsItemId),
            getUser: async () => getUserAttributesMemoized(userId),
            putUser: async (attributes: IUserDDB) => putUserAttributes(userId, attributes),
        } as IRequestAttributes)
    },
}
