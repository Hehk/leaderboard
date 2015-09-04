if (Meteor.isClient) {
  contentUtils = {
    generateID : function () {
      return '_' + Math.random().toString(36).substr(2, 9);
    },
    renderTimeline : function (target) {
      console.log(target);
    },
    tileClick : function (event) {
      $('.tile-info').remove();

      if (event.target.className === 'tile') {
        $('.tile.selected').removeClass('selected').removeClass('first');
        if (event.target.parentElement.firstElementChild === event.target) {
          event.target.className = 'tile selected first';
        } else {
          event.target.className = 'tile selected';
        }

        Blaze.renderWithData(Template.tileInfo, {}, event.target);

        contentUtils.renderTimeline(d3.select(event.target.querySelector('.tile-info'))
            .append('div')
            .attr('class', 'timeline'));
      } else {
        event.target.className = 'tile';
      }
    },
    adjustScroll : function (delta) {
      var target = $(window);
      target.scrollTop(target.scrollTop() + delta);
    },
    favoriteClick : function (event) {
      var favorites = Session.get('favorites'),
          id = event.target.getAttribute('sel-id');

      if (favorites.indexOf(id) === -1) {
        favorites.push(id);
        contentUtils.adjustScroll(50);
      } else {
        favorites.splice(favorites.indexOf(id), 1);
        contentUtils.adjustScroll(-50);
      }

      Session.set('favorites', favorites);
      event.stopPropagation();
    },
    reloadData : function (content, length, offset, callback) {
      var filteredPlayers = contentUtils.filterContent(content, length, offset),
          favorites = Session.get('favorites');
      Session.set('generalPlayers', filteredPlayers);

      $('.tile-info').remove();
      $('#general').find('.tile').removeClass('selected');
      callback();
    },
    filterContent : function (players, length, offset) {
      offset = offset || 0;

      return players.slice(offset, offset + length);
    }
  };

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
        selId: contentUtils.generateID()
      });
    }

    return players;
  })();
}
