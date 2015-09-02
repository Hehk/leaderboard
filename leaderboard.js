function generateID () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}

function renderTimeline (target) {
  //console.log(target);
}

function filterPlayers (players, length, offset) {
  offset = offset || 0;

  return players.slice(offset, offset + length);
}

var players = [{
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
  charName: '5',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '6',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '7',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '8',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '9',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '10',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '11',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '12',
  rank: 420,
  winRate: 69.69,
  id: generateID()
},{
  userName: 'Hehk.8888',
  charName: '13',
  rank: 420,
  winRate: 69.69,
  id: generateID()
}];

if (Meteor.isClient) {
  var generalTilesSettings = {
    length: 5,
    offset: 0,
    prevActive: function () {
      var target = $('#general').find('.prev');
      if (this.offset > 0) {
        target.removeClass('inactive');
      } else {
        target.addClass('inactive');
      }
    },
    nextActive: function () {
      var target = $('#general').find('.next');
      if (this.offset + this.length < players.length) {
        target.removeClass('inactive');
      } else {
        target.addClass('inactive');
      }
    }
  };
  var tileClick = function (event) {
    $('.tile-info').remove();

    if (event.target.className === 'tile') {
      $('.tile.selected').removeClass('selected').removeClass('first');
      if (event.target.parentElement.firstElementChild === event.target) {
        event.target.className = 'tile selected first';
      } else {
        event.target.className = 'tile selected';
      }

      Blaze.renderWithData(Template.tileInfo, {}, event.target);

      renderTimeline(d3.select(event.target.querySelector('.tile-info'))
          .append('div')
          .attr('class', 'timeline'));
    } else {
      event.target.className = 'tile';
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
    isPopulated: function () {
      return Session.get('favorites').length > 0;
    },
    players: function () {
      var favorites = Session.get('favorites'),
          content = [];

      for (var player in players) {
        if (players.hasOwnProperty(player) &&
            favorites.indexOf(players[player].id) !== -1)
        {
            content.push(players[player]);
        }
      }

      return content;
    }
  });

  Template.favorites.events({
    'click .tile' : tileClick
  });

  Session.set('generalPlayers', filterPlayers(players, generalTilesSettings.length));
  Template.general.helpers({
    players: function () {
      return Session.get('generalPlayers');
    }
  });

  Template.general.events({
    'click .next' : function (event) {
      if (generalTilesSettings.offset < players.length) {
        generalTilesSettings.offset = generalTilesSettings.offset + generalTilesSettings.length;
        Session.set('generalPlayers', filterPlayers(players, generalTilesSettings.length, generalTilesSettings.offset));
      }

      generalTilesSettings.prevActive();
      generalTilesSettings.nextActive();
      $('.tile-info').remove();
      $('#general').find('.tile').removeClass('selected');
    },
    'click .prev' : function (event) {
      if (generalTilesSettings.offset > 0) {
        generalTilesSettings.offset = generalTilesSettings.offset - generalTilesSettings.length;
        Session.set('generalPlayers', filterPlayers(players, generalTilesSettings.length, generalTilesSettings.offset));
      }

      generalTilesSettings.prevActive();
      generalTilesSettings.nextActive();
      $('.tile-info').remove();
      $('#general').find('.tile').removeClass('selected');
    },
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

  Template.general.rendered = function () {
    generalTilesSettings.prevActive();
    generalTilesSettings.nextActive();
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
