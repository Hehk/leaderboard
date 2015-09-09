if (Meteor.isClient) {
  Session.setDefault('sidebar', []);

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
}
