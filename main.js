import { Report } from "./apis/excel.js"
import { getFixtures, getPrediction } from "./apis/footballOrg.js"

async function main() {
  console.log('comecou')
  const report = new Report()
  const { response: currentFixtures } = await getFixtures(report);
  //const predictionPromises = currentFixtures.map(item => getPrediction(item.fixture.id, report));
  //await Promise.all(predictionPromises);
  getPrediction('dummieid', report)

  report.saveWorkbook()

}

main()