
var board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
var sliderA;
var sliderB;
var sliderC;
var ordonnee;
var pente;
var exp;
var a = 0.1;
var b = 0;
var c = 0;

/*Fonction pour créer la courbe. Les attributs sont passés en tant que paramètres.
*La courbe est dessinée à l'aide de la fonction de curseur.
*/
function addCurve(board, func, atts){
	var f= board.create('functiongraph', [func], atts,{fixed: false});
	return f;
}

function plot(func, atts){
	if(atts==null){
		return addCurve(board, func, {strokewidth:2});
	}else{
		return addCurve(board, func, atts);
	}
}

/*Fonction appelée par le bouton Soumettre.
*L'équation est analysée et on change les virgules avec des points.
*Ensuite, en utilisant la fonction tokenizer, on analyse l'équation
*et il y a l'extraction des trois variables.
*/
function trace(){
	var equation = document.getElementById('input').value;//alert(equation);
        equation=equation.replace(/,/g,'.'); // rempalce les "," par "."
		var erreur=validation(equation);
	if(erreur<0){
            pente= parametreA(tokenize(equation));
            ordonnee= parametreB(tokenize(equation));
            exp = exposant(tokenize(equation));
            zoomPlan(exp,pente ,ordonnee );
            slidesGenerique (pente, ordonnee, exp);
	}else{
		var input=document.getElementById('input');
		input.selectionStart = erreur;
		input.selectionEnd=++erreur;
		input.focus();
	}
}


/*La fonction crée les curseurs et les cache, afin qu'ils puissent être utilisés avec des curseurs DOM.
 *Ensuite, une équation dynamique est créée et cachée.
*/
function slidesGenerique (pente, ordonnee, exp) {
	sliderA =board.create('slider',[[4,-3],[6,-3],[pente-4,pente,pente+4]],{name:'a', visible:false});
	sliderA.visible(false);
	sliderB =board.create('slider',[[4,-3.5],[6,-3.5], [ordonnee -4, ordonnee,ordonnee +4]],{visible:false});
	sliderB.visible(false);
	sliderC =board.create('slider',[[4,-4],[6,-4],[exp-4,exp,exp+4]],{visible:false});
	sliderC.visible(false);
	function f(x) {
		return sliderC.Value()*(x*x)+ sliderA.Value()*x + sliderB.Value();
	}
	var stringEquation= board.create('text', [4,-2,function(){return 'y= '+sliderC.Value().toFixed(2)
	+ 'x²' + (sliderA.Value()<0?'':'+')+ sliderA.Value().toFixed(2)
	+ 'x'+(sliderB.Value()<0?'':'+')+sliderB.Value().toFixed(2)}], {fontSize:18, visible:false});
	c=plot(f);
	sliderFunction();
}

function slidesCanonique (a, h,k){
	sliderA =board.create('slider',[[4,-3],[6,-3],[a-4,a,a+4]],{name:'a', visible:true});
	sliderA.visible(true);
	sliderB =board.create('slider',[[4,-3.5],[6,-3.5], [h -4, h,h+4]],{visible:true});
	sliderB.visible(true);
	sliderC =board.create('slider',[[4,-4],[6,-4],[k-4,k,k+4]],{visible:true});
	sliderC.visible(true);
	function f(x){
		return sliderA.Value()*Math.pow(x-Number(sliderB.Value()),2)+sliderC.Value();
		}
	var stringEquation= board.create('text', [4,-2,function(){return 'y= '+sliderA.Value().toFixed(2)
	+ '(x' + (sliderB.Value()<0?'+':'-')+Math.abs(sliderB.Value().toFixed(2))+ ')²'+(sliderC.Value()<0?'':'+')+sliderC.Value().toFixed(2)}],{fontSize:18, visible:true});
	
		c=plot(f);
}
/*Fonction appelée au chargement de la page.
 *La fonction crée des curseurs HTML et affiche les bonnes valeurs dans ax, bx et c.
 *Les curseurs sont ancrés sur les curseurs JSXGraph.
 */
