var board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
var ordonnee;
var pente;
var point1, point2, p3, point3;
var exp;
var typeEquation;
var enterPr = false;

function addCurve(board, func, atts){
	var f= board.create('functiongraph', [func], atts,{fixed: false});
	return f;
}

/*Function pour la soummision avec Enter*/
$(document).keypress(function(e) {
	if(e.which == 13) {
		 if (enterPr == false) {
			enterPr = true;
			document.getElementById('btnrnd').disabled = true;
			traceAvecP();
		} else {
			alert("S.V.P. utilisez Effacer après la première soumission.");
		}
	}
});

/*Function pour tracer la courbe avec des points mouvables*/
function traceAvecP(){
	var equation = document.getElementById('input').value;
	equation=equation.replace(/,/g,'.'); // rempalce les "," par "."
	var erreur=validation(equation);
	document.getElementById('btnresetter').disabled=false;//activation du bouton Reset
	if(erreur<0){
		pente= parametreA(tokenize(equation));
		ordonnee= parametreB(tokenize(equation));
		exp = exposant(tokenize(equation));
		zoomPlan(exp,pente ,ordonnee );
		if(exp == 0){
			typeEquation=0;
			document.getElementById('btnpente').disabled=false;	//activation du bouton Pente
			document.getElementById('btnAfficOrd').disabled=false;//activation du bouton Ordonnee
			pointLineaire();
		}
		else if( exp != 0){
			typeEquation=1;
			document.getElementById('btnAfficOrd').disabled=false;//activation du bouton Ordonnee
			document.getElementById('btnAxeStm').disabled=false;//activation du bouton  Axe symétrie
			document.getElementById('btnAfficZero').disabled=false;//activation du bouton Les zéros
			pointQuadratique()
		}
		
		// affichage dynamique de l'ordonnée dans la bulle externe
		if (typeEquation==1){
		board.on('update', function(){
		document.getElementById('ordonneeEquationQuadratique').innerHTML= "y = "+dynamiqueA()
		+ 'x + ' + dynamiqueB()+ dynamiqueC();
	});

	board.on('update', function(){
		document.getElementById('ordonneeFormuleQuadratique').innerHTML= "Ordonnée = "+dynamiqueC();
	});
	}
	}else{ // affichage des erreurs
		var input=document.getElementById('input');
		input.selectionStart = erreur;
		input.selectionEnd=++erreur;
		input.focus();
	}
}

/*Cette function trace une droite. On trace la droite en utilisent les deux points
*
*/
function pointLineaire(){
	point1 = board.create('point', [1,(ordonnee+pente)], {style:6, name:'p1'});

	point2 = board.create('point', [(ordonnee/-pente), 0], {style:6, name:'p2'});

	point3 = board.create('point', [0,(ordonnee)], {visible: false, style:6});

	var ligne = board.create('line', [point1,point2]);
	// affichage dynamique de l'équation à l'extérieur du graphe
	board.on('update', function(){
		document.getElementById('equationGraph').innerHTML= "y = "+dynamiqueA()
		+ 'x + ' + dynamiqueB();
	});
	// affichage de l'équation dans la bulle informative. Elle est dynamique, elle se modifie si on bouge la courbe
	board.on('update', function(){
		document.getElementById('equationEntree').innerHTML= "y = "+dynamiqueA()
		+ 'x + ' + dynamiqueB();
	});

	// Affichage de deux points dynamiques qui servent à illustrer comment calculer la pente à partir de 2 points de la courbe
	board.on('update', function(){
		document.getElementById('penteDeuxPoints').innerHTML= "p1(" +point1.X().toFixed(2)+"," + point1.Y().toFixed(2)+")"+ " et p2("+ point2.X().toFixed(2)+","+ point2.Y().toFixed(2)+")";
	});

	// affichage dynamique de la pente de l'équation en se basant uniquement sur le paramètre a de l'équation entrée ou modifiée.
	board.on('update', function(){
		document.getElementById('penteEquation').innerHTML= "La pente = " + dynamiqueA();
	});

	// Affichage dynamique du numérateur de la formule de calcul de la pente à partir de deux points
	// si le point 2 est négatif, le mettre entre parenthèses: ex. 5 - (-2)
	board.on('update', function(){
		if(point2.Y() < 0){
			document.getElementById('numerateur').innerHTML= point1.Y().toFixed()+"-("+point2.Y().toFixed(2)+")";
		}else{
			document.getElementById('numerateur').innerHTML= point1.Y().toFixed()+"-"+point2.Y().toFixed(2);
		}
	});

	// Affichage dynamique du dénominateur de la formule de calcul de la pente à partir de deux points
	//si le point 2 est négatif, le mettre entre parenthèses: ex. 5 - (-2)
	
	board.on('update', function(){
		if(point2.X() < 0){
			document.getElementById('denominateur').innerHTML= point1.X().toFixed()+"-(" + point2.X().toFixed(2)+")";
		}else{
			document.getElementById('denominateur').innerHTML= point1.X().toFixed()+"-"+point2.X().toFixed(2);
		}
	});

	// CALCUL ET AFFICHAGE DYNAMIQUE DE L'ORDONNÉE À L'ORIGINE
	if(typeEquation==0){
	board.on('update', function(){
		document.getElementById('ordonneeEquation').innerHTML= "y = "+dynamiqueA()
		+ 'x + ' + dynamiqueB();
	});

	board.on('update', function(){
		document.getElementById('ordonneeFormule').innerHTML= "Ordonnée = "+dynamiqueB();
	});
	}
	


	/*
	* Code pour représenter la pente de l'équation linéaire sous forme de triangle
	* se déplaçant le long de la ligne.
	* suppression du glider qui ne fait que créer un point de plus sur la courbe. Il peut porter à confusion.
	*  On attache le triangle à l'un des deux points définis en haut, ce qui rend le triangle plus visible.
	*/
	//triangle= board.create('slopetriangle', [ligne, point1]);

	affichageEquationLineairePoint(point1,point2);
	document.getElementById("equationGraph").innerHTML= " Équation linéaire: y = " + pente + "x" + " + " + ordonnee;
}

