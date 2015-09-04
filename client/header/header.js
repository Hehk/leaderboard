if (Meteor.isClient) {
  Template.header.helpers({
    options: ['Favorites', 'General']
  });
}
