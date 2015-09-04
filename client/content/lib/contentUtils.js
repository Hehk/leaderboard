if (Meteor.isClient) {
  contentUtils = (function () {
    function renderTimeline (target) {
      /* implementation heavily influenced by http://bl.ocks.org/1166403 */

		// define dimensions of graph
		var m = [20, 20, 20, 80]; // margins
		var w = 1000 - m[1] - m[3]; // width
		var h = 300 - m[0] - m[2]; // height

		// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
		var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5];

		// X scale will fit all values from data[] within pixels 0-w
		var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
		// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
		var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
			// automatically determining max range can work something like this
			// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

		// create a line function that can convert data[] into x and y points
		var line = d3.svg.line()
			// assign the X function to plot our line as we wish
			.x(function(d,i) {
				// verbose logging to show what's actually being done
				console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
				// return the X coordinate where we want to plot this datapoint
				return x(i);
			})
			.y(function(d) {
				// verbose logging to show what's actually being done
				console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
				// return the Y coordinate where we want to plot this datapoint
				return y(d);
			});

			// Add an SVG element with the desired dimensions and margin.
			var graph = target.append("svg:svg")
			      .attr("width", w + m[1] + m[3])
			      .attr("height", h + m[0] + m[2])
			    .append("svg:g")
			      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			// create yAxis
			var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
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

  			// Add the line by appending an svg:path element with the data line we created above
			// do this AFTER the axes above so that the line is above the tick-lines
  		graph.append("svg:path").attr("d", line(data));
    }

    return {
      generateID : function () {
        return '_' + Math.random().toString(36).substr(2, 9);
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

          renderTimeline(d3.select(event.target.querySelector('.tile-info'))
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
        var filteredPlayers = contentUtils.filterContent(content, length, offset);

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
  })();

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
