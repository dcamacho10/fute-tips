import ExcelJS from 'exceljs';
import { formattedDate } from '../utils/date.js';
import { findObjectByAttribute, findValueByType, removeDuplicateObjects } from '../utils/objectHandler.js';
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
    const worksheet = this.createOrUpdateWorksheet(home, away)
    const rowPrediction = worksheet.addRow(["Predictions"])
    this.fillCellsWithColor(rowPrediction, '8cad93')
    const rowPredictionHeader = worksheet.addRow(["Winner", "Advice", "Home goals", "Away goals"])
    this.fillCellsWithColor(rowPredictionHeader, 'FFC0C0C0')
    worksheet.addRow([winner.name, advice, goals.home, goals.away])
    worksheet.addRow([])
    const rowResultPrediction = worksheet.addRow(["Result prediction in percent"])
    this.fillCellsWithColor(rowResultPrediction, '8cad93')
    const rowResultPredictionHeader = worksheet.addRow(["Home", "Draw", "Away"])
    this.fillCellsWithColor(rowResultPredictionHeader, 'FFC0C0C0')
    worksheet.addRow([percent.home, percent.draw, percent.away])
    worksheet.addRow([])
    const rowLastFiveGames = worksheet.addRow(["Teams recent form - last 5 games"])
    this.fillCellsWithColor(rowLastFiveGames, '8cad93')
    const rowLastFiveGamesHeader = worksheet.addRow(["Team", "Form", "Attack form", "Defense form", "Total Goals for", "Average Goals for", "Total Goals Against", "Average Goals Against"])
    this.fillCellsWithColor(rowLastFiveGamesHeader, 'FFC0C0C0')
    worksheet.addRow([home.name, home.last_5.form, home.last_5.att, home.last_5.def, home.last_5.goals.for.total, home.last_5.goals.for.average, home.last_5.goals.against.total, home.last_5.goals.against.average])
    worksheet.addRow([away.name, away.last_5.form, away.last_5.att, away.last_5.def, away.last_5.goals.for.total, away.last_5.goals.for.average, away.last_5.goals.against.total, away.last_5.goals.against.average])
    worksheet.addRow([])
    worksheet.addRow([])
  }

  addFixtureTeamsStatistics(home, away) {
    const { homeTeam, homeStatistics } = home
    const { awayTeam, awayStatistics } = away
    const homePlayers = []
    const awayPlayers = []
    const worksheet = this.createOrUpdateWorksheet(homeTeam, awayTeam)
    const rowTeamStats = worksheet.addRow(["Teams statistics"])
    this.fillCellsWithColor(rowTeamStats, '3492eb')
    worksheet.addRow([])
    const rowHomeTeam = worksheet.addRow(["Somente jogos em casa"])
    this.fillCellsWithColor(rowHomeTeam, '85f28d')
    const rowHomeTeamHeader = worksheet.addRow([`Home team: ${homeTeam.name}`, "gols marcados", "gols concedidos", "soma dos gols", "chutes no alvo", "total de chutes", "chutes no alvo sofridos", "total de chute sofridos", "faltas cometidas", "faltas sofridas", "total de faltas", "escanteios ganhos", "escanteios cedidos", "total de escanteios", "cartões amarelos tomados", "cartões amarelos do adversário", "totais de cartões amarelos", "defesas do goleiro"
    ])
    this.fillCellsWithColor(rowHomeTeamHeader, 'FFC0C0C0')
    const fixturesAtHome = homeStatistics.filter(item => item.teams.home.id === homeTeam.id)
    fixturesAtHome.forEach(item => {
      const homeFixtureStatistics = item.statistics[0].statistics
      const awayFixtureStatistics = item.statistics[1].statistics
      const homeFixturePlayersStatistics = item.players[0]?.players
      homeFixturePlayersStatistics && homeFixturePlayersStatistics.forEach((item) => {
        homePlayers.push({ id: item.player.id, name: item.player.name })
      })
      worksheet.addRow([`VS ${item.teams.away.name}`, item.goals.home, item.goals.away, item.goals.home + item.goals.away, findValueByType(homeFixtureStatistics, "Shots on Goal"), findValueByType(homeFixtureStatistics, "Total Shots"), findValueByType(awayFixtureStatistics, "Shots on Goal"), findValueByType(awayFixtureStatistics, "Total Shots"), findValueByType(homeFixtureStatistics, "Fouls"), findValueByType(awayFixtureStatistics, "Fouls"), findValueByType(homeFixtureStatistics, "Fouls") + findValueByType(awayFixtureStatistics, "Fouls"), findValueByType(homeFixtureStatistics, "Corner Kicks"), findValueByType(awayFixtureStatistics, "Corner Kicks"), findValueByType(homeFixtureStatistics, "Corner Kicks") + findValueByType(awayFixtureStatistics, "Corner Kicks"), findValueByType(homeFixtureStatistics, "Yellow Cards"), findValueByType(awayFixtureStatistics, "Yellow Cards"), findValueByType(homeFixtureStatistics, "Yellow Cards") + findValueByType(awayFixtureStatistics, "Yellow Cards"), findValueByType(homeFixtureStatistics, "Goalkeeper Saves")])
    });
    worksheet.addRow([])
    const rowAwayTeam = worksheet.addRow(["Somente jogos fora"])
    this.fillCellsWithColor(rowAwayTeam, 'f7a13e')
    const rowAwayTeamHeader = worksheet.addRow([`Away team: ${awayTeam.name}`, "gols marcados", "gols concedidos", "soma dos gols", "chutes no alvo", "total de chutes", "chutes no alvo sofridos", "total de chute sofridos", "faltas cometidas", "faltas sofridas", "total de faltas", "escanteios ganhos", "escanteios cedidos", "total de escanteios", "cartões amarelos tomados", "cartões amarelos do adversário", "totais de cartões amarelos", "defesas do goleiro"])
    this.fillCellsWithColor(rowAwayTeamHeader, 'FFC0C0C0')
    const fixturesAtAway = awayStatistics.filter(item => item.teams.away.id === awayTeam.id)
    fixturesAtAway.forEach(item => {
      const homeFixtureStatistics = item.statistics[0].statistics
      const awayFixtureStatistics = item.statistics[1].statistics
      const awayFixturePlayersStatistics = item.players[1]?.players
      awayFixturePlayersStatistics && awayFixturePlayersStatistics.forEach((item) => {
        awayPlayers.push({ id: item.player.id, name: item.player.name })
      })
      worksheet.addRow([`VS ${item.teams.home.name}`, item.goals.away, item.goals.home, item.goals.away + item.goals.home, findValueByType(awayFixtureStatistics, "Shots on Goal"), findValueByType(awayFixtureStatistics, "Total Shots"), findValueByType(homeFixtureStatistics, "Shots on Goal"), findValueByType(homeFixtureStatistics, "Total Shots"), findValueByType(awayFixtureStatistics, "Fouls"), findValueByType(homeFixtureStatistics, "Fouls"), findValueByType(awayFixtureStatistics, "Fouls") + findValueByType(homeFixtureStatistics, "Fouls"), findValueByType(awayFixtureStatistics, "Corner Kicks"), findValueByType(homeFixtureStatistics, "Corner Kicks"), findValueByType(awayFixtureStatistics, "Corner Kicks") + findValueByType(homeFixtureStatistics, "Corner Kicks"), findValueByType(awayFixtureStatistics, "Yellow Cards"), findValueByType(homeFixtureStatistics, "Yellow Cards"), findValueByType(awayFixtureStatistics, "Yellow Cards") + findValueByType(homeFixtureStatistics, "Yellow Cards"), findValueByType(awayFixtureStatistics, "Goalkeeper Saves")])
    });

    worksheet.addRow([])
    const row = worksheet.addRow(["Estatísticas dos jogadores"])
    this.fillCellsWithColor(row, 'FF808080')
    worksheet.addRow([])
    const row2 = worksheet.addRow(["Time da casa - Para jogos em casa"])
    this.fillCellsWithColor(row2, '85f28d')
    const homePlayersWithoutDup = removeDuplicateObjects(homePlayers)
    homePlayersWithoutDup.forEach((player) => {
      const row = worksheet.addRow([player.name, "Minutos jogados", "Nota", "Chutes no alvo", "Chutes totais", "Gols", "Assistência", "Gols cedidos (Goleiro)", "Desarmes", "Faltas cometidas", "Faltas recebidas", "Cartão amarelo", "Cartão vermelho"])
      this.fillCellsWithColor(row, 'FFC0C0C0')
      fixturesAtHome.forEach((item) => {
        let homeFixturePlayerStatistics
        item.players[0]?.players ?
          homeFixturePlayerStatistics = this.getPlayerById(item.players[0].players, player.id) : null
        if (homeFixturePlayerStatistics && Object.keys(homeFixturePlayerStatistics).length > 0) {
          worksheet.addRow([`VS ${item.teams.away.name}`, homeFixturePlayerStatistics.games.minutes, homeFixturePlayerStatistics.games.rating, homeFixturePlayerStatistics.shots.on, homeFixturePlayerStatistics.shots.total, homeFixturePlayerStatistics.goals.total, homeFixturePlayerStatistics.goals.assists, homeFixturePlayerStatistics.goals.conceded, homeFixturePlayerStatistics.tackles.total, homeFixturePlayerStatistics.fouls.committed, homeFixturePlayerStatistics.fouls.drawn, homeFixturePlayerStatistics.cards.yellow, homeFixturePlayerStatistics.cards.red])

        }
      })
      worksheet.addRow([])
    })

    worksheet.addRow([])
    worksheet.addRow([])
    worksheet.addRow([])
    const row3 = worksheet.addRow(["Time visitante - Para jogos fora"])
    this.fillCellsWithColor(row3, 'f7a13e')
    const awayPlayersWithoutDup = removeDuplicateObjects(awayPlayers)
    awayPlayersWithoutDup.forEach((player) => {
      const row = worksheet.addRow([player.name, "Minutos jogados", "Nota", "Chutes no alvo", "Chutes totais", "Gols", "Assistência", "Gols cedidos (Goleiro)", "Desarmes", "Faltas cometidas", "Faltas recebidas", "Cartão amarelo", "Cartão vermelho"])
      this.fillCellsWithColor(row, 'FFC0C0C0')
      fixturesAtAway.forEach((item) => {
        let awayFixturePlayerStatistics
        item.players[1]?.players ?
          awayFixturePlayerStatistics = this.getPlayerById(item.players[1].players, player.id) : null
        if (awayFixturePlayerStatistics && Object.keys(awayFixturePlayerStatistics).length > 0) {
          worksheet.addRow([`VS ${item.teams.home.name}`, awayFixturePlayerStatistics.games.minutes, awayFixturePlayerStatistics.games.rating, awayFixturePlayerStatistics.shots.on, awayFixturePlayerStatistics.shots.total, awayFixturePlayerStatistics.goals.total, awayFixturePlayerStatistics.goals.assists, awayFixturePlayerStatistics.goals.conceded, awayFixturePlayerStatistics.tackles.total, awayFixturePlayerStatistics.fouls.committed, awayFixturePlayerStatistics.fouls.drawn, awayFixturePlayerStatistics.cards.yellow, awayFixturePlayerStatistics.cards.red])

        }
      })
      worksheet.addRow([])
    })


    this.improveSheetVisualization(worksheet)
  }

  fillCellsWithColor(row, rgbColor) {
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rgbColor } // Gray color
      };
    });
  }

  getPlayerById(playersArray, id) {
    for (let playerData of playersArray) {
      if (playerData.player.id === id) {
        if (playerData.statistics[0].games.minutes > 0)
          return playerData.statistics[0];
      }
    }
    // If player with the given ID is not found
    return null;
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

  createOrUpdateWorksheet(home, away) {
    let sheetName = `${home.name} x ${away.name}`;
    if (sheetName.length > 31) {
      sheetName = sheetName.substring(0, 31); // Keep only the first 31 characters
    }
    let worksheet = this.workbook.getWorksheet(sheetName);
    if (worksheet === undefined) {
      worksheet = this.workbook.addWorksheet(sheetName);
    }
    return worksheet;
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



  saveWorkbook(league) {

    console.log(formattedDate)
    const fileName = `${league.name}-${league.country}-${formattedDate()}.xlsx`;

    this.workbook.xlsx.writeFile(fileName)
      .then(() => {
        console.log('Workbook created successfully!');
      })
      .catch(error => {
        console.log('Error creating workbook: ', error);
      });
  }

}

