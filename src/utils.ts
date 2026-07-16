import { join } from "path";
import { getEnvVariable } from "./config";
import { ApodParams } from "./endpoints/apod";
import axios from "axios";
import fs from "fs";

const IMAGE_EXTENSION = ".jpg"

export function savePhoto(photoUrl: string) : void {
    const urlParts = photoUrl.split("/")
    const fileName = `${urlParts[urlParts.length-1]}` 
    const savePath = join(getEnvVariable("PHOTO_SAVE_DIR"), fileName);
    
    if (!fileName.endsWith(IMAGE_EXTENSION)){
        return;
    }

    axios.get(photoUrl, {responseType: 'arraybuffer'})
        .then((res) => {
            fs.writeFileSync(savePath, Buffer.from(res.data, 'binary'));
        })
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