if (Meteor.isClient) {
  var destroy = function () {
    $('.overlay').remove();
  };

  Template.sidebar_optionsMenu.events({
    'keypress' : function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    },
    'click .cancel' : function () {
      destroy();
    },
    'click .save' : function (event, blaze) {
      var newName = $('.sidebar_options-menu > .name > textarea')[0].value.toString(),
          newHeight = Number($('.sidebar_options-menu > .height > textarea')[0].value),
          tileGroup = blaze.data;

      if (!isNaN(newHeight) && newHeight > 0 && newHeight <= 100) {
        tileGroup.settings.length = newHeight;
      }

      if (contentUtils.isValidName(newName)) {
        var prevName = blaze.data.content.title(),
            sidebar = Session.get('sidebar');
        Session.set(tileGroup.name + '-name', newName);

        sidebar.forEach(function (elem) {
          if (elem.name === prevName) {
            elem.name = newName;
          }
        });
        Session.set('sidebar', sidebar);
      }

      blaze.data.update();
      destroy();
    }
  });
}
