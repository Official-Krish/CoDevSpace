import prismaClient from "../src";
import { LANGUAGE_MAPPING } from "../../common/language";
import { addProblemsInDB } from "./updateQuestion";

(async () => {
  try {
    await prismaClient.language.createMany({
      data: Object.keys(LANGUAGE_MAPPING).map((language) => ({
        id: LANGUAGE_MAPPING[language].internal,
        name: language,
        judge0Id: LANGUAGE_MAPPING[language].judge0,
      })),
    })
  } catch (e) {
    console.log("Languages already persist in the DB!");

  }
})();
try {
  addProblemsInDB();
}
catch (e) {
  console.log("Data already persist in the DB!")
}
