Session.setDefault('favorites', null);
Session.setDefault('generalPlayers', null);

// defines the players used in testing
players = (function () {
  var players = [],
      count = 1000;

  for (var i = 0; i < count ; i++) {
    players.push({
      userName: 'test.8888',
      charName: i.toString(),
      rank: i,
      winRate: 70 - i,
      selId: leaderboardUtils.generateID()
    });
  }

  return players;
})();

if (Meteor.isClient) {
  // ---------------------------------------------------------------------------
  // GENERIC FUNCTIONS USED IN BOTH GENERAL AND FAVORITES ----------------------
  // ---------------------------------------------------------------------------

  // renders a timline at the target
  var renderTimeline = function (target) {
    console.log(target);
  };

  // handles toggling tiles between being slected and not
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
  };

  // adjusts the scrollTop based on an inputed delta
  var adjustScroll = function (delta) {
    var target = $(window);
    target.scrollTop(target.scrollTop() + delta);
  };

  // handles when any favorite button is clicked
  var favoriteClick = function (event) {
    var favorites = Session.get('favorites'),
        id = event.target.getAttribute('sel-id');

    if (favorites.indexOf(id) === -1) {
      favorites.push(id);
      adjustScroll(50);
    } else {
      favorites.splice(favorites.indexOf(id), 1);
      adjustScroll(-50);
    }

    Session.set('favorites', favorites);
    event.stopPropagation();
  }, reloadData = function () {
    var filteredPlayers = filterPlayers(players, generalTilesSettings.length, generalTilesSettings.offset),
        favorites = Session.get('favorites');
    Session.set('generalPlayers', filteredPlayers);

    generalTilesSettings.prevActive();
    generalTilesSettings.nextActive();
    $('.tile-info').remove();
    $('#general').find('.tile').removeClass('selected');
  };

  Session.set('favorites', []);

  // ---------------------------------------------------------------------------
  // FAVORITES TEMPLATE CODE ---------------------------------------------------
  // ---------------------------------------------------------------------------

  Template.favorites.helpers({
    isPopulated: function () {
      return Session.get('favorites').length > 0;
    },
    players: function () {
      var favorites = Session.get('favorites'),
          content = [];

      for (var player in players) {
        if (players.hasOwnProperty(player) &&
            favorites.indexOf(players[player].selId) !== -1)
        {
            content.push(players[player]);
        }
      }
      return content;
    }
  });

  Template.favorites.events({
    'click .tile' : tileClick,
    'click .favorite-button' : favoriteClick
  });

  // ---------------------------------------------------------------------------
  // GENERAL TEMPLATE CODE -----------------------------------------------------
  // ---------------------------------------------------------------------------

  // determines a subset of players based on position
  var filterPlayers = function (players, length, offset) {
    offset = offset || 0;

    return players.slice(offset, offset + length);
  };

  // takes in a sorting option and sorts the general template accordingly
  var sortGeneral = function (option) {
    var sortFn = null,
        targets = $('.prefix').removeClass('selected');

    switch (option) {
      case 'rank':
        if (generalTilesSettings.sort.by === 'rank' && generalTilesSettings.sort.direction === 'up') {
          sortFn = function (a, b) {
            return b.rank - a.rank;
          };
          generalTilesSettings.sort = {
            by: 'rank',
            direction: 'down'
          };
        } else {
          sortFn = function (a, b) {
            return a.rank - b.rank;
          };
          generalTilesSettings.sort = {
            by: 'rank',
            direction: 'up'
          };
        }
        targets.filter('.rank').addClass('selected');

        break;
      case 'win-rate':
        if (generalTilesSettings.sort.by === 'win-rate' && generalTilesSettings.sort.direction === 'up') {
          sortFn = function (a, b) {
            return b.winRate - a.winRate;
          };
          generalTilesSettings.sort = {
            by: 'win-rate',
            direction: 'down'
          };
        } else {
          sortFn = function (a, b) {
            return a.winRate - b.winRate;
          };
          generalTilesSettings.sort = {
            by: 'win-rate',
            direction: 'up'
          };
        }

        targets.filter('.win-rate').addClass('selected');
        break;
    }
    if (sortFn !== null) {
      players.sort(sortFn);
      Session.set('generalPlayers', filterPlayers(players, generalTilesSettings.length));
    }
  };

  //settings used for the rendering of the general template
  var generalTilesSettings = {
    length: 20,
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
    },
    sort: {}
  };

  Template.general.helpers({
    players: function () {
      return Session.get('generalPlayers');
    }
  });

  Template.general.events({
    'click .next' : function (event) {
      if (generalTilesSettings.offset + generalTilesSettings.length < players.length) {
        generalTilesSettings.offset = generalTilesSettings.offset + generalTilesSettings.length;
        reloadData();
      }
    },
    'click .prev' : function (event) {
      if (generalTilesSettings.offset > 0) {
        generalTilesSettings.offset = generalTilesSettings.offset - generalTilesSettings.length;
        reloadData();
      }
    },
    'click .tile' : tileClick,
    'click .favorite-button' : favoriteClick,
    'click .sort-option' : function (event) {
      sortGeneral(event.target.innerText);
    },
    'click .prefix' : function (event) {
      sortGeneral(event.target.getAttribute('value'));
      event.stopPropagation();
    }
  });

  Template.general.rendered = function () {
    generalTilesSettings.prevActive();
    generalTilesSettings.nextActive();

    Tracker.autorun(function () {
      var players = Session.get('generalPlayers'),
          favorites = Session.get('favorites');

      Tracker.afterFlush(function () {
        players.forEach(function (player) {
          if (favorites.indexOf(player.selId) !== -1) {
            $('[sel-id="' + player.selId + '"]').removeClass('fa-star-o')
              .addClass('fa-star selected');
          } else {
            $('[sel-id="' + player.selId + '"]').removeClass('fa-star')
              .removeClass('selected')
              .addClass('fa-star-o');
          }
        });
      });
    });
  };

  Session.set('generalPlayers', filterPlayers(players, generalTilesSettings.length));
}
