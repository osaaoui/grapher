/*
Copyright 2008-2016
          Matthias Ehmann,
           Michael Gerhaeuser,
           Carsten Miller,
           Bianca Valentin,
           Alfred Wassermann,
           Peter Wilfahrt
   
      This file is part of JSXGraph.
  
      JSXGraph is free software dual licensed under the GNU LGPL or MIT License.
  
      You can redistribute it and/or modify it under the terms of the
  
        * GNU Lesser General Public License as published by
          the Free Software Foundation, either version 3 of the License, or
          (at your option) any later version
        OR
        * MIT License: https://github.com/jsxgraph/jsxgraph/blob/master/LICENSE.MIT
  
      JSXGraph is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU Lesser General Public License for more details.
  
      You should have received a copy of the GNU Lesser General Public License and
      the MIT License along with JSXGraph. If not, see <http://www.gnu.org/licenses/>
      and <http://opensource.org/licenses/MIT/>.
   
*/


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
var enterPr = false;

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

/*Function pour la soummision avec Enter*/
$(document).keypress(function(e) {
    if(e.which == 13) {
			 if (enterPr == false) {
				enterPr = true;
				document.getElementById('btnrnd').disabled = true;
        trace();
			} else {
        alert("S.V.P. utilisez Effacer après la première soumission.");
			}
    }
});

