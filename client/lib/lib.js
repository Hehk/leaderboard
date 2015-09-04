// leaderboardUtils singleton: contains functions necessary for the leaderboards core functions
leaderboardUtils = (function () {
  return {
    generateID: function () {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  };
})();
