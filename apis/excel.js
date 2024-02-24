import ExcelJS from 'exceljs';

export class Report {

  constructor() {
    this.workbook = new ExcelJS.Workbook();

    if (!Report.instance) {
      Report.instance = this;
    }
    return Report.instance;
  }

  // Method to add tab rodada-atual
  addCurrentFixture(fixturesData) {
    const worksheet = this.workbook.addWorksheet('rodada-atual');
    //Header: TODO estudar como fazer um Header no excel pela lib
    worksheet.addRow(["Date", "Home", "Away", "Referee", "Venue", "Status"]);
    console.log(fixturesData)

    const fixtures = fixturesData.response
    fixtures.forEach(item => {
      worksheet.addRow([item.fixture.date, item.teams.home.name, item.teams.away.name, item.fixture.referee, item.fixture.venue.name, item.fixture.status.long]);
    });
  }

  saveWorkbook() {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const fileName = `fixtures-${formattedDate}.xlsx`;

    this.workbook.xlsx.writeFile(fileName)
      .then(() => {
        console.log('Workbook created successfully!');
      })
      .catch(error => {
        console.log('Error creating workbook: ', error);
      });
  }

}

