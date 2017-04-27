/*Fonctions pour cacher/montrer les textes dans la bulle pedagogique*/

/*Fonction pour afficher le texte de la pente
 *@param: aucun
 *@return: aucun
 */
function textPente() {
	document.getElementById('textPentePeda').style.display = 'block';
	document.getElementById('textOrdoPeda').style.display = 'none';
	document.getElementById('textAxeSym').style.display = 'none';
	document.getElementById('textLesZeros').style.display = 'none';
	misajour();
}

/*Fonction pour afficher le texte de l'ordonnee
 *@param: aucun
 *@return: aucun
 */
function textOrd() {
	document.getElementById('textOrdoPeda').style.display = 'block';
	document.getElementById('textPentePeda').style.display = 'none';
	document.getElementById('textAxeSym').style.display = 'none';
	document.getElementById('textLesZeros').style.display = 'none';
	misajour();
}

/*Fonction pour afficher le texte de l'axe de symetrie
 *@param: aucun
 *@return: aucun
 */
function textAxe() {
	document.getElementById('textAxeSym').style.display = 'block';
	document.getElementById('textPentePeda').style.display = 'none';
	document.getElementById('textOrdoPeda').style.display = 'none';
	document.getElementById('textLesZeros').style.display = 'none';
	misajour();
}

/*Fonction pour afficher le texte des zeros
 *@param: aucun
 *@return: aucun
 */
function textZeros() {
	document.getElementById('textLesZeros').style.display = 'block';
	document.getElementById('textAxeSym').style.display = 'none';
	document.getElementById('textPentePeda').style.display = 'none';
	document.getElementById('textOrdoPeda').style.display = 'none';
	afficherLesZeros();
}

/*Fonction pour afficher le texte de la forme canonique
 *@param: aucun
 *@return: aucun
 */
function textCanonique() {
	document.getElementById('textFormCanonique').style.display = 'block';
	document.getElementById('textAxeSymSl').style.display = 'none';
	document.getElementById('textPentePedaSl').style.display = 'none';
	document.getElementById('textOrdoPedaSl').style.display = 'none';
	document.getElementById('textLesZerosSl').style.display = 'none';
}

/*Fonction pour afficher le texte de la pente de la page Curseurs
 *@param: aucun
 *@return: aucun
 */
function textPenteSl() {
	document.getElementById('textPentePedaSl').style.display = 'block';
	document.getElementById('textOrdoPedaSl').style.display = 'none';
	document.getElementById('textAxeSymSl').style.display = 'none';
	document.getElementById('textLesZerosSl').style.display = 'none';
	document.getElementById('textFormCanonique').style.display = 'none';
	misajour();
}

/*Fonction pour afficher le texte de l'ordonnee de la page Curseurs
 *@param: aucun
 *@return: aucun
 */
function textOrdSl() {
	document.getElementById('textOrdoPedaSl').style.display = 'block';
	document.getElementById('textPentePedaSl').style.display = 'none';
	document.getElementById('textAxeSymSl').style.display = 'none';
	document.getElementById('textLesZerosSl').style.display = 'none';
	document.getElementById('textFormCanonique').style.display = 'none';
	misajour();
}

/*Fonction pour afficher le texte de l'axe de la page Curseurs
 *@param: aucun
 *@return: aucun
 */
function textAxeSl() {
	document.getElementById('textAxeSymSl').style.display = 'block';
	document.getElementById('textPentePedaSl').style.display = 'none';
	document.getElementById('textOrdoPedaSl').style.display = 'none';
	document.getElementById('textLesZerosSl').style.display = 'none';
	document.getElementById('textFormCanonique').style.display = 'none';
	misajour();
}

/*Fonction pour afficher le texte des zeros de la page Curseurs
 *@param: aucun
 *@return: aucun
 */
function textZerosSl() {
	document.getElementById('textLesZerosSl').style.display = 'block';
	document.getElementById('textAxeSymSl').style.display = 'none';
	document.getElementById('textPentePedaSl').style.display = 'none';
	document.getElementById('textOrdoPedaSl').style.display = 'none';
	document.getElementById('textFormCanonique').style.display = 'none';
	afficherLesZeros();
}
