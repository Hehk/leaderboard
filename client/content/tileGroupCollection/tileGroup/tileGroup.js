if (Meteor.isClient) {
  Template.tileGroup.events({
    'click .prev,.next' : function (event, blaze) {
      var tileGroup = blaze.data,
          settings = tileGroup.settings,
          players = Session.get(tileGroup.name + '-players-filtered'),
          moved = false;

      if (settings.offset + settings.length < players.length &&
          event.target.classList.contains('next')) {
          settings.offset = settings.offset + settings.length;
          moved = true;
      } else if (settings.offset > 0 &&
          event.target.classList.contains('prev')) {
        settings.offset = settings.offset - settings.length;
        moved = true;
      }

      if (moved === true) {
        Session.set(tileGroup.name + '-players-visible',
          contentUtils.filterContent(
            players,
            settings.length,
            settings.offset
        ));
        contentUtils.reloadData();
      }

      tileGroup.update();
    }
  });

  Template.tileGroup.rendered = function () {
    this.data.sort('rank');
    this.data.update();
  };
}
