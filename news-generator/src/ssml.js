const text2SSML = function(text, config) {
    const { globalVolume, country, rate } = config

    let lng
    switch (country) {
        case 'us':
            lng = '<lang xml:lang="en-US">'
            break
        case 'uk':
            lng = '<lang xml:lang="en-UK">'
            break
        default:
            throw new Error(
                `parameter country: "${country}" is not valid. Valid values: "us", "uk".`
            )
    }

    let rt
    switch (rate) {
        case 'medium':
            rt = '<prosody rate="medium">'
            break
        case 'slow':
            rt = '<prosody rate="slow">'
            break
        case undefined:
            break
        default:
            throw new Error(
                `parameter rate: "${rate}" is not valid. Valid values: "medium", "slow".`
            )
    }

    let vlm

    switch (globalVolume) {
        case 'loud':
            vlm = '<prosody volume="loud">'
            break
        case 'x-loud':
            vlm = '<prosody volume="x-loud">'
            break
        case 'default':
            vlm = ''
            break
        default:
            throw new Error(
                `parameter globalVolume: "${globalVolume}" is not valid. Valid values: "default", "loud", "x-loud".`
            )
    }

    const openTags = (rt ? rt : '') + lng
    const closeTags = '</lang>' + (rt ? '</prosody>' : '')

    const textLength = text.length

    let result = vlm
    let started
    let startPos

    // iterate over all chars
    for (i = 0; i < textLength; i++) {
        if (isLatinChar(text[i])) {
            if (!started) {
                started = true
                startPos = i
            }
        } else {
            if (started) {
                // if not whitespace - stop and surround words with tags
                if (' \t\n\r\v'.indexOf(text[i]) === -1) {
                    started = false
                    result += openTags + text.slice(startPos, i) + closeTags + text[i]
                }
            } else {
                result += text[i]
            }
        }
    }

    return result + (vlm ? '</prosody>' : '')
}

const isLatinChar = function(char) {
    const cp = char.codePointAt(0)
    return (cp > 64 && cp < 91) || (cp > 96 && cp < 123)
}

module.exports = { text2SSML }
