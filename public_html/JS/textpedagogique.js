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
    misajour();
}

function textZeros(){
	document.getElementById('textLesZeros').style.display = 'block';
	document.getElementById('textAxeSym').style.display = 'none';
  document.getElementById('textPentePeda').style.display = 'none';
  document.getElementById('textOrdoPeda').style.display = 'none';
  afficherLesZeros();
}

function textCanonique(){
  document.getElementById('textFormCanonique').style.display = 'block';
  document.getElementById('textAxeSymSl').style.display = 'none';
  document.getElementById('textPentePedaSl').style.display = 'none';
  document.getElementById('textOrdoPedaSl').style.display = 'none';
  document.getElementById('textLesZerosSl').style.display = 'none';
}

function textPenteSl(){
  document.getElementById('textPentePedaSl').style.display = 'block';
  document.getElementById('textOrdoPedaSl').style.display = 'none';
  document.getElementById('textAxeSymSl').style.display = 'none';
  document.getElementById('textLesZerosSl').style.display = 'none';
  document.getElementById('textFormCanonique').style.display = 'none';
  misajour();
}

function textOrdSl(){
  document.getElementById('textOrdoPedaSl').style.display = 'block';
  document.getElementById('textPentePedaSl').style.display = 'none';
  document.getElementById('textAxeSymSl').style.display = 'none';
  document.getElementById('textLesZerosSl').style.display = 'none';
  document.getElementById('textFormCanonique').style.display = 'none';
  misajour();
}

function textAxeSl(){
	document.getElementById('textAxeSymSl').style.display = 'block';
  document.getElementById('textPentePedaSl').style.display = 'none';
  document.getElementById('textOrdoPedaSl').style.display = 'none';
  document.getElementById('textLesZerosSl').style.display = 'none';
    document.getElementById('textFormCanonique').style.display = 'none';
    misajour();
}


function textZerosSl(){
	document.getElementById('textLesZerosSl').style.display = 'block';
	document.getElementById('textAxeSymSl').style.display = 'none';
  document.getElementById('textPentePedaSl').style.display = 'none';
  document.getElementById('textOrdoPedaSl').style.display = 'none';
  document.getElementById('textFormCanonique').style.display = 'none';
  afficherLesZeros();
}
