if (Meteor.isClient) {
  Session.set('sidebar', []);

  Template.sidebar.helpers({
    options : function () {
      return Session.get('sidebar');
    }
  });

  Template.sidebar_search.events({
    'click .sidebar-search,.sidebar-addTileGroup' : function (event) {
      if (event.target.classList.contains('sidebar-search')) {
        event.target.classList.toggle('selected');
        event.target.querySelector('textarea').value = '';
      }
    },
    'keypress .sidebar-search' : function (event) {
      // keycode 13 is ENTER
      if (event.keyCode === 13) {
        contentUtils.searchContent(event.target.value);
        event.preventDefault();
      }
    }
  });

  Template.sidebar_button.events({
    'click' : function (event, blaze) {
      if (event.target.classList.contains('fa-trash-o')) {
        contentUtils.removeTileGroup(blaze.data.id);
      } else if (event.target.classList.contains('fa-cog')) {
        var menu = $('.overlay');
        if (menu.length === 0) {
          Blaze.renderWithData(
            Template.sidebar_optionsMenu,
            contentUtils.findTileGroup(blaze.data.id),
            $('.content')[0]
          );
        } else {
          menu.remove();
        }
      } else {
        $("html, body").animate({
          scrollTop : $('#' + blaze.data.id).position().top + 'px'
        }, 1000);
      }
    }
  });
}
