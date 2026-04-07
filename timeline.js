// Timeline of correctly guessed photos
var guessed = {};

function addToTimeline(file, age) {
  if (guessed[age] !== undefined) return;
  guessed[age] = 'images/' + file;

  // Make timeline section appear above text background canvas (z-index:2)
  var section = document.getElementById('timeline-section');
  section.style.display = 'block';
  section.style.position = 'relative';
  section.style.zIndex = '10';

  var row = document.getElementById('timeline-row');
  row.innerHTML = '';
  var ages = Object.keys(guessed).map(Number).sort(function(a, b) { return a - b; });
  ages.forEach(function(a) {
    var div = document.createElement('div');
    div.style.cssText = 'text-align:center;position:relative;z-index:10;';
    div.innerHTML =
      '<img src="' + guessed[a] + '" style="width:70px;height:70px;object-fit:cover;border-radius:8px;border:2px solid #a31f34;display:block;margin-bottom:4px;">' +
      '<div style="font-size:11px;font-weight:600;color:#a31f34;font-family:Jost,sans-serif;">Age ' + a + '</div>';
    row.appendChild(div);
  });
}
