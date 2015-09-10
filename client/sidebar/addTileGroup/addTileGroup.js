if (Meteor.isClient) {
  Template.addTileGroup.events({
    'keypress' : function (event) {
      if (event.keyCode === 13) {
        if (contentUtils.isValidName(event.target.value)) {
          contentUtils.addTileGroup(event.target.value, []);
          event.target.value = '';
        }
        event.preventDefault();
      }
    }
  });
}
