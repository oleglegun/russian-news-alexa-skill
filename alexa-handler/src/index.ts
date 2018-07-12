import * as ASK from 'ask-sdk'
import { CancelIntentHandler } from './handlers/Amazon/CancelIntent'
import { FallbackIntentHandler } from './handlers/Amazon/FallbackIntent'
import { HelpIntentHandler } from './handlers/Amazon/HelpIntent'
import { PauseIntentHandler } from './handlers/Amazon/PauseIntent'
import { ResumeIntentHandler } from './handlers/Amazon/ResumeIntent'
import { StopIntentHandler } from './handlers/Amazon/StopIntent'
import { PlaybackFinishedHandler } from './handlers/AudioPlayer/PlaybackFinished'
import { PlaybackNearlyFinishedHandler } from './handlers/AudioPlayer/PlaybackNearlyFinished'
import { PlaybackStartedHandler } from './handlers/AudioPlayer/PlaybackStarted'
import { PlaybackStoppedHandler } from './handlers/AudioPlayer/PlaybackStopped'
import { PlaybackFailedHandler } from './handlers/AudioPlayer/PlaybackFailed'
import { ErrorHandler } from './handlers/Error'
import { LaunchRequestHandler } from './handlers/LaunchRequest'
import { PlayNewsIntentHandler } from './handlers/PlayNewsIntent'
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequest'
import { Logger } from './interceptors/Logger'
import { RequestAttributesInjector } from './interceptors/RequestAttributesInjector'
import { DisplayIntentsHandler } from './handlers/Amazon/DisplayIntents'

export const handler = ASK.SkillBuilders.standard()
    .addRequestHandlers(
        LaunchRequestHandler,
        PlaybackStartedHandler,
        PlaybackNearlyFinishedHandler,
        PlaybackFinishedHandler,
        StopIntentHandler,
        PauseIntentHandler,
        PlaybackStoppedHandler,
        ResumeIntentHandler,
        CancelIntentHandler,
        FallbackIntentHandler,
        HelpIntentHandler,
        PlayNewsIntentHandler,
        SessionEndedRequestHandler,
        PlaybackFailedHandler,
        DisplayIntentsHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(RequestAttributesInjector)
    .addResponseInterceptors(Logger)
    .lambda()
