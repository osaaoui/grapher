/*Functions pour cacher/montrer les text pedagogique*/
function textPente(){
  document.getElementById('textPentePeda').style.display = 'block';
  document.getElementById('textOrdoPeda').style.display = 'none';
  document.getElementById('textAxeSym').style.display = 'none';
  document.getElementById('textLesZeros').style.display = 'none';
  misajour();
}

function textOrd(){
  document.getElementById('textOrdoPeda').style.display = 'block';
  document.getElementById('textPentePeda').style.display = 'none';
  document.getElementById('textAxeSym').style.display = 'none';
  document.getElementById('textLesZeros').style.display = 'none';
  misajour();
}

function textAxe(){
	document.getElementById('textAxeSym').style.display = 'block';
  document.getElementById('textPentePeda').style.display = 'none';
  document.getElementById('textOrdoPeda').style.display = 'none';
  document.getElementById('textLesZeros').style.display = 'none';
}

function textZeros(){
	document.getElementById('textLesZeros').style.display = 'block';
	document.getElementById('textAxeSym').style.display = 'none';
  document.getElementById('textPentePeda').style.display = 'none';
  document.getElementById('textOrdoPeda').style.display = 'none';
}
