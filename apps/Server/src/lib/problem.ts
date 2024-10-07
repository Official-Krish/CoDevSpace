import fs from "fs";

type SUPPORTED_LANGS = "js" | "cpp" | "rs"|"java";
interface Problem {
    id: string;
    fullBoilerplateCode: string;
    inputs: string[];
    outputs: string[];
}
const MOUNT_PATH = "../problems"

export const getProblem = async (
    problemId : string,
    languageId : SUPPORTED_LANGS
): Promise<Problem> => {
    const fullBoilerPlate = await getProblemFullBoilerplate(problemId, languageId);

    const inputs = await getProblemInputs(problemId);
    const outputs = await getProblemOutputs(problemId);
    return {
        id: problemId,
        fullBoilerplateCode: fullBoilerPlate,
        inputs,
        outputs
    };
}

async function getProblemFullBoilerplate(problemId: string, languageId: SUPPORTED_LANGS): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(`../problems/${problemId}/boilerplate-full/function.${languageId}`, {encoding: "utf-8"}, (err, data) => {
            if (err) {
                console.log("idhar",err);
                reject(err);
            }
            resolve(data);
        });
    });
}

async function getProblemInputs(problemId: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(`../problems/${problemId}/tests/inputs`, async (err, files) => {
            if (err) {
                console.log("fatta",err);
                console.log(err);
            }
            else{
                await Promise.all(files.map((file) => {
                    return new Promise<string>((resolve, reject) => {
                        fs.readFile(`../problems/${problemId}/tests/inputs/${file}`, {encoding: "utf-8"}, (err, data) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(data);
                        });
                    });
                }))
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    console.log("yaha")
                    reject(err);
                });
            }
        });
    });
}

async function getProblemOutputs(problemId: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(`../problems/${problemId}/tests/outputs`, async (err, files) => {
            if (err) {
                console.log(err);
                console.log("kaha",err);
            }
            else{
                await Promise.all(files.map((file) => {
                    return new Promise<string>((resolve, reject) => {
                        fs.readFile(`../problems/${problemId}/tests/outputs/${file}`, {encoding: "utf-8"}, (err, data) => {
                            if (err) {
                                reject(err);
                                console.log("abety",err);
                            }
                            resolve(data);
                        });
                    });
                }))
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    console.log("bc chal ja")
                    reject(err);
                });
            }
        });
    });
}