if (Meteor.isClient) {
  Template.addTileGroup.events({
    'keypress' : function (event) {
      if (event.keyCode === 13) {
        if (event.target.value !== '' && Session.get('sidebar').indexOf(event.target.value) === -1) {
          contentUtils.addTileGroup(event.target.value, []);
          event.target.value = '';
        }
        event.preventDefault();
      }
    }
  });
}
