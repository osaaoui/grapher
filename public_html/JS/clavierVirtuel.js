/*Fonction pour la saisie du clavier virtuel.
 *@param: aucun
 *@return: aucun
 */
$(function() {
	$("#clavier-virtuel").find("button").click(function() {
		$("input").focus();
		var text = String.fromCharCode(178);
		var text2;
		var saisie = this.id;

		if (saisie == "x2") {
			text2 = "x";
			text = text2.concat(text);
		} else if (saisie == "y2") {
			text = "x";
		}
		var inputText = document.getElementById('input').value;

		var res = inputText.concat(text);
		document.getElementById("input").value = res;
	});
});
