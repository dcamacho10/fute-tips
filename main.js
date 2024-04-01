import { Report } from "./apis/excel.js";
import { getAllFixturesFromCurrentSeason, getCurrentFixtures, matchesAnalysis } from "./apis/footballOrg.js";

async function main() {
  console.log('comecou')
  //await testApi()
  const report = new Report()
  const fixtureHistory = await getAllFixturesFromCurrentSeason()
  const { response: currentFixtures } = await getCurrentFixtures(report);
  // const predictionPromises = currentFixtures.map(item => getPrediction(item.fixture.id, report));
  // await Promise.all(predictionPromises);
  //getPrediction('dummieid', report)
  //fixturesTeamsStatistics(currentFixtures)

  await matchesAnalysis(currentFixtures, fixtureHistory, report)

  report.saveWorkbook()

}

main()