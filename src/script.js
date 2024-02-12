


function fetchGames() {
  race.fetchGames().then(games => {
    runtime.globalVars.games = games
  })
}
