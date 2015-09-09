if (Meteor.isClient) {
  Template.content.rendered = function () {
    // defines the players used in testing
    generalPlayers = (function() {
      var players = [],
        count = 1000;

      for (var i = 1; i <= count; i++) {
        players.push({
          userName: 'test.8888',
          charName: i.toString(),
          rank: i,
          winRate: 70 - i,
          selId: contentUtils.generateID()
        });
      }

      return players;
    })();


    contentUtils.addTileGroup('leaderboard', generalPlayers);
    contentUtils.addTileGroup('test', generalPlayers);
  };
}
