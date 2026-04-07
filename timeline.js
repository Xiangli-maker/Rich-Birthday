// Timeline of correctly guessed photos
var guessed = {};

function addToTimeline(file, age) {
  if (guessed[age] !== undefined) return;
  guessed[age] = 'images/' + file;

  document.getElementById('timeline-section').style.display = 'block';

  var row = document.getElementById('timeline-row');
  row.innerHTML = '';
  var ages = Object.keys(guessed).map(Number).sort(function(a, b) { return a - b; });
  ages.forEach(function(a) {
    var div = document.createElement('div');
    div.style.cssText = 'text-align:center;';
    div.innerHTML =
      '<img src="' + guessed[a] + '" style="width:70px;height:70px;object-fit:cover;border-radius:8px;border:2px solid #a31f34;display:block;margin-bottom:4px;">' +
      '<div style="font-size:11px;font-weight:600;color:#a31f34;font-family:Jost,sans-serif;">Age ' + a + '</div>';
    row.appendChild(div);
  });
}
