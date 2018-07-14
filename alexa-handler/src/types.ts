interface INewsItemDDB {
    Id: string
    Title: string
    SourceURL: string
    AudioURL: string
    ImageURL: string
}

interface IUserDDB {
    FirstAccess: string
    Invocations: number
    LastAccess: string
    DaysActive: number
    ItemsConsumed: number
    Devices: {
        [key: string]: {
            ItemsConsumed: number
            SupportedInterfaces: string[]
        }
    }
    LastPlayedItem: string
    Role: 'USER' | 'TESTER' | 'ADMIN'
    Notes?: string
}

interface IRequestToken {
    type: 'ITEM' | 'GREETING' | 'FAREWELL' | 'ETC'
    id: string
}

interface IRequestAttributes {
    createNewUser(): IUserDDB
    extractToken(): IRequestToken
    generateAudioMetadata(newsItem: INewsItemDDB): any
    getNews(): Promise<INewsItemDDB[]>
    getNextNewsItem(currentNewsId: string): Promise<INewsItemDDB | undefined>
    getUser(): Promise<IUserDDB | undefined>
    putUser(attributes: IUserDDB): Promise<void>
    supportsDisplay(): boolean
}
