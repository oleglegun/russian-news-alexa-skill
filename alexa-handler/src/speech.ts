const speech = {
    welcome: `Hello and welcome to the Russian News!
I see this is your first time here, so let me give you a quick introduction.
Important information: since this skill tells you russian news on russian language,
it is intended to be used by people who know russian or learn it.
Thank you for understanding.
So, without further ado, say "Start" to begin.`,

    secondInvocation: `Hello again!
Last time was your first time listening to the Russian news alexa skill. I hope you've enjoyed it!
Each time you open the skill, I will play to you only the news you haven't listened to yet.
Right now I'm sending information about my commands and also some tips to your Alexa app. Check it out!
I won't bother you anytime soon, I promise.
So, without further ado, say "Start" to begin.`,

    noNews: `No fresh news.`,

    isOldestNewsItem: `Sorry, this is the oldest news.`,

    error: `Sorry, I can't understand the command. Please say again.`,

    errorTester: `Critical error! I've sent the details to the Alexa app.`,

    fallbackTester: `This is fallback intent. I've sent the details to the Alexa app.`,

    help: `You can skip the currently playing news by saying "Next".
You can listen to the current news again by saying "Repeat".
Also you can repeat the last 10 news by saying "Start Over".
Each time you open the skill, I will send all fresh news titles to you Alexa app.
Moreover if you have an Alexa device with a screen - your experience will be much better!
And a quick tip for you: instead of saying "Alexa, open Russian News", just say "Alexa, Russian News" to invoke the skill faster!
Thank you for using the Russian News Alexa Skill!`,
}

export default speech
