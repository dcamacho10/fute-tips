import { Report } from './apis/excel.js';
import { getAllFixturesFromCurrentSeason, getCurrentFixtures, getPrediction, matchesAnalysis } from './apis/footballOrg.js';
// import { waitForTwoMinutes } from './utils/date.js';
// import { sendMail } from "./apis/email.js";

async function main() {
  console.log('comecou')
  // await testApi()
  const report = new Report()
  const fixtureHistory = await getAllFixturesFromCurrentSeason()
  const { response: currentFixtures } = await getCurrentFixtures(report);
  const predictionPromises = currentFixtures.map(item => getPrediction(item, report));
  await Promise.all(predictionPromises);
  // pausa para esperar o limite de requisições por min da conta freemium
  // await waitForTwoMinutes()
  await matchesAnalysis(currentFixtures, fixtureHistory, report)

  // await sendMail(currentFixtures[0].league.name)

  report.saveWorkbook(currentFixtures[0].league)


}

main()