$('.trig').click(function (evt) {
  evt.stopPropagation();

  $('iframe, footer').css('opacity', 0);
  setTimeout(function () {
    $('iframe').remove();
  }, 1300);
});

$('.lab').click(function () {
  let ID = $(this).data('iframe');

  setTimeout(function () {
    $('body').append(`<iframe height="100%" style="width: 100%;" scrolling="no" title="${ID}" src="https://easierbycode.com/${ID}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>`);
  }, 1500);

  setTimeout(function () {
    $('iframe, footer').css('opacity', 1);
  }, 1600);

});


