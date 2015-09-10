if (Meteor.isClient) {
  contentUtils = (function() {
    return {
      findTileGroup : function (id) {
        var content;

        TileGroupCollection.forEach(function (tileGroup) {
          if (tileGroup.id === id) {
            content = tileGroup;
          }
        });

        return content;
      },
      addTileGroup : function (name, content, options) {
        var tileGroup = new TileGroup(name, content),
            sidebar = Session.get('sidebar');

        if (typeof TileGroupCollection === 'undefined') {
          TileGroupCollection = [];
        }
        Blaze.renderWithData(Template.tileGroup, tileGroup, $('.content')[0]);
        TileGroupCollection.push(tileGroup);
        sidebar.push({
          name : tileGroup.content.title(),
          options : typeof options === 'undefined' || options === true ? true : options,
          id : tileGroup.id
        });
        Session.set('sidebar', sidebar);
      },
      removeTileGroup : function (id) {
        var tileGroup = null;
        for (var i = 0; i < TileGroupCollection.length; i++) {
          if (TileGroupCollection[i].id === id) {
            tileGroup = TileGroupCollection[i];
            break;
          }
        }

        if (tileGroup !== null) {
          var sidebar = Session.get('sidebar');
          $('#' + id).remove();
          TileGroupCollection.splice(i,1);
          sidebar.splice(i, 1);
          Session.set('sidebar', sidebar);
          tileGroup.destroy();
        }
      },
      // generates a unique ID
      generateID: function() {
        return '_' + Math.random().toString(36).substr(2, 9);
      },
      // tests if a name is valid
      isValidName : function (name) {
        return typeof name === 'string' &&
          name.length !== 0 &&
          name.match(/\W/) === null &&
          Session.get('sidebar').indexOf(name) === -1;
      },
      // adjusts the scroll so the users stays in the same space
      adjustScroll: function(delta) {
        var target = $(window);
        target.scrollTop(target.scrollTop() + delta);
      },
      // reloads the generalPlayers data
      reloadData: function() {
        $('.tile-info').remove();
        $('#general').find('.tile').removeClass('selected');
      },
      // filters the content based off length and offset from the start
      filterContent: function(players, length, offset) {
        offset = offset || 0;

        return players.slice(offset, offset + length);
      },
      // searchs the content based on a term and returns a filtered version
      searchContent : function (term) {
        TileGroupCollection.forEach(function (tileGroup) {
          tileGroup.filter(term);
          tileGroup.update();
        });
      }
    };
  })();
}
