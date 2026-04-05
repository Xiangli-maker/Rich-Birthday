// Music Player

var music = document.getElementById('bg-music');
var musicBtn = document.getElementById('music-btn');
var musicLabel = document.getElementById('music-label');
var playing = false;

if (music) {
  music.volume = 0.4;
}

// Start music on first click
document.addEventListener('click', function startMusic(e) {
  // Don't start music if clicking inside quiz overlay
  var qoverlay = document.getElementById('qoverlay');
  if (qoverlay && qoverlay.contains(e.target)) {
    return;
  }
  
  if (music && music.paused) {
    music.muted = false;
    music.play().then(function() {
      playing = true;
      if (musicBtn) musicBtn.textContent = '⏸';
    }).catch(function(e) {
      console.log('Music play error:', e);
    });
  }
  
  document.removeEventListener('click', startMusic);
}, { once: true });

// Music button toggle
if (musicBtn) {
  musicBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMusic();
  });
  
  // Show label on hover
  musicBtn.addEventListener('mouseenter', function() {
    if (musicLabel) musicLabel.classList.add('show');
  });
  
  musicBtn.addEventListener('mouseleave', function() {
    if (musicLabel) musicLabel.classList.remove('show');
  });
}

function toggleMusic() {
  if (!music) return;
  
  if (playing) {
    music.pause();
    if (musicBtn) musicBtn.textContent = '🎵';
  } else {
    music.muted = false;
    music.play();
    if (musicBtn) musicBtn.textContent = '⏸';
  }
  playing = !playing;
}
