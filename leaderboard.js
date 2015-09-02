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
  };

  Template.header.helpers({
    options: ['Favorites', 'General']
  });

  Template.favorites.helpers({
    players: [{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    }]
  });

  Template.favorites.events({
    'click .tile' : tileClick
  });

  Template.general.helpers({
    players: [{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    },{
      userName: 'Hehk.8888',
      charName: 'Riggity Rekt',
      rank: 420,
      winRate: 69.69
    }]
  });

  Template.general.events({
    'click .tile' : tileClick
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
