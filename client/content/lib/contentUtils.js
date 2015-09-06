// temporary function until server side is built up
function retrieveTimelineSettings (/* id */) {
  var settings = {
    minX: (new Date(2015, 8, 100)).getTime(),
    maxX: (new Date(2015, 8, 150)).getTime(),
    minY: 0,
    maxY: null,
    data: []
  };
  for (var i = 100; i <= 150; i++) {
    if (settings.maxY === null || settings.maxY < i) {
      settings.maxY = i;
    }

    settings.data.push({
      rank: i,
      date: (new Date(2015, 8, i)).getTime()
    });
  }

  return settings;
}

if (Meteor.isClient) {
  contentUtils = (function() {
    function renderTimeline(target, id) {
      var m = [20, 20, 20, 80]; // margins
      var w = 1000 - m[1] - m[3]; // width
      var h = 300 - m[0] - m[2]; // height

      // retrieves the settings data for the timeline
      var settings = retrieveTimelineSettings(id);

      // computes scale for the graph
      var x = d3.scale.linear().domain([settings.minX, settings.maxX]).range([0, w]);
      var y = d3.scale.linear().domain([settings.minY, settings.maxY]).range([h, 0]);

      // creates the line using data from the settings
      var line = d3.svg.line()
        .x(function(d) {
          return x(d.date);
        })
        .y(function(d) {
          return y(d.rank);
        })
        // makes the line curvy rather than have sharp joins between points
        .interpolate("cardinal");

      // Add an SVG element with the desired dimensions and margin.
      var graph = target.append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

      // create yAxis
      var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true).tickFormat(function (d) {
        var tickDate = new Date(d);
        return tickDate.toString().split(' ')[1] + ' ' + tickDate.getDate();
      });
      // Add the x-axis.
      graph.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

      // create left yAxis
      var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
      // Add the y-axis to the left
      graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(-25,0)")
        .call(yAxisLeft);

      // appends the path after the tick lines so that it goes over them
      graph.append("svg:path").attr("d", line(settings.data));
    }

    return {
      // generates a unique ID
      generateID: function() {
        return '_' + Math.random().toString(36).substr(2, 9);
      },
      // the standard funcitonality of a tile click
      tileClick: function(event) {
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
      },
      // adjusts the scroll so the users stays in the same space
      adjustScroll: function(delta) {
        var target = $(window);
        target.scrollTop(target.scrollTop() + delta);
      },
      // handler for when a favorite star is clicked
      favoriteClick: function(event) {
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
      searchContent : function (term) {
        var regex = new RegExp(term.trim(), 'i'),
            content = generalPlayers,
            filteredContent = [],
            elem;

        for (var i = 0; i < content.length; i++) {
          elem = content[i];
          if (regex.test(elem.userName) || regex.test(elem.charName)) {
            filteredContent.push(elem);
          }
        }

        Session.set('general-players-filtered', filteredContent);
        Session.set('general-players-visible', contentUtils.filterContent(
          filteredContent,
          20,
          0
        ));
        Session.set('posLabel', null);
      }
    };
  })();
}
