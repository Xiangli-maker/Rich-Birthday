// UI Interactions and Utilities

// Confetti animation
function launchConfetti() {
  var wrap = document.getElementById('confetti-wrap');
  var colors = ['#FAC775', '#F0997B', '#9FE1CB', '#c9a96e', '#F4C0D1', '#AFA9EC'];
  
  for (var i = 0; i < 60; i++) {
    (function() {
      var el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = (1.2 + Math.random() * 1.5) + 's';
      el.style.animationDelay = (Math.random() * 0.6) + 's';
      el.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      wrap.appendChild(el);
      
      el.addEventListener('animationend', function() {
        el.remove();
      });
    })();
  }
}
