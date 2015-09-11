// defines the TileGroup class
TileGroup = function (name, players) {
  // stores the scope withing the closure of all the functions in this object
  var me = this;

  this.name = name;
  this.id = contentUtils.generateID();
  this.players = players;
  this.settings = {
    length: 20,
    offset: 0,
    sort: {}
  };

  // defines the sessions required to run this object
  Session.setDefault(this.name + '-players-filtered', this.players);
  Session.setDefault(this.name + '-players-visible',
    contentUtils.filterContent(this.players, this.settings.length, this.settings.offset));
  Session.setDefault(this.name + '-label-position', '');
  Session.setDefault(this.name + '-name', this.name);
  // defines the helpers that will be used for the template
  this.content = {
    id : function () {
      return me.id;
    },
    players : function () {
      return Session.get(me.name + '-players-visible');
    },
    labelPosition : function () {
      return Session.get(me.name + '-label-position');
    },
    title : function () {
      var name = Session.get(me.name + '-name');
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  };

  this._updateLabel = function () {
    var label = '',
        playerLength = Session.get(this.name + '-players-filtered').length;

    if (this.settings.length > playerLength) {
      label = this.players.length.toString();
    } else {
      label = '[' + (this.settings.offset + 1) + '-' + (this.settings.offset + this.settings.length) +
              '] of ' + playerLength;
    }

    Session.set(this.name + '-label-position', label);
  };

  this._updatePrevNext = function () {
    var players = Session.get(this.name + '-players-filtered'),
        target = $('#' + this.name).find('.prev');

    if (this.settings.offset > 0) {
      target.removeClass('inactive');
    } else {
      target.addClass('inactive');
    }

    target = $('#' + this.name).find('.next');
    if (this.settings.offset + this.settings.length < players.length) {
      target.removeClass('inactive');
    } else {
      target.addClass('inactive');
    }
  };

  this._updateLength = function () {
    Session.set(this.name + '-players-visible',
      contentUtils.filterContent(
        Session.get(this.name + '-players-filtered'),
        this.settings.length,
        this.settings.offset
      ));
  };
};

// sorts the tiles within based off an option passed in
TileGroup.prototype.sort = function (option) {
  var sortFn = null,
      targets = $('#' + this.id).find('.prefix').removeClass('selected');

  switch (option) {
    case 'rank':
      if (this.settings.sort.by === 'rank' && this.settings.sort.direction === 'up') {
        sortFn = function(a, b) {
          return b.rank - a.rank;
        };
        this.settings.sort = {
          by: 'rank',
          direction: 'down'
        };
      } else {
        sortFn = function(a, b) {
          return a.rank - b.rank;
        };
        this.settings.sort = {
          by: 'rank',
          direction: 'up'
        };
      }
      targets.filter('.rank').addClass('selected');

      break;
    case 'win-rate':
      if (this.settings.sort.by === 'win-rate' && this.settings.sort.direction === 'up') {
        sortFn = function(a, b) {
          return a.winRate - b.winRate;
        };
        this.settings.sort = {
          by: 'win-rate',
          direction: 'down'
        };
      } else {
        sortFn = function(a, b) {
          return b.winRate - a.winRate;
        };
        this.settings.sort = {
          by: 'win-rate',
          direction: 'up'
        };
      }

      targets.filter('.win-rate').addClass('selected');
      break;
  }
  if (sortFn !== null) {
    var players = Session.get(this.name + '-players-filtered');
    Session.set(this.name + '-players-filtered', players.sort(sortFn));
    Session.set(this.name + '-players-visible',
      contentUtils.filterContent(
        players,
        this.settings.length
      ));
  }
};

// filters the players based on an input search term
TileGroup.prototype.filter = function (term) {
  var regex = new RegExp(term.trim(), 'i'),
      filteredContent = [],
      elem;

  for (var i = 0; i < this.players.length; i++) {
    elem = this.players[i];
    if (regex.test(elem.userName) || regex.test(elem.charName)) {
      filteredContent.push(elem);
    }
  }

  this.settings.offset = 0;
  Session.set(this.name + '-players-filtered', filteredContent);
  Session.set(this.name + '-players-visible', contentUtils.filterContent(
    filteredContent,
    this.settings.length,
    this.settings.offset
  ));
};

// updates the next and prev be on or off based on the user position
TileGroup.prototype.update = function () {
  this._updatePrevNext();
  this._updateLabel();
  this._updateLength();
};

// destroys the sessions required to render the tiles
TileGroup.prototype.destroy = function () {
  delete Session.keys[this.name + '-players-filtered'];
  delete Session.keys[this.name + '-players-visible'];
  delete Session.keys[this.name + '-label-position'];
};
