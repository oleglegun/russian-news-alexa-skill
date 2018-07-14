import * as ASK from 'ask-sdk-core'
import { CancelIntentHandler } from './handlers/Amazon/CancelIntent'
import { DisplayIntentsHandler } from './handlers/Amazon/DisplayIntents'
import { ErrorHandler } from './handlers/Error'
import { FallbackIntentHandler } from './handlers/Amazon/FallbackIntent'
import { HelpIntentHandler } from './handlers/Amazon/HelpIntent'
import { LaunchRequestHandler } from './handlers/LaunchRequest'
import { NextIntentHandler } from './handlers/Amazon/NextIntent'
import { PauseIntentHandler } from './handlers/Amazon/PauseIntent'
import { PlaybackFailedHandler } from './handlers/AudioPlayer/PlaybackFailed'
import { PlaybackFinishedHandler } from './handlers/AudioPlayer/PlaybackFinished'
import { PlaybackNearlyFinishedHandler } from './handlers/AudioPlayer/PlaybackNearlyFinished'
import { PlaybackStartedHandler } from './handlers/AudioPlayer/PlaybackStarted'
import { PlaybackStoppedHandler } from './handlers/AudioPlayer/PlaybackStopped'
import { PlayNewsIntentHandler } from './handlers/PlayNewsIntent'
import { PreviousIntentHandler } from './handlers/Amazon/PreviousIntent'
import { RepeatIntentHandler } from './handlers/Amazon/RepeatIntent'
import { ResumeIntentHandler } from './handlers/Amazon/ResumeIntent'
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequest'
import { StartOverIntentHandler } from './handlers/Amazon/StartOverIntent'
import { StopIntentHandler } from './handlers/Amazon/StopIntent'

import { Logger } from './interceptors/Logger'
import { RequestAttributesInjector } from './interceptors/RequestAttributesInjector'

export const handler = ASK.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        PlaybackNearlyFinishedHandler,
        PlaybackFinishedHandler,
        PlaybackStartedHandler,
        PauseIntentHandler,
        PlayNewsIntentHandler,
        CancelIntentHandler,
        StopIntentHandler,
        NextIntentHandler,
        PlaybackStoppedHandler,
        PreviousIntentHandler,
        RepeatIntentHandler,
        ResumeIntentHandler,
        StartOverIntentHandler,
        HelpIntentHandler,
        SessionEndedRequestHandler,
        DisplayIntentsHandler,
        PlaybackFailedHandler,
        FallbackIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(RequestAttributesInjector)
    .addResponseInterceptors(Logger)
    .lambda()