/*
* Cette fonction trace une courbe en utilisant les trois paramètres de l'équation d'entrée.
*/
function pointQuadratique() {
	var hPoint = -pente/(2*exp);//-b/2a
	var yPoint = (4*exp*ordonnee-(pente*pente))/(4*exp); //(4ac-b²)/4a
	var depP2= (exp*(hPoint+1)*(hPoint+1))+(pente*(hPoint+1))+ordonnee;// nouveau point de depart pour "p2"
	point1 = board.create('point', [hPoint, yPoint], {style:6, name:'p1'});// point sommet
	point2 = board.create('point', [(hPoint+1), depP2], {style:6, name:'p2'}); //le "p2" est placer sur la courbe à 1 de distance par rapport au sommet(ceci évite les conflits 0/0)
	var text = String.fromCharCode(178);
	document.getElementById("equationGraph").innerHTML= " Équation quadratique: y = ax"+text+ " + bx + c";
	var ligne = board.create('functiongraph', function(x) {
		var ax = point1.X(),
		ay = point1.Y(),
		bx = point2.X(),
		by = point2.Y(),
		a = (by - ay) / ( (bx - ax) * (bx - ax) );
		return a * (x - ax) * (x - ax) + ay;
	}, {fixed: false});
	affichageEquationQuadratiquePoint(point1,point2);
	ligne.addParents([point1, point2]);
}

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
// Fonction qui affiche l'ordonnée à l'origine d'une équation quadratique.
// L'affichage est placée dans une bulle

function afficherOrdonnee(){
  if (typeof ord != "undefined") { //si l'object existe on le detruis.
		board.removeObject(ord);
		board.removeObject(bulleOrdonnee);
	}
	// Afficher l'ordonnée à l'origine si l'équation est linéaire
	if (typeEquation==0){
	ord = board.create('point', [0,dynamiqueB()], {style:6, fixed:true});
  bulleOrdonnee= board.create('text', [-2, 0, "ordonnee= " + dynamiqueB()],
	{anchor: ord,strokeColor: "#fff", cssClass:'mytext', visible:true});
	
	// Afficher l'ordonnée à l'origine si l'équation est quadratique'
 }else if(typeEquation==1){
 	ord = board.create('point', [0,dynamiqueC()], {style:6, fixed:true});
  bulleOrdonnee= board.create('text', [-2, 0, "ordonnee= " + dynamiqueC()],
	{anchor: ord,strokeColor: "#fff", cssClass:'mytext', visible:true});
 }
	bulleOrdonnee.on('move', function () {          //function pour cacher le bulles avec un event.
		ord.setAttribute({visible:false});
		bulleOrdonnee.setAttribute({visible:false});
	});
}

