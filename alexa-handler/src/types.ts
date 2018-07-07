interface INewsItemRSS {
    id: string
    date: string
    title: string
    text: string
    sourceURL: string
    imageURL?: string
}

interface INewsItemRSSWithSSML extends INewsItemRSS {
    ssml: string
}

interface INewsItemDDB {
    Id: string
    Title: string
    SourceURL: string
    AudioURL: string
    ImageURL: string
}
