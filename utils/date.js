export function currentPremierLeagueSeason() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index

  // Premier League seasons typically start in August and end in May of the following year
  const currentSeason = currentMonth < 8 ? currentYear - 1 : currentYear;
  return currentSeason;
}

export function formattedDate() {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  return formattedDate
}


export async function waitForTwoMinutes() {
  // Set the timeout for 2 minutes (120,000 milliseconds)
  const delayInMilliseconds = 2 * 60 * 1000; // 2 minutes * 60 seconds/minute * 1000 milliseconds/second

  await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));

  // This code will execute after 2 minutes
  console.log("2 minutes have passed!");
}