// Fonction pour afficher l'axe de symétrie.
// Pour le moment on se contentera d'afficher l'équation de l'axe x= ...   à côté du point et sans bulle
// une fois qu'on a trouvé un affichage approprié de la bulle, on remettra le code qui est commenté ci-bas
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
	var x = -dynamiqueB()/(2*dynamiqueA());//-b/2a
	var y = (4*dynamiqueA()*dynamiqueC()-(dynamiqueB()*dynamiqueB()))/(4*dynamiqueA()); //(4ac-b²)/4a
	pointBas= board.create('point', [x, (y-6)], {style:6, name:"x= " + x.toFixed(2)});// point sommet
	pointHaut= board.create('point', [x, (y +10)], {style:6, name:"x= " + x.toFixed(2)});// point sommet
	var li2 = board.create('line',[pointBas,pointHaut],
	{straightFirst:false, straightLast:false, strokeWidth:2, dash:2});
	
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
	
	
		
	
	

	//var bulleAxeBas= board.create('text', [-2, 0, "x= " + x.toFixed(2) ],
	//{anchor: pointBas,strokeColor: "#fff", cssClass:'mytext'});
	//var bulleAxeHaut= board.create('text', [-2, 0, "x= " + x.toFixed(2) ],
	//{anchor: pointHaut,strokeColor: "#fff", cssClass:'mytext'});
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

	ordZer = board.create('point', [0,(dynamiqueC())], {style:6, name:'', fixed:true});
	var discriminant= dynamiqueB()*dynamiqueB() - (4 * dynamiqueA() * dynamiqueC());
	var valDiscriminant= Math.sqrt(discriminant);
	if (discriminant >= 0){
		var premierZero= ((- dynamiqueB() + valDiscriminant)/(2*dynamiqueA())).toFixed(2);
		var deuxiemeZero= ((- dynamiqueB() - valDiscriminant)/(2*dynamiqueA())).toFixed(2);

		zero1 = board.create('point', [premierZero,0], {style:6, name: premierZero, fixed:true});
		zero2 = board.create('point', [deuxiemeZero,0], {style:6, name:deuxiemeZero, fixed:true});
	} else if(discriminant < 0){
		var bulleAucuneSolution= board.create('text', [-2, 0, " L'équation n'a aucune solution "],
		{anchor: ordZer,strokeColor: "#fff", cssClass:'mytext'});    //  équation test: x²- 3x+4
	}
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

/* La fonction animerPente appelle la fonction animerVariationEnY qui, à son tour, fait appel à la fonction animerVariationEnX
* Le tout pour animer la pente d'une équation linéaire.
*/

function animerPente(){
	return animerVariationEnY();
}

/* animerVariationEnY: l'animation prend comme point de départ l'ordonnée à l'origine
*  et s'arrêtera au point formé par l'ordonnée+pente
*/

animerVariationEnY= function (){
	if(exp ==0){
		//board.options.text.useMathJax = true;
		p1= board.create('point', [0, (ordonnee+pente)], {style:6, name:'a', trace:true,color: 'green',strokeWidth:0.1,visible: false});
		p2= board.create('point', [1, (ordonnee+pente)], {style:6, name:'b', trace:true,color: 'green',strokeWidth:0.1,visible: false});
		p3= board.create('point', [0, (ordonnee+0)], {style:6, name:'o', trace:true,color: 'green',strokeWidth:0.1,visible: false});

		// afficher la bulle d'information en utilisation la librairie MathJax pour afficher les fractions
		var bullePente= board.create('text', [-2, 0, " La pente = " + pente],
		{anchor: p3,strokeColor: "#fff", cssClass:'mytext'});
		bullePente.on('move', function () {             //function pour cacher le bulles avec un event.
			bullePente.setAttribute({visible:false});
			ord.setAttribute({visible:false});
		});
		bullePente.on('down', function()  {             //function pour cacher le bulles avec un event.
			ord.update();
			bullePente.update();
		});
		//var bullePente= board.create('text',[-2, 0,'$\\\\dfrac {variation sur Y}{Variation sur X} $'],
		//{anchor: p3,strokeColor: "#fff", cssClass:'mytext'});
		// function() {0
		//return '$$ \frac ab $$';}],

		return p3.moveTo([p3.X(), p1.Y()], 2500, {callback: animerVariationEnX, visible: false});
	}else if (exp != 0 ){
		var bullePente= board.create('text', [-2, 0, "Équation quadratique: aucune pente"],
		{anchor: p3,strokeColor: "#fff", cssClass:'mytext'});
	}
};

