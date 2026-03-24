$('.trig').click(function (evt) {
  evt.stopPropagation();

  $('iframe, footer').css('opacity', 0);
  setTimeout(function () {
    $('iframe').remove();
  }, 1300);
});

// Long-press helper: hold HOLD_MS on [data-iframe=selector] to launch altId instead
function makeLongPress(selector, altId) {
  var el = $('[data-iframe="' + selector + '"]')[0];
  if (!el) return;

  var holdTimer = null;
  var longPressed = false;
  var HOLD_MS = 650;

  function onLongPress() {
    longPressed = true;
    if (navigator.vibrate) navigator.vibrate(80);
    var container = $(el).closest('.placeholders, .container').first();
    if (!container.length) container = $('body');
    container.addClass('camera-shake');
    container.one('animationend', function () { container.removeClass('camera-shake'); });
    setTimeout(function () {
      $('body').append('<iframe height="100%" style="width: 100%;" scrolling="no" title="' + altId + '" src="https://easierbycode.com/' + altId + '" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>');
    }, 1500);
    setTimeout(function () { $('iframe, footer').css('opacity', 1); }, 1600);
  }

  function startHold() { longPressed = false; holdTimer = setTimeout(onLongPress, HOLD_MS); }
  function cancelHold() { clearTimeout(holdTimer); }

  // Capture-phase listener suppresses jQuery click after a completed long-press
  el.addEventListener('click', function (e) {
    if (longPressed) { e.stopImmediatePropagation(); longPressed = false; }
  }, true);

  el.addEventListener('mousedown', startHold);
  el.addEventListener('touchstart', startHold, { passive: true });
  el.addEventListener('mouseup', cancelHold);
  el.addEventListener('mouseleave', cancelHold);
  el.addEventListener('touchend', cancelHold);
  el.addEventListener('touchcancel', cancelHold);
}

makeLongPress('pacman-halloween-2025', 'pacman');
makeLongPress('evil-invaders', 'evil-invaders-phaser4/?scene=PackerScene');

$('.lab').click(function () {
  let ID = $(this).data('iframe');

  setTimeout(function () {
    $('body').append(`<iframe height="100%" style="width: 100%;" scrolling="no" title="${ID}" src="https://easierbycode.com/${ID}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>`);
  }, 1500);

  setTimeout(function () {
    $('iframe, footer').css('opacity', 1);
  }, 1600);

});