function sliderFunction() {
	var valSliderA = sliderC.Value();
	var valSliderB = sliderA.Value();
	var valSliderC = sliderB.Value();
	$("#sliderA1").slider({
		orientation: "horizontal",range: "min",min: valSliderA - 4,max: valSliderA + 4,value: valSliderA,
		slide: function(event, ui) {
			$("#aSlideInput").val(ui.value);
			a = ui.value;
			sliderC.setValue(a);
			board.updateQuality = board.BOARD_QUALITY_HIGH;
			board.update();
		}
	});
	$("#aSlideInput").val($("#sliderA1").slider("value"));
	$("#sliderB1").slider({
		orientation: "horizontal",range: "min",min: valSliderB - 4,max: valSliderB + 4,value: valSliderB,
		slide: function(event, ui) {
			$("#bSlideInput").val(ui.value);
			b = ui.value;
			sliderA.setValue(b);
			board.updateQuality = board.BOARD_QUALITY_HIGH;
			board.update();
		}
	});
	$("#bSlideInput").val($("#sliderB1").slider("value"));
	$("#sliderC1").slider({
		orientation: "horizontal",range: "min",min: valSliderC-4,max: valSliderC+4,value: valSliderC,
		slide: function(event, ui) {
			$("#cSlideInput").val(ui.value);
			c = ui.value;
			sliderB.setValue(c);
			board.updateQuality = board.BOARD_QUALITY_HIGH;
			board.update();
		}
	});
	$("#cSlideInput").val($("#sliderC1").slider("value"));
};

// ajustement le zoom du plan cartésien selon l'équation entré y=ax²+bx+c ou y=bx+c
function zoomPlan(a,b,c){
	var xPos=8;
	var xNeg=-5;
	var yPos=8;
	var yNeg=-5;
	if(a!=0){ // equation quadratique

		var sommetX=-b/(2*a);
		var sommetY=((4*a*c)-(b*b))/(4*a);

		if ((sommetX>8 ||sommetX<-5)||(sommetY>8||sommetY<-5)){ // le sommet est hors du plan
			//alert( sommetX +" "+sommetY );
			if(sommetX>8){ //si le sommet situer plus a droite que le plan de base
				xPos=sommetX*2; xNeg=-sommetX;
			}
			if(sommetX<-5){ //si le sommet situer plus a gauche que le plan de base
				xNeg=sommetX*2; xPos=-sommetX;
			}
			if(sommetY>8){//si le sommet situer plus a en ahut que le plan de base
				yPos=sommetY*2; yNeg=-sommetY;
			}
			if(sommetY<-5){//si le sommet situer plus en bas que le plan de base
				yNeg=sommetY*2; yPos=-sommetY;
			}
			if(sommetX==0 || sommetY==0){ // si le sommet est sur l'une des ligne du plan cartésien
			xNeg=yNeg;
			xPos=yPos
		}
		board.setBoundingBox([xNeg,yPos,xPos,yNeg]);

	}
}else if(b!=0){ // equation linaire
	var zeroX=-c/b;
	var zeroY=c;
	if((zeroX > 8 ||zeroX<-5) && (zeroY>8 || zeroY<-5)){ //des points zero sont hors du plan
		if(zeroX> 8){
			xPos=zeroX*1.5; xNeg=-zeroX;
		}
		if(zeroX<-5){
			xNeg=zeroX*1.5; xPos=-zeroX;
		}
		if(zeroY>8){
			yPos=zeroY*1.5; yNeg=-zeroY;
		}
		if(zeroY<-5){
			xNeg=zeroX*1.5; xPos=-zeroX;
		}
		board.setBoundingBox([xNeg,yPos,xPos,yNeg]);
	}
}else{ // equation plane
	if(c>8){
		yPos=c*1.5;
		yNeg=-c*0.5;
	}
	if(c<-5){
		yPos=-c*0.5;
		yNeg=c*1.5;
	}
	board.setBoundingBox([xNeg,yPos,xPos,yNeg]);
}
}

function clearAll(board){
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
	return board;
}

/* La fonction tokenize retourne un tableau de chaines de caractères
* elle prend en paramètre une chaine String (l'équation à traiter)
* Toutes les fonctions sont déclarées avec const dans un style fonctionnel
* pour éviter des effets de bord (side effects).
* On fera appel à la composition de fonctions pour retourner les valeurs
*/
const tokenize= function (code) {
	var results = [];
	var text = String.fromCharCode(178);
	//le regex permet d'isoler le paramètre a: par exemple: 3x, + 2 sera
	// découpée en ['3x', '+', '2']
	var tokenRegExp  = new RegExp('\s*(-?[0-9]*([.,][0-9]*)?x{1}'+text+'?|-?[0-9]+([.,][0-9]*)?|\S)\s*','g');
	var m;
	while ((m = tokenRegExp.exec(code)) !== null)
	results.push(m[1]);
	return results;

};

