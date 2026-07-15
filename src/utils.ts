import { error } from "console";
import { readFileSync } from "fs";
import { join } from "path";
import { exec } from 'child_process';

const PHOTO_SAVE_DIR = "C:\\Users\\PetDra\\bootcamp\\day6\\photos"

export type ApodParams = {
    date? : string,
    start_date? : string,
    end_date? : string,
    count? : number,
    thumbs? : boolean,
    api_key : string
}

export function savePhoto(photoUrl: string) : void {
    const urlParts = photoUrl.split("/")
    const fileName = `${urlParts[urlParts.length-1]}` 
    const savePath = join(PHOTO_SAVE_DIR, fileName)
    const curlCall = `curl.exe -o "${savePath}" "${photoUrl}"`

    try {
        const {stdout, stderr} = exec(curlCall);
    }
    catch(error) {
        console.error("Unknown execution error:", error)
    }
}
export function apiRequestStringBuilder(params : ApodParams){
    const apiBase : string = "https://api.nasa.gov/planetary/apod?" 
    const apiParts : string[] = []
    for(const param of Object.keys(params) as Array<keyof typeof params> ) {
        apiParts.push(`${param}=${params[param]}`)
        
    }
    return apiBase.concat(apiParts.join("&"));
}

export function isValidDate(dateString: string) : boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}