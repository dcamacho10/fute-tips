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


export function removeDuplicateObjects(arr) {
  // Use a Set to store unique string representations of objects
  let seen = new Set();
  // Filter the array to keep only unique objects
  return arr.filter(obj => {
    let str = JSON.stringify(obj);
    if (!seen.has(str)) {
      seen.add(str);
      return true;
    }
    return false;
  });
}