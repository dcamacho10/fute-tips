import fs from 'fs'

export const saveJson = (nameFile, jsonData) => {
  // Write JSON data to a file
  fs.writeFile(`${nameFile}.json`, jsonData, 'utf8', err => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON file has been saved!');
    }
  });
}