const exposant = function(code){
	var tok=code;
	var exp=0;
	var text = String.fromCharCode(178);
	var ouverture= new RegExp('-?[0-9]+([.,][0-9]*)?x{1}'+text+'$');
	var sansX= new RegExp('[^x'+text+']+');
	var ouvertureX='x'+text;
	var ouvertureNeg="-x"+text;
	for(var i=0; i<tok.length;i++){

		if(tok[i].match(ouverture)){;

			exp+= Number(tok[i].match(sansX)[0]);
		}else if(tok[i]==ouvertureX){
			exp++;
		}else if(tok[i]==ouvertureNeg){
			exp--;
		}
	}
	return exp;
};

/*
* fonction qui retourne le paramètre A de l'équation
* Param: code   type: String
*/
const parametreA = function(code){
	var tok = code;
	var laPente=0;
	var pente= /-?[0-9]+([.,][0-9]*)?x$/;
	var sansX= /[^x]+/;
	var penteX= 'x';
	var penteNegX="-x";
	for (var i=0; i< tok.length; i++){
		if(tok[i].match(pente)){
			// une fois la pente ax est trouvée, on veut retourner seulement l'entier a
			// et supprimer le x
			laPente+= Number(tok[i].match(sansX)[0]);
			// si la pente se présente sous la forme x, c'est-à-dire sans coefficient
			// visible, on remet 1 comme coeff
		}else if (tok[i]==penteX){
			laPente += 1;
		}else if(tok[i]==penteNegX){
			laPente += Number(-1);
		}
	}
	return laPente;

};

/*
* fonction qui retourne le paramètre b d'une équation
* Param: code type: String
*/
const parametreB = function(code){
	var tok = code;
	var ordonnee=0;
	for (var i=0; i< tok.length; i++){
		// puisque l'équation est divisée en 'ax', '+' ou '-', 'b'
		// donc le seul élément qui est un nombre est le paramètre 'b'
		if(tok[i].match(/^-?[^x\+]+$/)){
			ordonnee += Number(tok[i].match(/^-?[^x\+]+$/));
		}
	}
	return ordonnee;
};
// methode qui valide l'équation entre en 'input' 
//return -1 si aucune erreur detecter lors des tests
//return la position de la premiere erreur sinon.
function validation(equation){
	var valide= -1; // on présume aucune erreur
	var test;
	
	if((test=valLimit(equation))>=0 ||
	(test=valCaractere(equation))>=0|| 
	(test=valRepetition(equation))>=0){
		valide=test;
	}
	return valide;
}
// permet la detection de caractère qui ne sont ' pas encore prie en compte par le logiciel .
// notamment '*' et '/'
function valLimit(equation){
	var evaluation= equation.search(/[\*\/\(\)]+/);
	if (evaluation>=0){
	 alert("le logiciel ne prend pour le moment pas en compte les symbole '*' et '/'");
	}
	return evaluation;
}
// permet la detection de caractère non valide
function valCaractere(equation){
	var evaluation = equation.search(/[^²x\+\-0-9,.]/);
	if(evaluation>=0){
		alert("l'équation ne doit contenir que des caracteres accepté (voir la liste dans le wiki)");
	}
	return evaluation;
}

// detecte quelque anomalie d'écriture non prie en compte par le logiciel
// plusieur variables consécutives sans operateur  (ex: 2xx)
// nombre apres la variable (ex:x73)
// un nombre avec plusieur plus de un '.' (ex:23.43.68)
// un nombre sans chiffre avant la virgule (ex:.75)
function valRepetition(equation){
	var evaluation = equation.search(/xx|x²x²|x[0-9]+|x²[0-9]+|[0-9]+\.[0-9]+\.|[^0-9]\.[0-9]+|^\./);
	if(evaluation>=0){
		alert("nous avons detecté une anomalie dans l'équation il y a repetition ");
	}
	return evaluation;
}
function changementCanonique(){
		//effacerGenerique();
		JXG.JSXGraph.freeBoard(board);
		board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
		h=-pente/2*exp;
		k=((4*exp*ordonnee)-(pente*pente))/(4*exp);
		slidesCanonique (exp, h,k);
	}
/*La function recharge la page avec location.reload() aprés avoir mis la table à 0.*/
function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
	location.reload();
}
