if (Meteor.isClient) {
  contentUtils = (function() {
    return {
      findTileGroup : function (name) {
        var content;

        TileGroupCollection.forEach(function (tileGroup) {
          if (tileGroup.name === name) {
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
        TileGroupCollection.push(new TileGroup(name, content));
        sidebar.push({
          name : name,
          options : typeof options === 'undefined' || options === true ? true : options
        });
        Session.set('sidebar', sidebar);
      },
      removeTileGroup : function (name) {
        var tileGroup = null;
        for (var i = 0; i < TileGroupCollection.length; i++) {
          if (TileGroupCollection[i].name === name) {
            tileGroup = TileGroupCollection[i];
            break;
          }
        }

        if (tileGroup !== null) {
          var sidebar = Session.get('sidebar');
          $('#' + name).remove();
          TileGroupCollection.splice(i,1);
          sidebar.splice(sidebar.indexOf(name), 1);
          Session.set('sidebar', sidebar);
        }
      },
      // generates a unique ID
      generateID: function() {
        return '_' + Math.random().toString(36).substr(2, 9);
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
