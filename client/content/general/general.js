if (Meteor.isClient) {
  Session.setDefault('generalPlayers', null);

  // takes in a sorting option and sorts the general template accordingly
  var sortGeneral = function (option) {
    var sortFn = null,
        targets = $('.prefix').removeClass('selected');

    switch (option) {
      case 'rank':
        if (settings.sort.by === 'rank' && settings.sort.direction === 'up') {
          sortFn = function (a, b) {
            return b.rank - a.rank;
          };
          settings.sort = {
            by: 'rank',
            direction: 'down'
          };
        } else {
          sortFn = function (a, b) {
            return a.rank - b.rank;
          };
          settings.sort = {
            by: 'rank',
            direction: 'up'
          };
        }
        targets.filter('.rank').addClass('selected');

        break;
      case 'win-rate':
        if (settings.sort.by === 'win-rate' && settings.sort.direction === 'up') {
          sortFn = function (a, b) {
            return b.winRate - a.winRate;
          };
          settings.sort = {
            by: 'win-rate',
            direction: 'down'
          };
        } else {
          sortFn = function (a, b) {
            return a.winRate - b.winRate;
          };
          settings.sort = {
            by: 'win-rate',
            direction: 'up'
          };
        }

        targets.filter('.win-rate').addClass('selected');
        break;
    }
    if (sortFn !== null) {
      players.sort(sortFn);
      Session.set('generalPlayers', contentUtils.filterContent(players, settings.length));
    }
  };

  //settings used for the rendering of the general template
  var settings = {
    length: 20,
    offset: 0,
    sort: {}
  };

  var reloadNextPrev = function () {
    var target = $('#general').find('.prev');
    if (settings.offset > 0) {
      target.removeClass('inactive');
    } else {
      target.addClass('inactive');
    }

    target = $('#general').find('.next');
    if (settings.offset + settings.length < players.length) {
      target.removeClass('inactive');
    } else {
      target.addClass('inactive');
    }
  };

  Template.general.helpers({
    players: function () {
      return Session.get('generalPlayers');
    }
  });

  Template.general.events({
    'click .next' : function (event) {
      if (settings.offset + settings.length < players.length) {
        settings.offset = settings.offset + settings.length;
        contentUtils.reloadData(
          players,
          settings.length,
          settings.offset,
          reloadNextPrev
        );
      }
    },
    'click .prev' : function (event) {
      if (settings.offset > 0) {
        settings.offset = settings.offset - settings.length;
        contentUtils.reloadData(
          players,
          settings.length,
          settings.offset,
          reloadNextPrev
        );
      }
    },
    'click .tile' : contentUtils.tileClick,
    'click .favorite-button' : contentUtils.favoriteClick,
    'click .sort-option' : function (event) {
      sortGeneral(event.target.innerText);
    },
    'click .prefix' : function (event) {
      sortGeneral(event.target.getAttribute('value'));
      event.stopPropagation();
    }
  });

  Template.general.rendered = function () {
    reloadNextPrev();

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

  Session.set('generalPlayers', contentUtils.filterContent(players, settings.length));
}
