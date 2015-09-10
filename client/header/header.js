if (Meteor.isClient) {
  var adjustMargin = function() {
    var fromTop = $(window).scrollTop(),
        headerHeight = 80;
    if (fromTop < headerHeight) {
      $(".nav-options").attr('style', 'margin-top: ' + (headerHeight - fromTop) + 'px');
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
