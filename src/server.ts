import express from "express";
import axios from "axios";
import {getEnvVariable} from "./config"
import { apiRequestStringBuilder, ApodParams, isValidDate, savePhoto} from "./utils"
import { EndpointCache, ApodResponse } from "./cache";
import { json } from "body-parser";


const TEST_API = "https://official-joke-api.appspot.com/random_joke"
const app = express();
const port = 8000;
const endpointCache = new EndpointCache()

app.use(express.json());
const router = express.Router();

router.get('/test', (_, res) => res.send('Hello world !'));

router.get('/apod/today', (req, res) => {
    const apiParams : ApodParams = {
        api_key: getEnvVariable("NASA_API_KEY")
    } 

    const nasaApiString = apiRequestStringBuilder(apiParams) 
    if (endpointCache.apodToday && endpointCache.apodToday.request == nasaApiString) {
        res.send(endpointCache.apodToday.response);
        return;
    }
    
    axios.get<ApodResponse>(nasaApiString)
        .then(apodApiResponse => {
            const photoData : ApodResponse = apodApiResponse.data
            savePhoto(photoData.url);
            res.send(photoData)    
        })
        .catch(error =>{
            res.send(error)
        })
    
})

router.get('/apod/photos', (req, res) => {
    const startDate : string | undefined = req.query.start_date ? req.query.start_date.toString() : undefined
    const endDate : string | undefined = req.query.end_date ? req.query.end_date.toString() : undefined
    const limit : number = req.query.limit ? parseInt(req.query.limit.toString()) : 10
    const offset : number  = req.query.offset ? parseInt(req.query.offset.toString()) : 0
    
    if (!startDate && !endDate) {
        res.status(400).json({error: "start_date and end_date must be included"})
        return;
    }

    if (!isValidDate(startDate) && !isValidDate(endDate)) {
        res.status(400).json({error: "dates should be YYY-MM-DD format"})
        return;
    }
    
    if (Date(startDate) > Date(endDate)) {
        res.status(400).json({error: "start date should be less the end date"})
        return;
    }

    const apiParams : ApodParams = {
        api_key: getEnvVariable("NASA_API_KEY"),
        start_date: startDate,
        end_date: endDate
    }

    const nasaApiString = apiRequestStringBuilder(apiParams) 
    const nextPage: object = {next_page : `${req.protocol}://${req.hostname}:8000${req.originalUrl}&offset=${offset+limit}&limit=${limit}`}
    if (endpointCache.apodPhotos && endpointCache.apodPhotos.request.includes(nasaApiString)) { 
        const photoData : ApodResponse[] = endpointCache.apodPhotos.response
        const truncatedData = photoData.slice(offset, offset + limit);
        res.send([...truncatedData, nextPage]);
        return;
    }

    axios.get<ApodResponse[]>(TEST_API)
        .then(apodApiResponse => {
            const photosData : ApodResponse[] = apodApiResponse.data
           
            for (const photo of photosData) {
                 savePhoto(photo.url);
            }
            res.send([...photosData, nextPage])    
        })
        .catch(error =>{
            res.send(error)
        })
    
})

app.use('/', router);

app.listen(port, () => {
  console.log(`Test backend is running on port ${port}`);
});


