// Photo Quiz Game

// ─── Debug flag ───────────────────────────────────────────────
var DEBUG = true;
// ──────────────────────────────────────────────────────────────

(function() {
  var answers = {
    '0.JPG':0,'1.JPG':1,'2.JPG':2,'3.JPG':3,'4.JPG':4,
    '5.JPG':5,'6.JPG':6,'7.JPG':7,'8.jpg':8,'9.JPG':9,
    '10.JPG':10,'11.JPG':11,'12.JPG':12,'13.JPG':13,'14.jpg':14,
    '15.jpg':15,'16.jpg':16,'17.jpg':17,'18.jpg':18,'19.jpg':19,
    '20.jpg':20
  };

  var photos = Object.keys(answers);

  // Seeded PRNG (mulberry32)
  var SEED = 42;
  function seededRand() {
    SEED |= 0; SEED = SEED + 0x6D2B79F5 | 0;
    var t = Math.imul(SEED ^ SEED >>> 15, 1 | SEED);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  // Shuffle
  for (var i = photos.length - 1; i > 0; i--) {
    var j = Math.floor(seededRand() * (i + 1));
    var t = photos[i];
    photos[i] = photos[j];
    photos[j] = t;
  }

  // Build grid
  var grid = document.getElementById('quiz-grid');
  var btnMap = {};
  photos.forEach(function(file, idx) {
    var btn = document.createElement('div');
    btn.className = 'photo-btn';
    btn.style.textAlign = 'center';
    btn.textContent = '📷 Photo ' + (idx + 1);
    btn.addEventListener('click', function() {
      openQuiz(file);
    });
    grid.appendChild(btn);
    btnMap[file] = btn;
  });

  var current = '';
  var fwRunning = false;
  var fwFrame;
  var fwPieces = [];

  function openQuiz(file) {
    current = file;
    document.getElementById('qphoto').src = 'images/' + file;
    document.getElementById('qinput').value = '';
    document.getElementById('qresult').textContent = '';
    document.getElementById('qresult').style.color = '';
    document.getElementById('qoverlay').style.display = 'block';
    setTimeout(function() {
      document.getElementById('qinput').focus();
    }, 200);
  }

  function closeQuiz() {
    document.getElementById('qoverlay').style.display = 'none';
  }

  function submitGuess() {
    var guess = parseInt(document.getElementById('qinput').value);
    var res = document.getElementById('qresult');

    if (isNaN(guess)) {
      res.style.color = '#c0504d';
      res.textContent = 'Please enter a number!';
      return;
    }

    // Find answer case-insensitive
    var answer;
    Object.keys(answers).forEach(function(k) {
      if (k.toLowerCase() === current.toLowerCase()) {
        answer = answers[k];
      }
    });

    if (answer === undefined) {
      res.style.color = '#c0504d';
      res.textContent = 'Photo not found!';
      return;
    }

    if (guess === answer) {
      res.style.color = '#2d8a2d';
      res.textContent = '🎉 Yes! Rich was ' + answer + ' years old!';

      // Add to timeline
      if (typeof addToTimeline === 'function') addToTimeline(current, answer);

      // Mark the grid button as solved
      var solvedBtn = btnMap[current];
      if (solvedBtn) {
        solvedBtn.classList.add('solved');
        solvedBtn.style.background = 'rgba(45,138,45,0.35)';
        solvedBtn.style.border = '2px solid #2d8a2d';
        solvedBtn.style.color = '#1a5e1a';
        solvedBtn.style.pointerEvents = 'none';
        solvedBtn.style.cursor = 'default';
        solvedBtn.innerHTML = '✔';
      }
      if (typeof window.spawnAgeBalloon === 'function') window.spawnAgeBalloon(answer);

      // Check if all photos are now solved
      var solvedCount = Object.keys(btnMap).filter(function(f) {
        return btnMap[f].style.pointerEvents === 'none';
      }).length;
      if (solvedCount === photos.length) {
        launchQuizFireworks();
      }
    } else if (Math.abs(guess - answer) === 1) {
      res.style.color = '#e67e22';
      res.textContent = '😅 So close! Try again!';
      shakeBox();
    } else {
      res.style.color = '#c0504d';
      res.textContent = '❌ Nope! Try again!';
      shakeBox();
    }
  }

  function shakeBox() {
    var box = document.getElementById('qbox');
    box.style.transition = 'transform 0.1s';
    var moves = ['-8px', '8px', '-6px', '6px', '0px'];
    var i = 0;
    var iv = setInterval(function() {
      box.style.transform = 'translate(calc(-50% + ' + moves[i] + '), -50%)';
      i++;
      if (i >= moves.length) {
        clearInterval(iv);
        box.style.transform = 'translate(-50%, -50%)';
      }
    }, 80);
  }

  // Wire buttons
  document.getElementById('qsubmit').addEventListener('click', function(e) {
    e.stopPropagation();
    submitGuess();
  });

  document.getElementById('qclose').addEventListener('click', function(e) {
    e.stopPropagation();
    closeQuiz();
  });

  document.getElementById('qinput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.stopPropagation();
      submitGuess();
    }
  });

  document.getElementById('qoverlay').addEventListener('click', function(e) {
    if (e.target === this) closeQuiz();
  });

  // Fireworks for completing all photos
  function launchQuizFireworks() {
    var canvas = document.getElementById('fwcanvas');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    fwPieces = [];
    fwRunning = true;

    var colors = ['#a31f34', '#FFD700', '#fff', '#2d6a2d', '#c8c9c7', '#ff6600'];

    for (var b = 0; b < 20; b++) {
      (function(delay) {
        setTimeout(function() {
          if (!fwRunning) return;
          var x = Math.random() * canvas.width;
          var y = Math.random() * canvas.height * 0.6 + 50;
          for (var i = 0; i < 80; i++) {
            var angle = (Math.PI * 2 / 80) * i;
            var speed = Math.random() * 7 + 2;
            fwPieces.push({
              x: x, y: y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              r: Math.random() * 3.5 + 1.5,
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          }
        }, delay);
      })(b * 400);
    }

    drawQuizFireworks(ctx, canvas);
    setTimeout(stopFireworks, 10000);
  }

  function drawQuizFireworks(ctx, canvas) {
    if (!fwRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fwPieces.forEach(function(p) {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.08; p.vx *= 0.98;
      p.alpha -= 0.012;
      if (p.alpha < 0) p.alpha = 0;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    fwPieces = fwPieces.filter(function(p) { return p.alpha > 0; });
    fwFrame = requestAnimationFrame(function() { drawQuizFireworks(ctx, canvas); });
  }

  function stopFireworks() {
    fwRunning = false;
    cancelAnimationFrame(fwFrame);
    var canvas = document.getElementById('fwcanvas');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'none';
  }

  // Debug: press K to instantly solve all
  document.addEventListener('keydown', function(e) {
    if (!DEBUG) return;
    if (e.key !== 'k' && e.key !== 'K') return;
    Object.keys(btnMap).forEach(function(file) {
      var btn = btnMap[file];
      if (btn.style.pointerEvents === 'none') return;
      btn.classList.add('solved');
      btn.style.background = 'rgba(45,138,45,0.35)';
      btn.style.border = '2px solid #2d8a2d';
      btn.style.color = '#1a5e1a';
      btn.style.pointerEvents = 'none';
      btn.style.cursor = 'default';
      btn.innerHTML = '✔';
      var age;
      Object.keys(answers).forEach(function(k) {
        if (k.toLowerCase() === file.toLowerCase()) age = answers[k];
      });
      if (age !== undefined) {
        if (typeof window.spawnAgeBalloon === 'function') window.spawnAgeBalloon(age);
        if (typeof addToTimeline === 'function') addToTimeline(file, age);
      }
    });
    launchQuizFireworks();
    closeQuiz();
  });
})();
