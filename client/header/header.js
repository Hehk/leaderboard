if (Meteor.isClient) {
  var adjustMargin = function() {
    var fromTop = $(window).scrollTop();
    if (fromTop < 100) {
      $(".nav-options").attr('style', 'margin-top: ' + (100 - fromTop) + 'px');
    } else {
      $(".nav-options").attr('style', '');
    }
  };

  Template.header.helpers({
    navOptions: ['Home', 'About']
  });

  $(window).on("scroll", adjustMargin);
  Template.header.rendered = adjustMargin;
}
