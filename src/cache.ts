import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
const CACHE_FILE_PATH = "./apod/chache.json" 

type CachedApiData = {
    apodToday: {
        request : string 
        response: ApodResponse 
    } | undefined
    apodPhotos: {
        request: string 
        response: ApodResponse[] 
    }  | undefined
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
}
export class EndpointCache {
    _apodToday: {
        request : string
        response: ApodResponse 
    } | undefined

    _apodPhotos: {
        request: string 
        response: ApodResponse[] 
    } | undefined
    
    constructor() {
        this._apodToday = undefined
        this._apodPhotos = undefined
    }

    loadCache() {
        try {
            const absolutePath : string =  join(__dirname, CACHE_FILE_PATH);
            const cacheData : CachedApiData = JSON.parse(readFileSync(absolutePath, "utf-8"));
            this._apodPhotos = cacheData.apodPhotos
            this._apodToday = cacheData.apodToday
        }
        catch (error) {
            console.log(error)
        }
    }

    updateCache(){
        try {
            const absolutePath : string =  join(__dirname, CACHE_FILE_PATH);
            const jsonData = JSON.stringify(this)
            writeFileSync(absolutePath, jsonData, { encoding: 'utf8' });
        }
        catch(error) {
            console.log(error);
        }
    }
    public set apodPhotos(data: {request: string, response: ApodResponse[]}){
        this._apodPhotos = data
        this.updateCache()
    }
    public set apodToday(data: {request: string, response: ApodResponse}){
        this._apodToday = data
        this.updateCache()
    }
    public get apodPhotos() : {
        request : string
        response: ApodResponse[] 
    } | undefined {
        this.loadCache()
        return this._apodPhotos
    }

    public get apodToday() : {
        request : string
        response: ApodResponse 
    } | undefined {
        this.loadCache()
        return this._apodToday
    }
}