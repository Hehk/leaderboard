function generateID () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}

var tiles = [{
  userName: 'Hehk.8888',
  charName: '1',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '2',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '3',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '4',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: 'Riggity Rekt',
  rank: 420,
  winRate: 69.69,
  id: generateID()
}];

if (Meteor.isClient) {
  var tileClick = function (event) {
    if (event.target.className === 'tile') {
      $('.tile.selected').removeClass('selected').removeClass('first');
      if (event.target.parentElement.firstElementChild === event.target) {
        event.target.className = 'tile selected first';
      } else {
        event.target.className = 'tile selected';
      }
    } else {
      event.target.className = 'tile';
    }

    var target = event.target.querySelector('.tile-info');
    if (target !== null) {
      target.remove();
    } else {
      Blaze.renderWithData(Template.tileInfo, {}, event.target);
    }

  }, adjustScroll = function (delta) {
    var target = $(window);
    target.scrollTop(target.scrollTop() + delta);
  };

  Session.set('favorites', []);

  Template.header.helpers({
    options: ['Favorites', 'General']
  });

  Template.favorites.helpers({
    players: function () {
      var favorites = Session.get('favorites'),
          content = [];

      for (var player in tiles) {
        if (tiles.hasOwnProperty(player) &&
            favorites.indexOf(tiles[player].id) !== -1)
        {
            content.push(tiles[player]);
        }
      }

      return content;
    }
  });

  Template.favorites.events({
    'click .tile' : tileClick
  });

  Template.general.helpers({
    players: tiles
  });

  Template.general.events({
    'click .tile' : function (event) {
      var favorites = Session.get('favorites'),
          id = event.target.getAttribute('id');

      if (favorites.indexOf(id) === -1) {
        favorites.push(id);
        adjustScroll(50);
      } else {
        favorites.splice(favorites.indexOf(id), 1);
        adjustScroll(-50);
      }

      Session.set('favorites', favorites);
      tileClick(event);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