/* animerVariationEnX: Pour le moment le point de départ de la variation en X est 1
* car dans l'équation 3x+2 par exemple, 3x <=> 3/1x. Il faudra tenir compte bien sûr de cas
* lorsque la pente est fractionnaire.
* l'animation s'arrêtera ici à la valeur de ordonnée+pente
*/
animerVariationEnX= function(){
	p1= board.create('point', [0, (ordonnee+pente)], {style:6, name:'a', trace:true,color: 'green',strokeWidth:0.1,visible: false});
	p2= board.create('point', [1, (ordonnee+pente)], {style:6, name:'b', trace:true,color: 'green',strokeWidth:0.1,visible: false});
	p3= board.create('point', [0, (ordonnee+0)], {style:6, name:'o', trace:true,color: 'green',strokeWidth:0.1,visible: false});
  return p1.moveTo([1, (ordonnee+pente)], 2500);
};

function clearAll(board){
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, showCopyright: false});
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
			//alert("La pente "+ tok[i].match(/^-?[^x\+]+$/));
			ordonnee += Number(tok[i].match(/^-?[^x\+]+$/));
		}
	}
	return ordonnee;
};

/*
* fonction qui forme le String formant l'équation linéaire y=ax+b
* Prend en paramètre 2 points
* le parametre 'a', correspondant à la pente, est former grâce à l'équation usuelle (y2-y1/x2-x1) (1)
* le parametre 'b' ce resout de en en isolant le b de l'équation linéraire b=y-ax
* Puisque nous devons garder les points pour maintenir le dynamisme de la fonction et puisque a=(y2-y1/x2-x1)
* nous obtenons  b=y1-(y2-y1/x2-x1)*x1 (2)
*/
function affichageEquationLineairePoint(p,t){
	var stringEquation= board.create('text', [4,-1, function(){return 'y= '+dynamiqueA() //(1)
	+ 'x +' + dynamiqueB()}])//(2)
};

/*
* fonction qui forme le String formant l'équation quadratique y=ax²+bx+c
* Prend en paramètre 2 points :
* Point 1 = sommet de la courbe
* Point 2 = point quelconque de la courbe
* Ici la courbe est obtenue grace à l'equation canonique : y= a(x-h)²+k
* le parametre 'a', correspondant à l'ouverture , est former grâce à l'equation a=(y2-y1/(x2-x1)²) (1)
* le parametre 'b' ce resout en isolant b de l'equation  h=-b/2a => b=-2ah =>b=-2*(y2-y1/(x2-x1)²)*h  (2)
* Le parametre 'c' ce resout en isolant c de l'equation k=4ac-b²/4a=> c=4ak-b²/4a (3)
* => c=((4*(y2-y1/(x2-x1)²)*k)-(-2*(y2-y1/(x2-x1)²)*h)²)/(4*(y2-y1/(x2-x1)²)) (3 suite) en remplaçant b et a
* Sachant que  h et k corresponde au coordonnée du sommet on peu remplacer respectivement h par x1 et k par y1
* clarification: toutes les équations mises au carré doivent etre ecritent au long (ex: (x1-x2)²=> (x1-x2)*(x1-x2))
*/
function affichageEquationQuadratiquePoint (p1,p2){
	var stringEquation= board.create('text', [4,-1,function(){return 'y= '+ dynamiqueA()//(1)
	+ 'x² +' + dynamiqueB() //(2)
	+ 'x +' + dynamiqueC()}]);	// affichage fonction avec les points


	// affichage dynamique de l'équation quadratique dans le DOM
	board.on('update', function(){
		document.getElementById('equationGraph').innerHTML= 'y= '+ dynamiqueA()//(1)
		+ 'x² +' + dynamiqueB() //(2)
		+ 'x +' + dynamiqueC();	//
	});
}
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
// un nombre avec  plus de un '.' (ex:23.43.68)
// un nombre sans chiffre avant la virgule (ex:.75)
function valRepetition(equation){
	var evaluation = equation.search(/xx|x²x²|x[0-9]+|x²[0-9]+|[0-9]+\.[0-9]+\.|[^0-9]\.[0-9]+|^\./);
	if(evaluation>=0){
		alert("nous avons detecté une anomalie dans l'équation il y a repetition ");
	}
	return evaluation;
}

