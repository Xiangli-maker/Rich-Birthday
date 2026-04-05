// Background lorem-ipsum text that flows smoothly around physics balloons
// and static DOM obstacles (cake SVG shapes, gallery title, quiz grid).
// Uses @chenglou/pretext for fast per-line variable-width layout — no DOM reflows.
(async function () {
  'use strict';

  var mod;
  try {
    mod = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/dist/layout.js');
  } catch (e) {
    return;
  }
  var prepareWithSegments = mod.prepareWithSegments;
  var layoutNextLine = mod.layoutNextLine;

  await document.fonts.ready;

  // ── Canvas ───────────────────────────────────────────────────────────────────
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Lorem ipsum ──────────────────────────────────────────────────────────────
  var P1 = 'On my 21st birthday, I made the awful decision of agreeing to go to my first ever college party. “How have you never been to a party yet?” my roommate Rich demanded, on our way back to our dorm. “We need to get you out to touch grass, pronto. Like, this is seriously concerning.” “I don’t know, I guess I just never saw the appeal,” I mumbled. Rich shoved a Ritz cracker into his mouth. I had never seen him go anywhere without a tube of Ritz crackers before. They somehow had a way of materializing from pockets in his outfit that they really shouldn’t have been able to fit. “Well, you’re going tonight,” Rich ordered. “It’s me and the boys. And some girls, too. But boys’ night sounds cooler than girls’ night, so if anyone asks you what you’re doing, just say boys’ night.” “Got it,” I said warily. “I’m ready for… boys’ night.” Rich punched my arm. It kind of hurt, but I couldn’t tell him that without losing all my aura, so I stayed silent. “With more gusto!” Rich ordered. He shoved another Ritz cracker into his mouth. I hadn’t even seen his arm reach into the tube. It was kind of scary, actually. As we arrived at our dorm, I opened my mouth to ask him how he had done it when I heard loud voices from inside the common lounge. “Pass me another can!” someone yelled. “Who’s ready for beer pong?” someone else cheered. “Rich,” I hissed. “When you said we were going to a party, I thought you meant somewhere else. Did you really organize a whole party in our dorm room without telling me, and, and--” “Purposefully actually go to class today with you when normally I would use a bot to count for my attendance, in order to bait you into agreeing to go to the party while secretly telling the boys to set up the party in our lounge?” Rich finished. “Like… maybe. Really good guess. But we’re here now, so it\'s too late! Sunk cost fallacy! Slippery slope! Ad homeium! Toodles!” He shoved open the door before I could get out a word of protest, and just like that, 21 perfectly good years of my life being party-free seemed to evaporate in an instant. “Hey, it’s the newbie!” someone said excitedly. “Alright, alright, settle down everyone,” Rich ordered. “Before we get started with the festivities, we need to welcome the newbie. And you all know what that means.” “The spiiiiikes,” the crowd chanted, snapping their fingers and grinning like idiots. If they were trying to be intimidating, it wasn’t working. People started rushing around. One person said something I didn’t quite catch about boiling a pot of water. Another person was going to order 90 chicken nuggets along with spectator nuggets for the spectators. This wasn’t how I imagined my first college party going. I thought we would all just get drunk or something. Wasn’t that the benefit of being 21? Being 20, you were just old, but being 21, you were old and legally able to easily get wasted. Rich tapped me on the shoulder. “GP!” he whispered. When I looked at him in utter confusion, he frowned and gave me an expectant look. "What?" I asked. "G… P…" Rich repeated, slower this time, like I was some kind of idiot who need two singular letters repeated at the pace of a snail. "General Practitioner?" he asked. "No," he snapped. "G! P!" "T!" a boy from behind hollered. I spun around, utterly bewildered. The boy’s gaze was still fixed on Rich as he added, “T… I… ” “84!” Rich answered enthusiastically. I didn’t know when shouting random things had become a trend, but I was officially sick of it. “Let’s play a different game,” I grumbled. “This one sucks.” “Okay fine. We’re going to play a game where you have a board full of words. And now, you have to guess who’s on your team by giving vague hints.” I felt relieved. Finally, a game that didn’t revolve around stupid chants. Was it really so hard to have some normalcy around here? Apparently so. Kevin spread out the cards on the table. They were all pretty common looking words. When he was assigned his team’s three words, I frowned. They weren’t very easy to hint at. Nothing unique about them at all. I thought about the words again… Crown, paper, stall… I glanced at everyone around the room for inspiration. For some strange reason Rich and Kevin were looking at each other like they were trying to hold back laughter. Whatever that was about, it definitely didn’t involve me. “Maybe we should put up a bunch of E1331 Reddit posts all over campus,” one girl suggested. “That would be HILARIOUS, dude,” I chimed in. I, in fact, had no idea what this “E1331” character was, but I wanted to feel included for once. The guy grinned and fist bumped me in response, so clearly my strategy was working. “No, it wouldn’t,” Rich argued. “Tell that to Rory,” she replied with a smirk. “Who’s Rory?” Rich demanded. “You haven’t met Rory?” she said, with an exaggerated gasp. I liked her already. She seemed exceedingly confident, almost as if she took No Ls. “My famous cousin, Rory Nite?” “Guys!” someone shouted from the doorway. “It’s almost midnight. That means it’s time for me to bed rot for at least four hours while watching TV. Anyone want in?” The girl who took No Ls smiled at that, winking at an imaginary audience. “Got it! You all know what time it is!” I took back everything nice I had thought about her. She had clearly completely lost it. This was almost as devastating as the economic housing crisis of 2008. Meanwhile, the other guy was still stuck on his kindergarten homework assignment. “What’s the letter that comes after S again?” he whispered to me. “IT’S! T!” I yelled, completely out of patience. “Are you stupid? How stupid can any one person get? You are the reason we have to remove outliers when measuring the general intelligence of the population. Listing all the issues with you is the example teachers use to explain the difference between countable and uncountable infinities. If you were stuck in prison and I gave you bread and a key, YOU WOULD TAKE THE BREAD.” “But bread tastes better than--” “Do NOT say it!” I roared. “I don’t care what tastes better. I don’t care about the bread. I don’t care about the key. I don’t even care if the architecture of Iceland is the most boring architecture in the world because it’s ALL! WHITE! CUBES!” “Seems like you, uh, care quite a bit…” he stammered. I stood up, not caring as my chair tumbled to the ground behind me with a loud thunk. “I am done with this,” I growled. “Bro’s crashing out,” the girl whispered. I ignored her. “I am done with all of you,” I continued, my voice rising. “I am done with pretending I am having fun at this so-called party when I am dealing with a bunch of clowns-- no, when I am dealing with the entire circus. I try to indulge you in your games. I try to laugh at your awful jokes and references, I try to hype you up when you solve your kindergarten level homework, I put on a smile for hours, even when I have no desire to do so. See?” I put on a wide, probably insane looking smile. “See? I’m smiling!” “Good. Keep smiling,” someone said. Then he did a barrel roll and everyone stood up and clapped as he offered high fives and aura farmed his way out of the room. “I did not just spend twenty seconds of my life giving that speech to be forgotten because some guy did a barrel roll!” I yelled. “Put the fries in the bag, lil bro,” Kevin said. “You know what?” Rich said. “Maybe we’ve been a little harsh. Maybe we’ve been a little weird. But that’s what boys’ night is all about.” Everyone nodded wisely. I sighed. My goal tonight had been to get out of my shell. And hadn’t I? I had done something I never thought I would have done otherwise. And, god forbid, it hadn’t been boring in the slightest, even if I wasn’t far from a migraine from the lack of sense of the entire evening. “You’re right,” I said. Rich grinned. “I’m always right.” “Maybe the real party…” I paused for dramatic effect, “was the friends we made along the way.” Everyone groaned. Someone threw a literal tomato at me. What kind of person just keeps a literal tomato on hand? It splattered on my shirt, staining it red. “Boo! Get him out!” someone called. “Okay! Okay, I’m leaving!” I said frantically, unable to stop the smile breaking out on my face as I dodged another tomato from the former assailant. I was stunned when I actually successfully dodged it. My reaction times must have been improving from grinding my way all the way to Coal II in MCSR. Maybe I should take the Human Benchmark Test again so I could feel cooler than all the schumucks still getting over 250 ms. One thing was for certain. My 21st birthday was one I would remember for a long time. ';
  var P2 = 'In show dull give need so held. One order all scale sense her gay style wrote. Incommode our not one ourselves residence. Shall there whose those stand she end. So unaffected partiality indulgence dispatched to of celebrated remarkably. Unfeeling are had allowance own perceived abilities. ';
  var P3 = 'Rooms oh fully taken by worse do. Points afraid but may end law lasted. Was out laughter raptures returned outweigh. Luckily cheered colonel me do we attacks on highest enabled. Tried law yet style child. Bore of true of no be deal. Frequently sufficient in be unaffected. The furnished she concluded depending procuring concealed. ';
  var P4 = 'Now led tedious shy lasting females off. Dashwood marianne in of entrance be on wondered possible building. Wondered sociable he carriage in speedily margaret. Up devonshire of he thoroughly insensible alteration. An mr settling occasion insisted distance ladyship so. Not attention say frankness intention out dashwoods now curiosity. Stronger ecstatic as no judgment daughter speedily thoughts. Worse downs nor might she court did nay forth these. ';
  var LOREM = (P1 + P2 + P3 + P4).repeat(5);

  // ── Constants ─────────────────────────────────────────────────────────────────
  var FONT     = '18px Verdana, sans-serif';
  var LINE_H   = 26;
  var MARGIN_X = 52;
  var MARGIN_Y = 14;
  var B_R      = 38;
  var B_PAD    = 20;
  var R_EFF    = B_R + B_PAD;
  var RECT_PAD = 20;   // breathing room around DOM element edges
  var MIN_SEG  = 20;  // minimum interval width worth rendering

  // Minimum rendered size to include an SVG shape as an obstacle.
  // Excludes tiny decoratives (flames rx≈4px, tooth rects ≈2px, glare ellipses)
  // while keeping all 6 cake layer rects, the plate ellipse, and the candle rects.
  var SVG_MIN_W = 6;
  var SVG_MIN_H = 5;

  // ── Prepare text ─────────────────────────────────────────────────────────────
  var prepared = prepareWithSegments(LOREM, FONT);

  // ── Cache element references (done once) ─────────────────────────────────────
  // SVG cake shapes: all rect/ellipse children of the header SVG, filtered by size.
  // We cache the element objects and call getBoundingClientRect() each frame —
  // cheap because we never mutate the DOM between calls.
  var svgShapeEls = [];
  (function initSvgShapes() {
    var svg = document.querySelector('.header svg');
    if (!svg) return;
    var all = svg.querySelectorAll('rect, ellipse');
    for (var i = 0; i < all.length; i++) {
      var r = all[i].getBoundingClientRect();
      // Filter out sub-pixel decoratives; keep cake layers, plate, candles.
      if (r.width >= SVG_MIN_W && r.height >= SVG_MIN_H) svgShapeEls.push(all[i]);
    }
  })();

  // Other static obstacles queried by selector each frame (they may not exist yet
  // on first paint, e.g. quiz-grid populates after user answers questions).
  var otherSelectors = [
    '.gallery-title',
    '#quiz-grid',
  ];

  // ── Collect all static obstacle rects for the current frame ──────────────────
  var staticRects = [];
  function refreshStaticRects() {
    staticRects = [];

    // Cake: one entry per visible SVG primitive → stepped outline of the cake
    for (var i = 0; i < svgShapeEls.length; i++) {
      var r = svgShapeEls[i].getBoundingClientRect();
      if (r.width < SVG_MIN_W || r.height < SVG_MIN_H) continue; // hidden/zero
      staticRects.push({
        x0: r.left   - RECT_PAD,
        x1: r.right  + RECT_PAD,
        y0: r.top    - RECT_PAD,
        y1: r.bottom + RECT_PAD,
      });
    }

    // Gallery title (fit-content width) + quiz grid
    for (var i = 0; i < otherSelectors.length; i++) {
      var el = document.querySelector(otherSelectors[i]);
      if (!el) continue;
      var r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      staticRects.push({
        x0: r.left   - RECT_PAD,
        x1: r.right  + RECT_PAD,
        y0: r.top    - RECT_PAD,
        y1: r.bottom + RECT_PAD,
      });
    }
  }

  // ── Compute clear horizontal intervals within a column ───────────────────────
  // xMin/xMax define the column bounds; exclusions (balloons + static rects) are
  // clipped to that range before the gap-finding step.
  function getIntervals(lineCY, xMin, xMax) {
    var excl = [];

    // Balloon circles
    var balloons = window._balloons || [];
    for (var i = 0; i < balloons.length; i++) {
      var b = balloons[i];
      var dy = b.y - lineCY; if (dy < 0) dy = -dy;
      if (dy >= R_EFF) continue;
      var xSpan = Math.sqrt(R_EFF * R_EFF - dy * dy);
      excl.push([b.x - xSpan, b.x + xSpan]);
    }

    // Static rects (cake shapes, gallery title, quiz grid)
    for (var i = 0; i < staticRects.length; i++) {
      var r = staticRects[i];
      if (lineCY >= r.y0 && lineCY <= r.y1) excl.push([r.x0, r.x1]);
    }

    // Sort and merge overlapping exclusions
    excl.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    for (var i = 0; i < excl.length; i++) {
      if (!merged.length || excl[i][0] > merged[merged.length - 1][1]) {
        merged.push([excl[i][0], excl[i][1]]);
      } else {
        merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], excl[i][1]);
      }
    }

    // Gaps within [xMin, xMax]
    var intervals = [];
    var cur = xMin;
    for (var i = 0; i < merged.length; i++) {
      var gapRight = Math.min(merged[i][0], xMax);
      if (gapRight - cur >= MIN_SEG) intervals.push([cur, gapRight]);
      cur = Math.max(cur, merged[i][1]);
    }
    if (xMax - cur >= MIN_SEG) intervals.push([cur, xMax]);
    return intervals;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────
  function nextLine(cursor, width) {
    var line = layoutNextLine(prepared, cursor, width);
    if (line === null) {
      cursor = { segmentIndex: 0, graphemeIndex: 0 };
      line = layoutNextLine(prepared, cursor, width);
    }
    return line;
  }

// ── Render loop ───────────────────────────────────────────────────────────────
  function draw() {
    refreshStaticRects();

    ctx.clearRect(0, 0, W, H);
    ctx.font = FONT;
    ctx.fillStyle = 'rgba(28, 58, 28, 0.25)';
    ctx.textBaseline = 'top';

    // Responsive column count
    var numCols  = W < 620 ? 1 : W < 1020 ? 2 : 3;
    var GUTTER   = 32;
    var colWidth = Math.floor((W - MARGIN_X * 2 - GUTTER * (numCols - 1)) / numCols);

    // Single cursor flows left-column-top→bottom, then next column, etc.
    var cursor = { segmentIndex: 0, graphemeIndex: 0 };

    for (var c = 0; c < numCols; c++) {
      var colX0 = MARGIN_X + c * (colWidth + GUTTER);
      var colX1 = colX0 + colWidth;
      var y = MARGIN_Y;

      while (y < H) {
        var lineCY = y + LINE_H * 0.5;
        var intervals = getIntervals(lineCY, colX0, colX1);

        if (intervals.length === 0) {
          // Line fully blocked — leave cursor unchanged so no characters are skipped.
          // Text resumes naturally on the next visible line below the obstacle.
        } else {
          for (var j = 0; j < intervals.length; j++) {
            var x0 = intervals[j][0];
            var iw = intervals[j][1] - x0;
            var line = nextLine(cursor, iw);
            if (line) {
              ctx.fillText(line.text.trimEnd(), x0, y);
              cursor = line.end;
            }
          }
        }

        y += LINE_H;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
