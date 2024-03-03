import dotenv from 'dotenv';
import axios from 'axios';
import { saveJson } from '../utils/saveFile.js';
import fs from 'fs'
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

export async function getFixtures(report) {
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

export async function getPrediction(fixtureId, report) {
  // const response = await axios.request(options('GET', 'https://api-football-v1.p.rapidapi.com/v3/predictions', {
  //   fixture: 'fixtureId'
  // }));
  //Usando a função para salvar os dados para criação do mock, retirar quando o MVP estiver pronto
  // const jsonData = JSON.stringify(response.data);
  // saveJson('Fixture_prediction', jsonData)
  const response = JSON.parse(fs.readFileSync('C:\\Users\\diogo\\fute-tips\\mocks\\Fixture_Prediction.json'));
  report.addFixturePrediction(response)
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

