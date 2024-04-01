import ExcelJS from 'exceljs';
import { findObjectByAttribute, findValueByType } from '../utils/objectHandler.js';
import { abbreviateName } from '../utils/textHandler.js';

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
    worksheet.addRow(["Date", "Home", "Away", "Referee", "Venue", "Md cartões", "Md vermelhos", "qt partidas"]);
    const fixtures = fixturesData.response
    fixtures.forEach(item => {
      worksheet.addRow([item.fixture.date, item.teams.home.name, item.teams.away.name, abbreviateName(item.fixture.referee), item.fixture.venue.name]);
    });
  }

  addFixturePrediction(predictionData) {
    const { predictions, teams } = predictionData.response[0]
    const { winner, advice, goals, percent } = predictions
    const { home, away } = teams
    let sheetName = `${home.name} x ${away.name}`
    if (sheetName.length > 31) {
      sheetName = sheetName.substring(0, 31); // Keep only the first 31 characters
    }
    const worksheet = this.workbook.addWorksheet(sheetName);
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
    const { homeTeam, homeStatistics } = home
    const { awayTeam, awayStatistics } = away
    // let sheetName = `${home.name} x ${away.name}`
    // if (sheetName.length > 31) {
    //   sheetName = sheetName.substring(0, 31); // Keep only the first 31 characters
    // }
    let worksheet = this.workbook.getWorksheet(`${homeTeam.name} x ${awayTeam.name}`);
    if (worksheet === undefined) {
      worksheet = this.workbook.addWorksheet(`${homeTeam.name} x ${awayTeam.name}`)
    }
    worksheet.addRow(["Teams statistics"])
    worksheet.addRow([])
    worksheet.addRow(["Somente jogos em casa"])
    worksheet.addRow([`Home team: ${homeTeam.name}`, "gols marcados", "gols concedidos", "soma dos gols", "chutes no alvo", "total de chutes", "chutes no alvo sofridos", "total de chute sofridos", "faltas cometidas", "faltas sofridas", "total de faltas", "escanteios ganhos", "escanteios cedidos", "total de escanteios", "cartões amarelos tomados", "cartões amarelos do adversário", "totais de cartões amarelos", "defesas do goleiro"
    ])
    const fixturesAtHome = homeStatistics.filter(item => item.teams.home.id === homeTeam.id)
    fixturesAtHome.forEach(item => {
      const homeFixtureStatistics = item.statistics[0].statistics
      const awayFixtureStatistics = item.statistics[1].statistics
      worksheet.addRow([`VS ${item.teams.away.name}`, item.goals.home, item.goals.away, item.goals.home + item.goals.away, findValueByType(homeFixtureStatistics, "Shots on Goal"), findValueByType(homeFixtureStatistics, "Total Shots"), findValueByType(awayFixtureStatistics, "Shots on Goal"), findValueByType(awayFixtureStatistics, "Total Shots"), findValueByType(homeFixtureStatistics, "Fouls"), findValueByType(awayFixtureStatistics, "Fouls"), findValueByType(homeFixtureStatistics, "Fouls") + findValueByType(awayFixtureStatistics, "Fouls"), findValueByType(homeFixtureStatistics, "Corner Kicks"), findValueByType(awayFixtureStatistics, "Corner Kicks"), findValueByType(homeFixtureStatistics, "Corner Kicks") + findValueByType(awayFixtureStatistics, "Corner Kicks"), findValueByType(homeFixtureStatistics, "Yellow Cards"), findValueByType(awayFixtureStatistics, "Yellow Cards"), findValueByType(homeFixtureStatistics, "Yellow Cards") + findValueByType(awayFixtureStatistics, "Yellow Cards"), findValueByType(homeFixtureStatistics, "Goalkeeper Saves")])
    });
    worksheet.addRow([])
    worksheet.addRow(["Somente jogos fora"])
    worksheet.addRow([`Away team: ${awayTeam.name}`, "gols marcados", "gols concedidos", "soma dos gols", "chutes no alvo", "total de chutes", "chutes no alvo sofridos", "total de chute sofridos", "faltas cometidas", "faltas sofridas", "total de faltas", "escanteios ganhos", "escanteios cedidos", "total de escanteios", "cartões amarelos tomados", "cartões amarelos do adversário", "totais de cartões amarelos", "defesas do goleiro"])
    const fixturesAtAway = awayStatistics.filter(item => item.teams.away.id === awayTeam.id)
    fixturesAtAway.forEach(item => {
      const homeFixtureStatistics = item.statistics[0].statistics
      const awayFixtureStatistics = item.statistics[1].statistics
      worksheet.addRow([`VS ${item.teams.home.name}`, item.goals.away, item.goals.home, item.goals.away + item.goals.home, findValueByType(awayFixtureStatistics, "Shots on Goal"), findValueByType(awayFixtureStatistics, "Total Shots"), findValueByType(homeFixtureStatistics, "Shots on Goal"), findValueByType(homeFixtureStatistics, "Total Shots"), findValueByType(awayFixtureStatistics, "Fouls"), findValueByType(homeFixtureStatistics, "Fouls"), findValueByType(awayFixtureStatistics, "Fouls") + findValueByType(homeFixtureStatistics, "Fouls"), findValueByType(awayFixtureStatistics, "Corner Kicks"), findValueByType(homeFixtureStatistics, "Corner Kicks"), findValueByType(awayFixtureStatistics, "Corner Kicks") + findValueByType(homeFixtureStatistics, "Corner Kicks"), findValueByType(awayFixtureStatistics, "Yellow Cards"), findValueByType(homeFixtureStatistics, "Yellow Cards"), findValueByType(awayFixtureStatistics, "Yellow Cards") + findValueByType(homeFixtureStatistics, "Yellow Cards"), findValueByType(awayFixtureStatistics, "Goalkeeper Saves")])
    });

    this.improveSheetVisualization(worksheet)
  }

  addRefereesStats(allRefereeStats) {
    let worksheet = this.workbook.getWorksheet(1);

    worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
      const referee = row.getCell(4).value; // Assuming the referee names are in the fourth column
      const stats = findObjectByAttribute(allRefereeStats, 'referee', referee);
      if (stats) {
        const { averageCards, averageRedCards, matchesCount } = stats;
        row.getCell(6).value = averageCards.toFixed(2);
        row.getCell(7).value = averageRedCards.toFixed(2);
        row.getCell(8).value = matchesCount
      }
    });

    this.improveSheetVisualization(worksheet)

  }

  improveSheetVisualization(worksheet) {
    // Auto-fit column width based on content
    worksheet.columns.forEach(column => {
      let maxLength = column.header ? column.header.length : 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 12 ? 12 : maxLength;
    });
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 1, // Number of columns to freeze
        ySplit: 0,
        topLeftCell: 'B2' // Cell reference for the top left cell of the bottom right pane
      }
    ];
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

