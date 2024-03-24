import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { saveJson } from '../utils/saveFile.js';
dotenv.config()

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
      league: '39',
      season: '2023',
      current: 'true'
    }));
    //Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
    const jsonData = JSON.stringify(response.data);
    saveJson('Fixture_Current_Round', jsonData)
    return response.data.response[0]
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentFixtures(report) {
  try {
    // const currentRound = await getCurrentRound()
    // const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/fixtures', {
    //   league: '39',
    //   season: '2023',
    //   round: currentRound
    // }));
    //Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
    // const jsonData = JSON.stringify(response.data);
    // saveJson('Fixtures_Current', jsonData)

    const response = JSON.parse(fs.readFileSync('C:\\Users\\diogo\\fute-tips\\mocks\\Fixtures_Current.json'));
    report.addCurrentFixture(response)
    return response;
    // console.log(JSON.stringify(response.data, null, 2)); // Display response data
  } catch (error) {
    console.error(error);
  }
}


export async function getAllFixturesFromCurrentSeason() {

  try {
    // const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/fixtures', {
    //   league: '39',
    //   season: '2023'
    // }
    // ));

    const data = JSON.parse(fs.readFileSync(`C:\\Users\\diogo\\fute-tips\\mocks\\All_Fixtures.json`));
    return data.response



  } catch (error) {
    console.error(error);
  }
}

//função responsável por pegar as estatísticas de multiplos jogos por id
export async function getAllStatisticByFixtureId(team, teamAllFixtureIds) {
  try {

    // const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/fixtures', {
    //   ids: teamAllFixtureIds
    // }));

    const data = JSON.parse(fs.readFileSync(`C:\\Users\\diogo\\fute-tips\\mocks\\${team.name}.json`));
    return data.response
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
    report.addFixtureTeamsStatistics({ homeTeam, homeStatistics }, { awayTeam, awayStatistics })
  }


}


export async function testApi() {
  try {
    const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/fixtures/rounds', {
      league: '39',
      season: '2023',
      current: 'true'
    }));
    console.log(response.data)
  } catch (error) {
    console.error(error);
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


// export async function getPrediction(fixtureId, report) {
//   // const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/predictions', {
//   //   fixture: 'fixtureId'
//   // }));
//   //Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
//   // const jsonData = JSON.stringify(response.data);
//   // saveJson('Fixture_prediction', jsonData)
//   const response = JSON.parse(fs.readFileSync('C:\\Users\\diogo\\fute-tips\\mocks\\Fixture_Prediction.json'));
//   report.addFixturePrediction(response)
// }
