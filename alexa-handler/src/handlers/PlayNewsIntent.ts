import * as ASK from 'ask-sdk-core'
import speech from '../speech'
import log from '../log'

export const PlayNewsIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'PlayNewsIntent'
        )
    },
    async handle(handlerInput) {
        log('---', 'PlayNewsIntent')

        const {
            generateAudioMetadata,
            generateCardBodyWithFreshNews,
            getNextNewsItem,
            getRemainingNewsNumber,
            getUser,
            putUser,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()
        let newsItem

        if (user) {
            // recurring user
            newsItem = await getNextNewsItem(user.LastPlayedItem)

            if (!newsItem) {
                return handlerInput.responseBuilder.speak(speech.noNews).getResponse()
            }

            if (user.Invocations === 2) {
                user.Invocations++
                await putUser(user)

                // Second invocation
                return handlerInput.responseBuilder
                    .speak(speech.secondInvocation)
                    .reprompt('Please, say start to begin')
                    .withStandardCard(
                        'Russian News Help',
                        speech.help,
                        'https://russian-news.s3.amazonaws.com/russian-news-help.png'
                    )
                    .getResponse()
            }

            return handlerInput.responseBuilder
                .addAudioPlayerPlayDirective(
                    'REPLACE_ALL',
                    newsItem.AudioURL,
                    `ITEM:${newsItem.Id}`,
                    0,
                    undefined,
                    generateAudioMetadata(newsItem, await getRemainingNewsNumber(newsItem))
                )
                .withStandardCard(
                    'Свежие новости',
                    await generateCardBodyWithFreshNews(),
                    newsItem.ImageURL
                )
                .getResponse()
        }

        // new user
        newsItem = await getNextNewsItem('')

        if (!newsItem) {
            throw new Error('getNextNewsItem() returned "undefined" for the new user')
        }

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                newsItem.AudioURL,
                `ITEM:${newsItem.Id}`,
                0,
                undefined,
                generateAudioMetadata(newsItem, await getRemainingNewsNumber(newsItem))
            )
            .withStandardCard(
                'Свежие новости',
                await generateCardBodyWithFreshNews(),
                newsItem.ImageURL
            )
            .getResponse()
    },
}
