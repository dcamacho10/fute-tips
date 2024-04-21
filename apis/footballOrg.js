import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { findValueByType } from '../utils/objectHandler.js';
import { saveJson } from '../utils/saveFile.js';
import { abbreviateName } from '../utils/textHandler.js';
dotenv.config()

// Counter variable to store the count of requests
let requestCount = 0;

// Axios interceptor to intercept requests
axios.interceptors.request.use(function (config) {
  // Increment the request count
  requestCount++;
  if (requestCount >= 29) {
    setTimeout(() => { console.log('30 request achieved, waiting 2 min') }, 2000)
    requestCount = 0
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

const options = (method, url, params) => {
  return {
    method,
    url,
    params: params || ' ',
    headers: {
      'X-RapidAPI-Key': process.env.KEY,
      'X-RapidAPI-Host': process.env.HOST
    }
  };
}

async function getCurrentRound() {
  try {
    const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/fixtures/rounds', {
      league: process.env.LEAGUE,
      season: process.env.SEASON,
      current: 'true'
    }));
    //Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
    // const jsonData = JSON.stringify(response.data);
    // saveJson('Fixture_Current_Round', jsonData)
    return response.data.response[0]
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentFixtures(report) {
  try {
    const currentRound = await getCurrentRound()
    const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      league: process.env.LEAGUE,
      season: process.env.SEASON,
      round: currentRound
    }));
    report.addCurrentFixture(response.data)
    return response.data;
    //Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
    // const jsonData = JSON.stringify(response.data);
    // saveJson('Fixtures_Current', jsonData)

    // const data = JSON.parse(fs.readFileSync('C:\\Users\\diogo\\fute-tips\\mocks\\Fixtures_Current.json'));
    // console.log(JSON.stringify(data.response, null, 2)); // Display response data
    // report.addCurrentFixture(data)
    // return data;

  } catch (error) {
    console.error(error);
  }
}


export async function getAllFixturesFromCurrentSeason() {

  try {
    const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      league: process.env.LEAGUE,
      season: process.env.SEASON,
    }
    ));

    return response.data.response
    // const data = JSON.parse(fs.readFileSync(`C:\\Users\\diogo\\fute-tips\\mocks\\All_Fixtures.json`));

    // return data.response



  } catch (error) {
    console.error(error);
  }
}

//função responsável por pegar as estatísticas de multiplos jogos por id
export async function getAllStatisticByFixtureId(team, teamAllFixtureIds) {
  try {

    const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      ids: teamAllFixtureIds
    }));
    return response.data.response
    // const data = JSON.parse(fs.readFileSync(`C:\\Users\\diogo\\fute-tips\\mocks\\${team.name}.json`));
    // return data.response
  } catch (error) {
    console.error(error);
  }
}

export function getTeamHistoryStatistics(allFixtures, teamId) {
  console.log(JSON.stringify(allFixtures))
  //const teamHistoryFixture = allFixtures.map
}

export async function matchesAnalysis(currentFixtures, allFixtures, report) {
  const currentDate = new Date();
  const refereeStats = {};
  for (const item of currentFixtures) {

    const homeTeam = item.teams.home;
    const awayTeam = item.teams.away;
    const homeFixtureIds = allFixtures.filter(item => {
      const pastFixture = new Date(item.fixture.date)
      return item.teams.home.id === homeTeam.id && pastFixture < currentDate
    }
    ).map(item => item.fixture.id).join('-')
    const awayFixtureIds = allFixtures.filter(item => {
      const pastFixture = new Date(item.fixture.date)
      return item.teams.away.id === awayTeam.id && pastFixture < currentDate
    }).map(item => item.fixture.id).join('-')
    //console.log(homeTeam.name, homeFixtureIds)
    //console.log(awayTeam.name, awayFixtureIds)
    const homeStatistics = await getAllStatisticByFixtureId(homeTeam, homeFixtureIds)
    const awayStatistics = await getAllStatisticByFixtureId(awayTeam, awayFixtureIds)
    const allStatistics = [...homeStatistics, ...awayStatistics]


    // Loop through fixtures to calculate total cards and matches for each referee
    allStatistics.forEach(item => {
      const { id, referee } = item.fixture;
      const stats = item.statistics
      if (!refereeStats[referee]) {
        refereeStats[referee] = { totalYellowCards: 0, totalRedCards: 0, totalMatches: new Set() };
      }
      stats.forEach(item => {
        refereeStats[referee].totalYellowCards += findValueByType(item.statistics, "Yellow Cards") || 0
        refereeStats[referee].totalRedCards += findValueByType(item.statistics, "Red Cards") || 0
      });
      refereeStats[referee].totalMatches.add(id);
    });


    report.addFixtureTeamsStatistics({ homeTeam, homeStatistics }, { awayTeam, awayStatistics })
  }

  const refereesAverageCards = Object.keys(refereeStats).map(referee => {
    const { totalYellowCards, totalRedCards, totalMatches } = refereeStats[referee];
    const matchesCount = totalMatches.size
    const averageCards = (totalYellowCards + totalRedCards) / matchesCount;
    const averageRedCards = totalRedCards / matchesCount;
    const abbreviateNameReferee = abbreviateName(referee)
    return { referee: abbreviateNameReferee, totalYellowCards, totalRedCards, averageCards, averageRedCards, matchesCount };
  });

  report.addRefereesStats(refereesAverageCards)

}


export async function testApi() {
  try {
    const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/leagues'));
    console.log('response', response)
    // Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
    const jsonData = JSON.stringify(response.data);
    saveJson('All_Leagues', jsonData)
    console.log(response.data)

  } catch (error) {
    console.error('falha ao executar teste', error);
  }
}


// export async function fixturesTeamsStatistics(currentFixtures, report) {
//   //  console.log(currentFixtures)
//   currentFixtures.forEach((fixture) => {
//     const homeTeam = getTeamStatistics({
//       league: { id: fixture.league.id }, id: fixture.teams.home.id
//     })
//     const awayTeam = getTeamStatistics({
//       league: { id: fixture.league.id }, id: fixture.teams.away.id
//     })
//     report.addFixtureTeamsStatistics(homeTeam, awayTeam)
//   })
// }

// async function getTeamStatistics(teamData) {
//   try {
//     // const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics', {
//     //   league: teamData.league.id,
//     //   season: currentPremierLeagueSeason(),
//     //   team: teamData.id
//     // }));
//     // Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
//     // const jsonData = JSON.stringify(response.data);
//     // saveJson(`Team_Statistics_${teamData.id}`, jsonData)
//     // return response.data
//     const response = JSON.parse(fs.readFileSync(`C:\\Users\\diogo\\fute-tips\\mocks\\Team_Statistics_${teamData.id}.json`));
//     return response
//   } catch (error) {
//     console.error(error);
//   }
// }


export async function getPrediction(fixtureId, report) {
  // const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/predictions', {
  //   fixture: fixtureId
  // }));
  //Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
  // const jsonData = JSON.stringify(response.data);
  // saveJson('Fixture_prediction', jsonData)
  const response = JSON.parse(fs.readFileSync('C:\\Users\\diogo\\fute-tips\\mocks\\Fixture_Prediction.json'));
  report.addFixturePrediction(response.data)
}
