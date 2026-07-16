export type ApodParams = {
    date? : string,
    start_date? : string,
    end_date? : string,
    count? : number,
    thumbs? : boolean,
    api_key : string
}

export type ApodResponse = {
    copyright: string,
    date: string,
    explanation: string,
    hdurl: string,
    media_type : string
    service_version: string
    title: string
    url : string
    [key : string] : string
}