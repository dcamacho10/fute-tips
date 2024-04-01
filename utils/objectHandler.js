export function findValueByType(array, targetType) {
  for (let obj of array) {
    if (obj.type === targetType) {
      return obj.value; // Return the value if type matches
    }
  }
  return null; // Return null if the object is not found
}


export function findObjectByAttribute(array, attributeName, attributeValue) {
  return array.find(obj => obj[attributeName] === attributeValue);
}