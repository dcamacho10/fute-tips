import { Report } from "./apis/excel.js"
import { getFixtures } from "./apis/footballOrg.js"

async function main() {
  console.log('comecou')
  const report = new Report()
  await getFixtures(report)
  report.saveWorkbook()
}

main()