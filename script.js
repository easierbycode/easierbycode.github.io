// Game list derived from data-iframe attributes
var GAMES = [];
$('.lab').each(function () {
  GAMES.push({
    id: $(this).data('iframe'),
    el: $(this),
    name: $(this).find('h4').text()
  });
});

// --- Last played tracking ---
function getLastPlayed() {
  try { return localStorage.getItem('lastPlayedGame'); } catch (e) { return null; }
}
function setLastPlayed(id) {
  try { localStorage.setItem('lastPlayedGame', id); } catch (e) {}
}

// --- Launch a game by iframe ID ---
function launchGame(id) {
  setLastPlayed(id);
  setTimeout(function () {
    $('body').append('<iframe height="100%" style="width: 100%;" scrolling="no" title="' + id + '" src="https://easierbycode.com/' + id + '" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>');
  }, 1500);
  setTimeout(function () {
    $('iframe, footer').css('opacity', 1);
  }, 1600);
}

// --- MK2-style random select ---
// Replicates the MKII character select: rapidly cycles through all tiles
// with flashing colored border, slows down, then locks on the chosen fighter.
function mk2RandomSelect(callback) {
  var overlay = $('<div class="mk2-overlay"></div>');
  $('body').append(overlay);
  setTimeout(function () { overlay.addClass('active'); }, 10);

  var totalCycles = 24 + Math.floor(Math.random() * 8); // 24-31 total steps
  var chosenIndex = Math.floor(Math.random() * GAMES.length);

  // Build the sequence: cycle through all games, ending on chosenIndex
  // MK2 pattern: fast at start, decelerates toward the end
  var currentStep = 0;
  var currentIndex = Math.floor(Math.random() * GAMES.length);
  var prevIndex = -1;

  function step() {
    // Remove highlight from previous
    if (prevIndex >= 0) {
      GAMES[prevIndex].el.removeClass('mk2-highlight');
    }

    // Advance index (sequential cycle like MK2 character grid)
    currentIndex = (currentIndex + 1) % GAMES.length;
    // On the last step, force land on chosen
    if (currentStep === totalCycles - 1) {
      currentIndex = chosenIndex;
    }

    GAMES[currentIndex].el.addClass('mk2-highlight');

    // Scroll tile into view
    var tile = GAMES[currentIndex].el[0];
    if (tile.scrollIntoView) {
      tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    prevIndex = currentIndex;
    currentStep++;

    if (currentStep < totalCycles) {
      // MK2 deceleration curve: starts at ~60ms, slows to ~350ms
      var progress = currentStep / totalCycles;
      var delay = 60 + Math.pow(progress, 2.5) * 300;
      setTimeout(step, delay);
    } else {
      // Selection locked - flash the winner MK2 style
      GAMES[currentIndex].el.removeClass('mk2-highlight');
      GAMES[currentIndex].el.addClass('mk2-selected');

      setTimeout(function () {
        GAMES[currentIndex].el.removeClass('mk2-selected');
        overlay.removeClass('active');
        setTimeout(function () {
          overlay.remove();
          callback(GAMES[chosenIndex].id);
        }, 300);
      }, 1400);
    }
  }

  step();
}

// --- Gamepad button (tap = last played, hold = MK2 random select) ---
var gamepadHoldTimer = null;
var gamepadDidHold = false;
var HOLD_THRESHOLD = 400; // ms

$('#gamepadBtn').on('mousedown touchstart', function (evt) {
  evt.preventDefault();
  gamepadDidHold = false;
  gamepadHoldTimer = setTimeout(function () {
    gamepadDidHold = true;
    if ($('iframe').length) return;
    mk2RandomSelect(function (gameId) {
      launchGame(gameId);
    });
  }, HOLD_THRESHOLD);
});

$('#gamepadBtn').on('mouseup touchend mouseleave', function () {
  clearTimeout(gamepadHoldTimer);
});

$('#gamepadBtn').on('click', function (evt) {
  evt.preventDefault();
  evt.stopPropagation();
  if (gamepadDidHold) return; // hold already triggered random select
  if ($('iframe').length) return;

  var lastPlayed = getLastPlayed();
  if (lastPlayed) {
    launchGame(lastPlayed);
  } else {
    // No history yet — random select on tap too
    mk2RandomSelect(function (gameId) {
      launchGame(gameId);
    });
  }
});

// --- Long-press on pacman-halloween-2025: launch classic pacman instead ---
(function () {
  var el = $('[data-iframe="pacman-halloween-2025"]')[0];
  if (!el) return;

  var holdTimer = null;
  var longPressed = false;
  var HOLD_MS = 650;

  function onLongPress() {
    longPressed = true;
    if (navigator.vibrate) navigator.vibrate(80);
    var container = $(el).closest('.placeholders, .container, body').first();
    container.addClass('camera-shake');
    container.one('animationend', function () { container.removeClass('camera-shake'); });
    launchGame('pacman');
  }

  function startHold() {
    longPressed = false;
    holdTimer = setTimeout(onLongPress, HOLD_MS);
  }

  function cancelHold() {
    clearTimeout(holdTimer);
  }

  // Suppress the click event that fires after a completed long-press
  el.addEventListener('click', function (e) {
    if (longPressed) {
      e.stopImmediatePropagation();
      longPressed = false;
    }
  }, true); // capture phase so it runs before jQuery's handler

  el.addEventListener('mousedown', startHold);
  el.addEventListener('touchstart', startHold, { passive: true });
  el.addEventListener('mouseup', cancelHold);
  el.addEventListener('mouseleave', cancelHold);
  el.addEventListener('touchend', cancelHold);
  el.addEventListener('touchcancel', cancelHold);
}());

// --- Game tile click ---
$('.lab').click(function () {
  var ID = $(this).data('iframe');
  launchGame(ID);
});

// --- Go Back ---
$('.trig').click(function (evt) {
  evt.stopPropagation();

  $('iframe, footer').css('opacity', 0);
  setTimeout(function () {
    $('iframe').remove();
  }, 1300);
});
