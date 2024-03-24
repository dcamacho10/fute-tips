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
    const fixtures = fixturesData.response
    fixtures.forEach(item => {
      worksheet.addRow([item.fixture.date, item.teams.home.name, item.teams.away.name, item.fixture.referee, item.fixture.venue.name, item.fixture.status.long]);
    });
  }

  addFixturePrediction(predictionData) {
    const { predictions, teams } = predictionData.response[0]
    const { winner, advice, goals, percent } = predictions
    const { home, away } = teams
    const worksheet = this.workbook.addWorksheet(`${home.name} x ${away.name}`);
    worksheet.addRow(["Predictions"])
    worksheet.addRow([])
    worksheet.addRow(["Winner", "Advice", "Home goals", "Away goals"])
    worksheet.addRow([winner.name, advice, goals.home, goals.away])
    worksheet.addRow([])
    worksheet.addRow(["Result prediction in percent"])
    worksheet.addRow(["Home", "Draw", "Away"])
    worksheet.addRow([percent.home, percent.draw, percent.away])
    worksheet.addRow([])
    worksheet.addRow(["Teams recent form - last 5 games"])
    worksheet.addRow(["Team", "Form", "Attack form", "Defense form", "Total Goals for", "Average Goals for", "Total Goals Against", "Average Goals Against"])
    worksheet.addRow([home.name, home.last_5.form, home.last_5.att, home.last_5.def, home.last_5.goals.for.total, home.last_5.goals.for.average, home.last_5.goals.against.total, home.last_5.goals.against.average])
    worksheet.addRow([away.name, away.last_5.form, away.last_5.att, away.last_5.def, away.last_5.goals.for.total, away.last_5.goals.for.average, away.last_5.goals.against.total, away.last_5.goals.against.average])
  }

  addFixtureTeamsStatistics(home, away) {
    console.log(home, away)
    const { homeTeam, homeStatistics } = home
    const { awayTeam, awayStatistics } = away
    let worksheet = this.workbook.getWorksheet(`${homeTeam.name} x ${awayTeam.name}`);
    if (worksheet === undefined) {
      worksheet = this.workbook.addWorksheet(`${homeTeam.name} x ${awayTeam.name}`)
    }
    worksheet.addRow(["Teams statistics"])
    worksheet.addRow([])
    worksheet.addRow(["Somente jogos em casa"])
    worksheet.addRow([`Home team: ${homeTeam.name}`, "gols marcados", "gols concedidos"])
    const fixturesAtHome = homeStatistics.filter(item => item.teams.home.id === homeTeam.id)
    fixturesAtHome.forEach(item => {
      worksheet.addRow([`VS ${item.teams.away.name}`, item.goals.home, item.goals.away])
    });
    worksheet.addRow([])
    worksheet.addRow(["Somente jogos fora"])
    worksheet.addRow([`Away team: ${awayTeam.name}`, "gols marcados", "gols concedidos"])
    const fixturesAtAway = awayStatistics.filter(item => item.teams.away.id === awayTeam.id)
    fixturesAtAway.forEach(item => {
      worksheet.addRow([`VS ${item.teams.home.name}`, item.goals.away, item.goals.home])
    });
  }

  saveWorkbook() {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    console.log(formattedDate)
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

