Session.setDefault('favorites', []);

Template.favorites.helpers({
  isPopulated: function() {
    return Session.get('favorites').length > 0;
  },
  players: function() {
    var favorites = Session.get('favorites'),
      content = [];

    for (var player in players) {
      if (players.hasOwnProperty(player) &&
        favorites.indexOf(players[player].selId) !== -1) {
        content.push(players[player]);
      }
    }
    return content;
  }
});

Template.favorites.events({
  'click .tile': contentUtils.tileClick,
  'click .favorite-button': contentUtils.favoriteClick
});
