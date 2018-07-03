export interface INewsItemRSS {
    id: string
    date: string
    title: string
    text: string
    sourceURL: string
    imageURL?: string
}

export interface INewsItemRSSWithSSML extends INewsItemRSS {
    ssml: string
}

export interface INewsItemDDB {
    Timestamp: string
    Title: string
    SourceURL: string
    AudioURL: string
    ImageURL: string
}

export interface INewsItemMapDDB {
    [id: string]: INewsItemDDB
}
