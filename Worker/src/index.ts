import axios from "axios";
import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL
})


async function processSubmission(submission : string){
    const { roomId, code, language } = JSON.parse(submission);
    
    const Judge0URL = 'https://judge0.p.rapidapi.com/submissions?fields=*&base64_encoded=false&wait=true'
    const judge0Key = process.env.X_RAPID_API_KEY || "";

    const payLoad = {
        source_code: code,
        language_id: getLanguageId(language),
    };

    try{
        const response = await axios.post(Judge0URL, payLoad, {
            headers: {
                "content-type": "application/json",
                "x-rapidapi-key": judge0Key,
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            }
        });

        if (!response.data || !response.data.status || response.data.status.id <= 2) {
            throw new Error(`Judge0 API responded with status ${response.data.status}`);
        }

        let result = response.data;

        if (result.status.id <= 2) {
            //still processing
            result = await pollJudge0Result(result.token, judge0Key);
        }

        await redisClient.publish(roomId, JSON.stringify(result));
        console.log(`Published result to room: ${roomId}`);
    } catch (error) {
        console.error(`Error processing submission for room: ${roomId}`, error);
    }
}


async function pollJudge0Result(token: string, apiKey: string){
    const Judge0URL = `https://judge0.p.rapidapi.com/submissions/${token}?base64_encoded=false`

    while(true){
        try{
            const response = await axios.get(Judge0URL, {
                headers: {
                    "content-type": "application/json",
                    "x-rapidapi-key": apiKey,
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                }
            });

            if (!response.data || !response.data.status) {
                throw new Error(`Judge0 API responded with status ${response.data.status}`);
            }

            const result = response.data;

            if (result.status.id > 2) {
                return result;
            }
            else{
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }


        } catch(e){
            console.error(`Error polling Judge0 for token: ${token}`, e);

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
}

function getLanguageId(language: string){
    const languageMap : { [key : string] : number } = {
        "python": 71,
        "javascript": 63,
        "cpp": 54,
        "java": 62,
        "Typescript": 94,
        "Lua" : 64
    }
    return languageMap[language.toLowerCase()];
}


async function worker() {
    try{
        await redisClient.connect();
        console.log("Worker connected to Redis");

        while(true){
            const data  = await redisClient.brPop("code-execution", 0); // 0 means wait indefinitely

            if(data){
                await processSubmission(data.element);
            }
        }
    } catch(e){
        console.log(e);
    }
}

worker();