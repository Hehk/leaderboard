if (Meteor.isClient) {
  Template.header.helpers({
    options: [{
      template : 'header_search'
    },{
      template : 'header_button',
      name : 'Favorites'
    },{
      template : 'header_button',
      name : 'General'
    }]
  });

  Template.header_search.events({
    'click .header-search' : function (event) {
      if (event.target.classList.contains('header-search')) {
        event.target.classList.toggle('selected');
        event.target.querySelector('textarea').value = '';
      }
    },
    'keypress' : function (event) {
      // keycode 13 is ENTER
      if (event.keyCode === 13) {
        contentUtils.searchContent(event.target.value);
        event.preventDefault();
      }
    }
  });
}