// retourne le parametre 'a' dynamiquement avec les changements de la courbe
// pour  ax+b (quand typeEquation==0):
// le parametre 'a', correspondant à la pente, est former grâce à l'équation usuelle (y2-y1/x2-x1)
// Pour ax²+bx+c(quand type Equation==1):
// la courbe utilise la fonction canonique  y= a(x-h)²+k
// le parametre 'a', correspondant à l'ouverture , est former grâce à l'equation a=(y2-y1/(x2-x1)²)
function dynamiqueA(){
	var valA;
	if(typeEquation==0){
		valA= ((point1.Y()-point2.Y())/(point1.X()-point2.X())).toFixed(2);
	}
	else if(typeEquation==1){
		valA=((point2.Y() - point1.Y()) / ( (point2.X() - point1.X()) * (point2.X() - point1.X()))).toFixed(2);
	}
	return valA;
}
// return le parametre 'b' dynamiquement avec les changements de la courbe
// // pour  ax+b (quand typeEquation==0):
// le parametre 'b' ce resout de en en isolant le b de l'équation linéraire b=y-ax
// Puisque nous devons garder les points pour maintenir le dynamisme de la fonction et puisque a=(y2-y1/x2-x1)
// nous obtenons  b=y1-(y2-y1/x2-x1)*x1
// Pour ax²+bx+c(quand type Equation==1):
// la courbe utilise la forme canonique  y= a(x-h)²+k
// le parametre 'b' ce resout en isolant b de l'equation  h=-b/2a => b=-2ah =>b=-2*(y2-y1/(x2-x1)²)*h
// Sachant que  h et k corresponde au coordonnée du sommet on peu remplacer respectivement h par x1 et k par y1
function dynamiqueB(){
	var valB;
	if(typeEquation==0){
		valB= (point1.Y()-(point1.X()*((point1.Y()-point2.Y())/(point1.X()-point2.X())))).toFixed(2);
	}
	else if(typeEquation==1){
		valB=(-2*((point2.Y() - point1.Y()) / ( (point2.X() - point1.X()) * (point2.X() - point1.X()) ))*point1.X()).toFixed(2);
	}
	return valB;
}

// return le parametre 'c' dynamiquement avec les changements de la courbe
// peu etre utile pour extraire 'c' des fonctions  ax²+bx+c:
// la courbe utilise la forme canonique  y= a(x-h)²+k
// Le parametre 'c' ce resout en isolant c de l'equation k=4ac-b²/4a=> c=4ak-b²/4a
// en remplaçant b par (-2*(y2-y1/(x2-x1)²)*h) et a par (y2-y1/(x2-x1)²)
// on obtient c=((4*(y2-y1/(x2-x1)²)*k)-(-2*(y2-y1/(x2-x1)²)*h)²)/(4*(y2-y1/(x2-x1)²))
// Sachant que  h et k corresponde au coordonnée du sommet on peu remplacer respectivement h par x1 et k par y1
function dynamiqueC(){
	var valC;
	if(typeEquation==1){
		valC=((point1.Y()*4*((point2.Y() - point1.Y()) / ( (point2.X() - point1.X()) * (point2.X() - point1.X())))+((-2*((point2.Y() - point1.Y())
		/ ( (point2.X() - point1.X()) * (point2.X() - point1.X()) ))*point1.X())*(-2*((point2.Y() - point1.Y()) )
		/ ( (point2.X() - point1.X()) * (point2.X() - point1.X()) ))*point1.X())) / (4*((point2.Y() - point1.Y()) /
		( (point2.X() - point1.X()) * (point2.X() - point1.X()) )))).toFixed(2);
	}
	return valC;
}

function resetGraph(){
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
	traceAvecP();
}

/*La function recharge la page avec location.reload() aprés avoir mis la table a 0*/
function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
	location.reload();
}