/*Fonction appelée par le bouton Soumettre.
*L'équation est analysée et on change les virgules avec des points.
*Ensuite, en utilisant la fonction tokenizer, on analyse l'équation
*et il y a l'extraction des trois variables.
*/
function trace(){
	var equation=document.getElementById('input').value;
      equation=equation.replace(/,/g,'.'); // rempalce les "," par "."
		var erreur=validation(equation);
                document.getElementById('btnresetter').disabled=false;//activation du bouton Reset
	if(erreur<0){
            pente= parametreA(tokenize(equation));
            ordonnee= parametreB(tokenize(equation));
            exp = exposant(tokenize(equation));
            zoomPlan(exp,pente ,ordonnee );
            document.getElementById('btnAfficOrd').disabled=false;//activation du bouton Ordonnee
            document.getElementById('btnAxeStm').disabled=false;//activation du bouton  Axe symétrie
            document.getElementById('btnAfficZero').disabled=false;//activation du bouton Les zéros
            document.getElementById('btnpente').disabled=false;//activation du bouton Pente
            document.getElementById('canonique').disabled=false;//activation du bouton canonique
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
	sliderA=board.create('slider',[[4,-3],[6,-3],[exp-4,exp,exp+4]],{name:'a', visible:false});
	sliderA.visible(false);
	sliderB=board.create('slider',[[4,-3.5],[6,-3.5], [pente-4,pente,pente+4]],{visible:false});
	sliderB.visible(false);
	sliderC=board.create('slider',[[4,-4],[6,-4],[ordonnee -4, ordonnee,ordonnee +4]],{visible:false});
	sliderC.visible(false);
	function f(x) {
		return sliderA.Value()*(x*x)+ sliderB.Value()*x + sliderC.Value();
	}
	var stringEquation=board.create('text', [4,-2,function(){return 'y= '+sliderC.Value().toFixed(2)
	+ 'x²' + (sliderA.Value()<0?'':'+')+ sliderA.Value().toFixed(2)
	+ 'x'+(sliderB.Value()<0?'':'+')+sliderB.Value().toFixed(2)}], {fontSize:18, visible:false});
	c=plot(f);
	sliderFunction();
}

function slidesCanonique (a, h,k){
	sliderA=board.create('slider',[[4,-3],[6,-3],[a-4,a,a+4]],{name:'a', visible:true});
	sliderA.visible(true);
	sliderB=board.create('slider',[[4,-3.5],[6,-3.5], [h -4, h,h+4]],{visible:true});
	sliderB.visible(true);
	sliderC=board.create('slider',[[4,-4],[6,-4],[k-4,k,k+4]],{visible:true});
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
	var valSliderA = sliderA.Value();
	var valSliderB = sliderB.Value();
	var valSliderC = sliderC.Value();
	$("#sliderA1").slider({
		orientation: "horizontal",range: "min",min: valSliderA - 4,max: valSliderA + 4,value: valSliderA,
		slide: function(event, ui) {
			$("#aSlideInput").val(ui.value);
			a = ui.value;
			sliderA.setValue(a);
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
			sliderB.setValue(b);
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
			sliderC.setValue(c);
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
} else if(b != 0) { // equation linaire
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
} else { // equation plane
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
	 alert("le logiciel ne prend pas en compte les symbole '*' et '/'");
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
		alert("nous avons detecté une anomalie dans l'équation  ");
	}
	return evaluation;
}

function changementCanonique(){
		//effacerGenerique();
		JXG.JSXGraph.freeBoard(board);
		board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
		h=-sliderB.Value()/2*sliderA.Value();
		k=((4*sliderA.Value()*sliderC.Value())-(sliderB.Value()*sliderB.Value()))/(4*sliderA.Value());
		slidesCanonique (sliderA.Value(), h,k);
		afficherFormeCanonique();
}
function afficherFormeCanonique(){
if(sliderB.Value()< 0 && sliderC.Value() < 0){
		document.getElementById('formeGenerale').innerHTML= "y = "+sliderA.Value()
		+ 'x² +(' + sliderB.Value()+ ')' + '+('+ sliderC.Value()+ ')';
		
				board.on('update', function(){
		document.getElementById('formeGenerale').innerHTML= "y = "+sliderA.Value()
		+ 'x² +(' + sliderB.Value()+ ')' + '+('+ sliderC.Value()+ ')';
	});
			}else if(sliderB.Value()< 0 && sliderC.Value() >= 0 ){
				
				document.getElementById('formeGenerale').innerHTML= "y = "+sliderA.Value()
		+ 'x² +(' + sliderB.Value()+')' + "+ " + sliderC.Value();
		
				board.on('update', function(){
		document.getElementById('formeGenerale').innerHTML= "y = "+sliderA.Value()
		+ 'x² +(' + sliderB.Value()+')' + "+ " + sliderC.Value();
	});
			} else if(sliderC.Value()< 0 && sliderB.Value() >= 0){
				
				document.getElementById('formeGenerale').innerHTML= "y = "+sliderA.Value()
		+ 'x² + ' + sliderB.Value()+ "+(" + sliderC.Value()+')';
		
				board.on('update', function(){
		document.getElementById('formeGenerale').innerHTML= "y = "+sliderA.Value()
		+ 'x² + ' + sliderB.Value()+ "+(" + sliderC.Value()+')';
	});
			}else{
				document.getElementById('formeGenerale').innerHTML= "y = "+sliderA.Value()
		+ 'x² + ' + sliderB.Value() + sliderC.Value();
		
				board.on('update', function(){
		document.getElementById('formeGenerale').innerHTML= "y = "+sliderA.Value()
		+ 'x² + ' + sliderB.Value() + sliderC.Value();
	});
			}
			
	// Affichage de la forme canonique
	//h=-sliderB.Value()/2*sliderA.Value();
	//	k=((4*sliderA.Value()*sliderC.Value())-(sliderB.Value()*sliderB.Value()))/(4*sliderA.Value());
	//	slidesCanonique (sliderA.Value(), h,k);
	
	document.getElementById('formeCanonique').innerHTML= "y = "+sliderA.Value()
	+ '(x- +' + h + ')' + k;
		
		
				board.on('update', function(){
		document.getElementById('formeCanonique').innerHTML= "y = "+sliderA.Value()
			+ '(x- +' + h + ')' + k;
	});
	
	// les valeurs des paramètres a, h et k

	
	document.getElementById('paraA').innerHTML= "Le paramètre a qui vaut ici " + "("+ sliderA.Value()+")" + " indique le facteur de  dilatation verticale de la courbe";
		
		
				board.on('update', function(){
		document.getElementById('paraA').innerHTML= "Le paramètre a qui vaut ici: " + "("+ sliderA.Value()+")" + "indique le facteur de dilatation verticale de la courbe";
	});
	
	// paramètre h
	document.getElementById('paraH').innerHTML= "Le paramètre h, ici il vaut" + "("+ (-sliderB.Value()/2*sliderA.Value())+")" + ", indique la valeur de x au sommet de la courbe";
		
		
				board.on('update', function(){
		document.getElementById('paraH').innerHTML= "Le paramètre h, ici il vaut" + "("+ (-sliderB.Value()/2*sliderA.Value()) +")" + ", indique la valeur de x au sommet de la courbe";
	});
	
	// paramètre k
	document.getElementById('paraK').innerHTML= "Le paramètre k, ici il vaut" + "("+ ((4*sliderA.Value()*sliderC.Value())-(sliderB.Value()*sliderB.Value()))/(4*sliderA.Value()) +")" + ", indique la valeur de y au sommet de la courbe";
		
		
				board.on('update', function(){
		document.getElementById('paraK').innerHTML= "Le paramètre k, ici il vaut" + "("+ ((4*sliderA.Value()*sliderC.Value())-(sliderB.Value()*sliderB.Value()))/(4*sliderA.Value()) +")" + ", indique la valeur de y au sommet de la courbe";
	});
	
	
}


/*Function pour animer la pente avec les sliders.
 */
	function animerPente(){
    if (typeof p1 != 'undefined') {
			board.removeObject(p1);
		}
		if (typeof p2 != 'undefined') {
			board.removeObject(p2);
		}
		if (typeof p3 != 'undefined') {
			board.removeObject(p3);
		}
		if (typeof anim1 != 'undefined') {
			board.removeObject(anim1);
		}
		if (typeof anim2 != 'undefined') {
			board.removeObject(anim2);
		}
		if (typeof bullePente != 'undefined') {
			board.removeObject(bullePente);
		}

   if(sliderA.Value() == 0){
		 p1=board.create('point', [0, (sliderB.Value()+sliderC.Value())], {style:6, name:'a', trace:true,color: 'green',strokeWidth:0.1,visible: false});
		 p2=board.create('point', [1, (sliderB.Value()+sliderC.Value())], {style:6, name:'b', trace:true,color: 'green',strokeWidth:0.1,visible: false});
		 p3=board.create('point', [0, (sliderC.Value()+0)], {style:6, name:'o', trace:true,color: 'green',strokeWidth:0.1,visible: false});

		 // afficher la bulle d'information en utilisation la librairie MathJax pour afficher les fractions
		 var bullePente= board.create('text', [-2, 0, " La pente = " + sliderB.Value()],
		 {anchor: p3,strokeColor: "#fff", cssClass:'mytext'});

	     anim1=p3.moveTo([p3.X(), p1.Y()], 1500);
	     anim2=p1.moveTo([1, (sliderB.Value()+sliderC.Value())], 1500);


	   	// Points supplémentaires à rattacher au texte dynamique affiché dans les bulles externes
	     point1=board.create('point', [0, (sliderB.Value()+sliderC.Value())], {style:6,trace:false,strokeWidth:0.1,visible: false});
		 point2=board.create('point', [1, (sliderB.Value()+sliderC.Value())], {style:6,  trace:false,strokeWidth:0.1,visible: false});
		 point3=board.create('point', [0, (sliderC.Value()+0)], {style:6,trace:false,strokeWidth:0.1,visible: false});


	   // affichage de l'équation dans la bulle informative. Elle est dynamique, elle se modifie si on bouge la courbe
	if(sliderC.Value() <0){
	   	board.on('update', function(){
		document.getElementById('equationEntree').innerHTML= "y = "+sliderB.Value()
		+ 'x + (' + sliderC.Value()+')';
	});
	   }else {
	   	board.on('update', function(){
		document.getElementById('equationEntree').innerHTML= "y = "+sliderB.Value()
		+ 'x + ' + sliderC.Value();
	});
	   	
	   }

	// Affichage de deux points dynamiques qui servent à illustrer comment calculer la pente à partir de 2 points de la courbe
	board.on('update', function(){
		document.getElementById('penteDeuxPoints').innerHTML= "P1(" +point2.X().toFixed(2)+"," + point2.Y().toFixed(2)+")"+ " et P2("+ point3.X().toFixed(2)+","+ point3.Y().toFixed(2)+")";
	});

	// affichage dynamique de la pente de l'équation en se basant uniquement sur le paramètre a de l'équation entrée ou modifiée.
	board.on('update', function(){
		document.getElementById('penteEquation').innerHTML= "La pente = " + sliderB.Value();
	});

	// Affichage dynamique du numérateur de la formule de calcul de la pente à partir de deux points
	// si le point 2 est négatif, le mettre entre parenthèses: ex. 5 - (-2)
	board.on('update', function(){
		if(p3.Y() < 0){
			document.getElementById('numerateur').innerHTML= point2.Y().toFixed()+"-("+point3.Y().toFixed(2)+")";
		}else{
			document.getElementById('numerateur').innerHTML= point2.Y().toFixed()+"-"+point3.Y().toFixed(2);
		}
	});

	// Affichage dynamique du dénominateur de la formule de calcul de la pente à partir de deux points
	//si le point 2 est négatif, le mettre entre parenthèses: ex. 5 - (-2)

	board.on('update', function(){
		if(p3.X() < 0){
			document.getElementById('denominateur').innerHTML= point2.X().toFixed()+"-(" + point3.X().toFixed(2)+")";
		}else{
			document.getElementById('denominateur').innerHTML= point2.X().toFixed()+"-"+point3.X().toFixed(2);
		}
	});


 } else {
 	  var bullePente= board.create('text', [-2, 0, "&nbsp&nbspÉquation quadratique: aucune pente! Le curseur A doit être à zéro.&nbsp&nbsp"],
	  {anchor: p3,strokeColor: "#fff", cssClass:'mytext'});
 }

 board.on('move', function () {             //function pour detruire les objects on hover sur le graph
		if (typeof p1 != 'undefined') {
			board.removeObject(p1);
		}
		if (typeof p2 != 'undefined') {
			board.removeObject(p2);
		}
		if (typeof p3 != 'undefined') {
			board.removeObject(p3);
		}
		if (typeof anim1 != 'undefined') {
			board.removeObject(anim1);
		}
		if (typeof anim2 != 'undefined') {
			board.removeObject(anim2);
		}
		if (typeof bullePente != 'undefined') {
			board.removeObject(bullePente);
		}
	});
}

/*
 * fonction qui affiche dans une bulle mobile l'ordonnée à l'origine de l'équation
 * @param : aucun
 * @return: aucun
 */

function afficherOrdonnee(){
  if (typeof ord != "undefined") { //si l'object existe on le detruis.
		board.removeObject(ord);
		board.removeObject(bulleOrdonnee);
	}
 	ord = board.create('point', [0,sliderC.Value()], {style:6, fixed:true});
	ord.setAttribute({strokeColor: 'black', fillColor: 'red', size: 4});
     bulleOrdonnee= board.create('text', [-2, 0, "ordonnee= " + sliderC.Value()],
	{anchor: ord,strokeColor: "#fff", cssClass:'mytext', visible:true});
	bulleOrdonnee.on('move', function () {          //function pour cacher le bulles avec un event.
		ord.setAttribute({visible:false});
		bulleOrdonnee.setAttribute({visible:false});
	});

	if(sliderA.Value()==0){
		if(sliderC.Value() < 0){
			document.getElementById('ordonneeEquation').innerHTML= "y = "+sliderB.Value()
		+ 'x + (' + sliderC.Value()+ ')';
			board.on('update', function(){
		document.getElementById('ordonneeEquation').innerHTML= "y = "+sliderB.Value()
		+ 'x + (' + sliderC.Value()+ ')';
	});
	}else{
		document.getElementById('ordonneeEquation').innerHTML= "y = "+sliderB.Value()
		+ 'x + ' + sliderC.Value();
		
		board.on('update', function(){
		document.getElementById('ordonneeEquation').innerHTML= "y = "+sliderB.Value()
		+ 'x + ' + sliderC.Value();
	});
	}
	
	board.on('update', function(){
		document.getElementById('ordonneeFormule').innerHTML= "Ordonnée = "+sliderC.Value();
	});

}else if(sliderA.Value()!=0){
	if(sliderB.Value()< 0 && sliderC.Value() < 0){
		document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+sliderA.Value()
		+ 'x² +(' + sliderB.Value()+ ')' + '+('+ sliderC.Value()+ ')';
		
				board.on('update', function(){
		document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+sliderA.Value()
		+ 'x² +(' + sliderB.Value()+ ')' + '+('+ sliderC.Value()+ ')';
	});
			}else if(sliderB.Value()< 0 && sliderC.Value() >= 0 ){
				
				document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+sliderA.Value()
		+ 'x² +(' + sliderB.Value()+')' + "+ " + sliderC.Value();
		
				board.on('update', function(){
		document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+sliderA.Value()
		+ 'x² +(' + sliderB.Value()+')' + "+ " + sliderC.Value();
	});
			} else if(sliderC.Value()< 0 && sliderB.Value() >= 0){
				
				document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+sliderA.Value()
		+ 'x² + ' + sliderB.Value()+ "+(" + sliderC.Value()+')';
		
				board.on('update', function(){
		document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+sliderA.Value()
		+ 'x² + ' + sliderB.Value()+ "+(" + sliderC.Value()+')';
	});
			}else if(sliderC.Value() >= 0 && sliderB.Value() >= 0){
				document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+sliderA.Value()
		+ 'x² + ' + sliderB.Value() + sliderC.Value();
		
				board.on('update', function(){
		document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+sliderA.Value()
		+ 'x² + ' + sliderB.Value() + sliderC.Value();
	});
			}
			
	document.getElementById('ordonneeFormuleQuadratique').innerHTML= "Ordonnée = "+sliderC.Value();

	board.on('update', function(){
		document.getElementById('ordonneeFormuleQuadratique').innerHTML= "Ordonnée = "+sliderC.Value();
	});


 }
 }




function axeDeSymetrie(){
	if (typeof pointBas != "undefined") { //si l'object existe on le detruis.
		board.removeObject(pointBas);
	}
	if (typeof pointHaut != "undefined") {
		board.removeObject(pointHaut);
	}
	if (typeof li2 != "undefined") {
		board.removeObject(li2);
	}
	var x = -sliderB.Value()/(2*sliderA.Value());//-b/2a
	var y = (4*sliderA.Value()*sliderC.Value()-(sliderB.Value()*sliderB.Value()))/(4*sliderA.Value()); //(4ac-b²)/4a
	pointBas= board.create('point', [x, (y-6)], {style:6, name:"x= " + x.toFixed(2)});// point sommet
	pointBas.setAttribute({strokeColor: 'black', fillColor: 'red', size: 4});
	pointHaut= board.create('point', [x, (y +10)], {style:6, name:"x= " + x.toFixed(2)});
	pointHaut.setAttribute({strokeColor: 'black', fillColor: 'red', size: 4});
	var li2 = board.create('line',[pointBas,pointHaut],
	{straightFirst:false, straightLast:false, strokeWidth:2, dash:2});
	
	document.getElementById('axeDeSymetrie').innerHTML= "x= "+x.toFixed(2);
	board.on('update', function(){
		document.getElementById('axeDeSymetrie').innerHTML= "x= "+x.toFixed(2);
	});

	board.on('move', function () {
		if (typeof pointBas != "undefined") { //si l'object existe on le detruis.
			board.removeObject(pointBas);
		}
		if (typeof pointHaut != "undefined") {
			board.removeObject(pointHaut);
		}
		if (typeof li2 != "undefined") {
			board.removeObject(li2);
		}
	});
}

function afficherLesZeros(){
	if (typeof ordZer != "undefined") { //si l'object existe on le detruis.
		board.removeObject(ordZer);
	}
	if (typeof zero1 != "undefined") {
		board.removeObject(zero1);
	}
	if (typeof zero2 != "undefined") {
		board.removeObject(zero2);
	}

	ordZer = board.create('point', [0,(sliderC.Value())], {style:6, name:'', fixed:true});
	var discriminant= sliderB.Value()*sliderB.Value() - (4 * sliderA.Value() * sliderC.Value());
	var valDiscriminant= Math.sqrt(discriminant);
	if (discriminant > 0){
		var premierZero= ((- sliderB.Value() + valDiscriminant)/(2*sliderA.Value())).toFixed(2);
		var deuxiemeZero= ((- sliderB.Value() - valDiscriminant)/(2*sliderA.Value())).toFixed(2);

		zero1 = board.create('point', [premierZero,0], {style:6, name: premierZero, fixed:true});
		zero2 = board.create('point', [deuxiemeZero,0], {style:6, name:deuxiemeZero, fixed:true});
		
		// Afficher les 2 zéros
		board.on('update', function(){
		document.getElementById('lesZeros').innerHTML= "Les zéros sont: " + premierZero + " et " + deuxiemeZero;
	});
	
	} else if(discriminant < 0){
		var bulleAucuneSolution= board.create('text', [-2, 0, " L'équation n'a aucune solution "],
		{anchor: ordZer,strokeColor: "#fff", cssClass:'mytext'});    //  équation test: x²- 3x+4
		
		// Afficher que l'équation n'a pas de zéros
		board.on('update', function(){
		document.getElementById('lesZeros').innerHTML= "L'équation n'a pas de zéros";
	});
	
	}else if(discriminant == 0){
		var seulZero= -sliderB.Value()/(2*sliderA.Value());
		// Afficher le seul zéro de l'équation
		board.on('update', function(){
		document.getElementById('lesZeros').innerHTML= "Il y a un seul zéro: "+ seulZero;
	});
	
	}
	
	/* injecter les valeurs des paramètres a, b et c dans la formule quadratique pour
	 * qu'ils s'affichent de façon dynamique
	 */
	
	board.on('update', function(){
		document.getElementById('paraB').innerHTML= sliderB.Value();
	});
	board.on('update', function(){
		document.getElementById('paraB2').innerHTML= sliderB.Value();
	});
	board.on('update', function(){
		document.getElementById('paraA').innerHTML= "(" + sliderA.Value()+ ")";
		});
	board.on('update', function(){
		document.getElementById('paraC').innerHTML= "(" + sliderC.Value()+ ")";
	});
	board.on('update', function(){
		document.getElementById('paraA2').innerHTML= "(" + sliderA.Value()+ ")";
	});

	board.on('move', function () {             //function pour cacher le bulles avec un event.
		if (typeof ordZer != "undefined") { //si l'object existe on le detruis.
			ordZer.setAttribute({visible:false});
		}
		if (typeof zero1 != "undefined") {
			zero1.setAttribute({visible:false});
		}
		if (typeof zero2 != "undefined") {
			zero2.setAttribute({visible:false});
		}
		if (typeof bulleAucuneSolution != "undefined") {
			bulleAucuneSolution.setAttribute({visible:false});
		}
	});
}

function resetGraph(){
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
	trace();
}

/*La function recharge la page avec location.reload() aprés avoir mis la table à 0.*/
function erase () {
    document.getElementById('btnrnd').disabled = false;
		document.getElementById('btnresetter').disabled=true;//activation du bouton Reset
		document.getElementById('btnpente').disabled=true;	//activation du bouton Pente
		document.getElementById('btnAfficOrd').disabled=true;//activation du bouton Ordonnee
		document.getElementById('btnAxeStm').disabled=true;//activation du bouton  Axe symétrie
		document.getElementById('btnAfficZero').disabled=true;
		document.getElementById('canonique').disabled=true;
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
	location.reload();
}
