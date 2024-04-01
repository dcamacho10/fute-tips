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



export function abbreviateName(fullName) {
  if (!fullName) {
    return ' '
  }
  const nameWithoutCountry = fullName.split(',')
  const parts = nameWithoutCountry[0].split(' ');
  if (parts.length === 1) {
    return fullName; // Return full name if it's just one word
  } else {
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const abbreviatedFirstName = firstName.charAt(0) + '.';
    return abbreviatedFirstName + ' ' + lastName;
  }
}