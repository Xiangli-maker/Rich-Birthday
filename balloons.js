// Interactive Physics Balloons
// Spawned one per correct quiz answer, air-filled (gravity pulls down), mouse-draggable
(function () {
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:5000;pointer-events:none;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Physics constants
  var R = 38;          // balloon radius
  var GRAVITY = 0.38;
  var DRAG = 0.993;
  var BOUNCE = 0.62;   // wall/floor restitution
  var BALL_REST = 0.70; // balloon-balloon restitution

  var COLORS = [
    '#e74c3c','#e67e22','#f1c40f','#27ae60','#3498db',
    '#9b59b6','#e91e63','#00bcd4','#ff5722','#8bc34a',
    '#ff9800','#7c3aed','#ec4899','#16a34a','#0ea5e9',
    '#eab308','#dc2626','#a855f7','#06b6d4','#84cc16','#f97316'
  ];

  var balloons = [];
  window._balloons = balloons; // shared with text-background.js
  var dragging = null;

  // ── DOM obstacle collision ──────────────────────────────────────────────────
  // Cache SVG cake layer elements once (filtered to main layers only).
  var cakeEls = [];
  (function () {
    var svg = document.querySelector('.header svg');
    if (!svg) return;
    var all = svg.querySelectorAll('rect');
    for (var i = 0; i < all.length; i++) {
      var r = all[i].getBoundingClientRect();
      // Keep only the 6 main cake layers (tall rects); skip frosting strips,
      // candles, and tiny decorative rects.
      if (r.height >= 20 && r.width >= 30) cakeEls.push(all[i]);
    }
  })();

  var obstacleRects = []; // refreshed each frame: [{x0,x1,y0,y1}, ...]

  function refreshObstacles() {
    obstacleRects = [];

    // Cake layer rects (element refs cached; only positions change on scroll/resize)
    for (var i = 0; i < cakeEls.length; i++) {
      var r = cakeEls[i].getBoundingClientRect();
      obstacleRects.push({ x0: r.left, x1: r.right, y0: r.top, y1: r.bottom });
    }

    // Gallery title (fit-content width, so it's a narrow centered obstacle)
    var gt = document.querySelector('.gallery-title');
    if (gt) {
      var r = gt.getBoundingClientRect();
      if (r.width > 0) obstacleRects.push({ x0: r.left, x1: r.right, y0: r.top, y1: r.bottom });
    }

    // Individual quiz photo tiles
    var grid = document.getElementById('quiz-grid');
    if (grid) {
      for (var i = 0; i < grid.children.length; i++) {
        var r = grid.children[i].getBoundingClientRect();
        if (r.width > 0 && r.height > 0)
          obstacleRects.push({ x0: r.left, x1: r.right, y0: r.top, y1: r.bottom });
      }
    }
  }

  function collideBalloonRect(b, o) {
    // Nearest point on rect to balloon centre
    var nearX = b.x < o.x0 ? o.x0 : b.x > o.x1 ? o.x1 : b.x;
    var nearY = b.y < o.y0 ? o.y0 : b.y > o.y1 ? o.y1 : b.y;
    var dx = b.x - nearX, dy = b.y - nearY;
    var d2 = dx * dx + dy * dy;
    if (d2 >= R * R) return; // no contact

    if (d2 === 0) {
      // Centre is inside the rect — eject via shortest edge
      var dL = b.x - o.x0, dR = o.x1 - b.x, dT = b.y - o.y0, dB = o.y1 - b.y;
      var m = Math.min(dL, dR, dT, dB);
      if      (m === dL) { b.x = o.x0 - R; if (!b.grabbed) b.vx = -Math.abs(b.vx) * BOUNCE; }
      else if (m === dR) { b.x = o.x1 + R; if (!b.grabbed) b.vx =  Math.abs(b.vx) * BOUNCE; }
      else if (m === dT) { b.y = o.y0 - R; if (!b.grabbed) b.vy = -Math.abs(b.vy) * BOUNCE; }
      else               { b.y = o.y1 + R; if (!b.grabbed) b.vy =  Math.abs(b.vy) * BOUNCE; }
      return;
    }

    var d  = Math.sqrt(d2);
    var nx = dx / d, ny = dy / d;
    // Push balloon out of penetration
    b.x += nx * (R - d);
    b.y += ny * (R - d);
    // Reflect velocity component along normal (only if moving into the surface)
    var dot = b.vx * nx + b.vy * ny;
    if (!b.grabbed && dot < 0) {
      b.vx -= (1 + BOUNCE) * dot * nx;
      b.vy -= (1 + BOUNCE) * dot * ny;
    }
  }
  var mouseX = 0, mouseY = 0;
  var mouseHistory = [];

  function isQuizOpen() {
    var ov = document.getElementById('qoverlay');
    return ov && ov.style.display !== 'none';
  }

  function getBalloonAt(x, y) {
    // Iterate newest-first so top balloon is grabbed first
    for (var i = balloons.length - 1; i >= 0; i--) {
      var b = balloons[i];
      var dx = x - b.x, dy = y - b.y;
      if (dx * dx + dy * dy <= (R + 4) * (R + 4)) return b;
    }
    return null;
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseHistory.push({ x: mouseX, y: mouseY, t: Date.now() });
    if (mouseHistory.length > 10) mouseHistory.shift();

    if (dragging) {
      dragging.x = mouseX + dragging.dx;
      dragging.y = mouseY + dragging.dy;
      // Clamp against obstacles immediately so the balloon can't be dragged inside them
      for (var j = 0; j < obstacleRects.length; j++) collideBalloonRect(dragging, obstacleRects[j]);
      document.body.style.cursor = 'grabbing';
    } else if (!isQuizOpen()) {
      var hit = getBalloonAt(mouseX, mouseY);
      document.body.style.cursor = hit ? 'grab' : '';
    }
  });

  document.addEventListener('mousedown', function (e) {
    if (isQuizOpen()) return;
    var hit = getBalloonAt(e.clientX, e.clientY);
    if (hit) {
      dragging = hit;
      dragging.dx = hit.x - e.clientX;
      dragging.dy = hit.y - e.clientY;
      dragging.grabbed = true;
      dragging.vx = 0;
      dragging.vy = 0;
      mouseHistory = [{ x: e.clientX, y: e.clientY, t: Date.now() }];
      e.preventDefault();
    }
  }, true);

  document.addEventListener('mouseup', function () {
    if (!dragging) return;
    var now = Date.now();
    var recent = mouseHistory.filter(function (m) { return now - m.t < 120; });
    if (recent.length >= 2) {
      var first = recent[0], last = recent[recent.length - 1];
      var dt = Math.max(last.t - first.t, 1);
      dragging.vx = (last.x - first.x) / dt * 8;
      dragging.vy = (last.y - first.y) / dt * 8;
      // Clamp max throw speed
      var spd = Math.sqrt(dragging.vx * dragging.vx + dragging.vy * dragging.vy);
      if (spd > 14) { dragging.vx = dragging.vx / spd * 14; dragging.vy = dragging.vy / spd * 14; }
    }
    dragging.grabbed = false;
    dragging = null;
    document.body.style.cursor = '';
  });

  function spawnBalloon(age) {
    for (var i = 0; i < balloons.length; i++) {
      if (balloons[i].age === age) return; // already spawned
    }
    balloons.push({
      age: age,
      x: R + Math.random() * Math.max(W - R * 2, 1),
      y: -R * 2,
      vx: (Math.random() - 0.5) * 5,
      vy: 1 + Math.random() * 2,
      color: COLORS[age % COLORS.length],
      grabbed: false,
      dx: 0, dy: 0,
      t: Math.random() * 100  // stagger wobble phase
    });
  }

  function update() {
    for (var i = 0; i < balloons.length; i++) {
      var b = balloons[i];
      b.t++;
      if (b.grabbed) continue;

      b.vy += GRAVITY;
      b.vx *= DRAG;
      b.vy *= DRAG;
      b.x += b.vx;
      b.y += b.vy;

      // Walls
      if (b.x < R)     { b.x = R;     b.vx =  Math.abs(b.vx) * BOUNCE; }
      if (b.x > W - R) { b.x = W - R; b.vx = -Math.abs(b.vx) * BOUNCE; }
      // Ceiling
      if (b.y < R)     { b.y = R;     b.vy =  Math.abs(b.vy) * BOUNCE; }
      // Floor
      if (b.y > H - R) {
        b.y = H - R;
        b.vy = -Math.abs(b.vy) * BOUNCE;
        b.vx *= 0.86; // floor friction
      }
    }

    // Balloon-balloon collisions (O(n²), fine for n≤21)
    for (var i = 0; i < balloons.length - 1; i++) {
      for (var j = i + 1; j < balloons.length; j++) {
        var a = balloons[i], b = balloons[j];
        var dx = b.x - a.x, dy = b.y - a.y;
        var d2 = dx * dx + dy * dy;
        var minD = R * 2;
        if (d2 >= minD * minD || d2 === 0) continue;

        var d = Math.sqrt(d2);
        var nx = dx / d, ny = dy / d;
        var overlap = minD - d;

        // Positional correction (treat grabbed as very heavy)
        var mA = a.grabbed ? 1e6 : 1;
        var mB = b.grabbed ? 1e6 : 1;
        var tot = mA + mB;
        if (!a.grabbed) { a.x -= nx * overlap * mB / tot; a.y -= ny * overlap * mB / tot; }
        if (!b.grabbed) { b.x += nx * overlap * mA / tot; b.y += ny * overlap * mA / tot; }

        // Impulse
        var relVn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (relVn < 0) {
          var imp = -(1 + BALL_REST) * relVn / 2;
          if (!a.grabbed) { a.vx -= imp * nx; a.vy -= imp * ny; }
          if (!b.grabbed) { b.vx += imp * nx; b.vy += imp * ny; }
        }
      }
    }

    // Obstacle collisions — runs for grabbed balloons too (position-only correction)
    for (var i = 0; i < balloons.length; i++) {
      for (var j = 0; j < obstacleRects.length; j++) {
        collideBalloonRect(balloons[i], obstacleRects[j]);
      }
    }
  }

  function drawBalloon(b) {
    var ry = R * 1.1;
    var rx = R;
    // Squish slightly in direction of travel when moving fast
    var spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    var sq = Math.min(spd * 0.01, 0.14);
    var angle = spd > 0.5 ? Math.atan2(b.vy, b.vx) : 0;

    ctx.save();
    ctx.translate(b.x, b.y);

    // Drop shadow
    ctx.save();
    ctx.globalAlpha = 0.11;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(5, 6, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Body (rotate + squish along velocity)
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * (1 + sq), ry * (1 - sq * 0.7), 0, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.restore();

    // Glare highlight
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-rx * 0.28, -ry * 0.28, rx * 0.24, ry * 0.17, -0.45, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.42)';
    ctx.fill();
    ctx.restore();

    // Knot at bottom
    ctx.beginPath();
    ctx.moveTo(-5, ry * 0.98);
    ctx.lineTo(5, ry * 0.98);
    ctx.lineTo(0, ry + 8);
    ctx.closePath();
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // String (wiggles gently)
    var sw = Math.sin(b.t * 0.035) * 6;
    ctx.beginPath();
    ctx.moveTo(0, ry + 8);
    ctx.quadraticCurveTo(sw, ry + 25, sw * 0.6, ry + 48);
    ctx.strokeStyle = 'rgba(0,0,0,0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Age number
    var fs = Math.round(R * 0.72);
    ctx.font = 'bold ' + fs + 'px Jost,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.fillText(String(b.age), 0, 1);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  function loop() {
    refreshObstacles();
    update();
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < balloons.length; i++) drawBalloon(balloons[i]);
    requestAnimationFrame(loop);
  }

  loop();

  window.spawnAgeBalloon = spawnBalloon;
})();
