export function extractNumberFromPhrase(phrase) {
  const match = phrase.match(/\d+/);

  if (match) {
    const number = parseInt(match[0]);
    console.log('Number:', number);
    return number
  } else {
    console.log('No number found in the phrase.');
  }
}