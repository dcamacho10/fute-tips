export function currentPremierLeagueSeason() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index

  // Premier League seasons typically start in August and end in May of the following year
  const currentSeason = currentMonth < 8 ? currentYear - 1 : currentYear;
  return currentSeason;
}