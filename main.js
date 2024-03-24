import { Report } from "./apis/excel.js";
import { getAllFixturesFromCurrentSeason, getCurrentFixtures, matchesAnalysis } from "./apis/footballOrg.js";

async function main() {
  console.log('comecou')
  const report = new Report()
  const { response: currentFixtures } = await getCurrentFixtures(report);
  //const predictionPromises = currentFixtures.map(item => getPrediction(item.fixture.id, report));
  //await Promise.all(predictionPromises);
  //getPrediction('dummieid', report)
  //fixturesTeamsStatistics(currentFixtures)
  const fixtureHistory = await getAllFixturesFromCurrentSeason()
  await matchesAnalysis(currentFixtures, fixtureHistory, report)

  report.saveWorkbook()

}

main()