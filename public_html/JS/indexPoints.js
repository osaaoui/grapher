var board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8, showCopyright: false});
var ordonnee;
var pente;
var p1, p2, p3;
var exp;
function addCurve(board, func, atts){
	var f= board.create('functiongraph', [func], atts,{fixed: false});
	return f;
}

/*Function pour la soummision avec Enter*/
$(document).keypress(function(e) {
    if(e.which == 13) {
        traceAvecP();
    }
});

function traceAvecP(){
	var equation = document.getElementById('input').value;
        equation=equation.replace(/,/g,'.'); // rempalce les "," par "."
		var erreur=validation(equation);
	if(erreur<0){
		pente= parametreA(tokenize(equation));
		ordonnee= parametreB(tokenize(equation));
		exp = exposant(tokenize(equation));
	
		if(exp == 0){
		pointLineaire();
		}
		else if( exp != 0){
		pointQuadratique()
		}
	}else{ // affichage des erreurs
		var input=document.getElementById('input');
		input.selectionStart = erreur;
		input.selectionEnd=++erreur;
		input.focus();
	}
}
/*Cette premiere partie est pour une ligne. On trace la ligne en utilisent les deux points
 *La duexieme partie trace une courbe, ou sommet est le sommet de la curbe et p2 est un point
 *qui est situe a +1 de -b/2a (x) et la valeur de y est l'ordonnee.
*/
function pointLineaire(){
	var point1 = board.create('point', [1,(ordonnee+pente)], {style:6, name:'p1'});
	var point2 = board.create('point', [(ordonnee/-pente), 0], {style:6, name:'p2'});
	var ligne = board.create('line', [point1,point2]);
	// affichage dynamique de l'équation
	board.on('update', function(){
	document.getElementById('equationGraph').innerHTML= "y= "+((point1.Y()-point2.Y())/(point1.X()-point2.X())).toFixed(2)
	+ 'x +' + (point1.Y()-(point1.X()*((point1.Y()-point2.Y())/(point1.X()-point2.X())))).toFixed(2);
	});
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

function pointQuadratique() {
	var hPoint = -pente/(2*exp);//-b/2a
	var yPoint = (4*exp*ordonnee-(pente*pente))/(4*exp); //(4ac-b²)/4a
	var depP2= (exp*(hPoint+1)*(hPoint+1))+(pente*(hPoint+1))+ordonnee;// nouveau point de depart pour "p2"
	var sommet = board.create('point', [hPoint, yPoint], {style:6, name:'p1'});// point sommet
	var p2 = board.create('point', [(hPoint+1), depP2], {style:6, name:'p2'}); //le "p2" est placer sur la courbe à 1 de distance par rapport au sommet(ceci évite les conflits 0/0)
	var text = String.fromCharCode(178);
	document.getElementById("equationGraph").innerHTML= " Équation quadratique: y = ax"+text+ " + bx + c";
	var ligne = board.create('functiongraph', function(x) {
		var ax = sommet.X(),
			ay = sommet.Y(),
			bx = p2.X(),
			by = p2.Y(),
		    a = (by - ay) / ( (bx - ax) * (bx - ax) );
			return a * (x - ax) * (x - ax) + ay;
		}, {fixed: false});
		affichageEquationQuadratiquePoint(sommet,p2);
		ligne.addParents([sommet, p2]);


}


// Fonction qui affiche l'ordonnée à l'origine d'une équation quadratique.
// L'affichage est placée dans une bulle

function afficherOrdonnee(){
	ord = board.create('point', [0,(ordonnee)], {style:6, name:'', fixed:true});
	var bulleOrdonnee= board.create('text', [-2, 0, "ordonnee= " + ordonnee],
		{anchor: ord,strokeColor: "#fff", cssClass:'mytext', visible:true});
		bulleOrdonnee.on('move', function () {             //function pour cacher le bulles avec un event.
           bulleOrdonnee.setAttribute({visible:false});
					 ord.setAttribute({visible:false});
    });
		bulleOrdonnee.on('down', function()  {             //function pour cacher le bulles avec un event.
           ord.update();
					 bulleOrdonnee.update();
    });
 }

// Fonction pour afficher l'axe de symétrie.
// Pour le moment on se contentera d'afficher l'équation de l'axe x= ...   à côté du point et sans bulle
// une fois qu'on a trouvé un affichage approprié de la bulle, on remettra le code qui est commenté ci-bas
function axeDeSymetrie(){
	var x = -pente/(2*exp);//-b/2a
	var y = (4*exp*ordonnee-(pente*pente))/(4*exp); //(4ac-b²)/4a
	pointBas= board.create('point', [x, (y-6)], {style:6, name:"x= " + x.toFixed(2)});// point sommet
	pointHaut= board.create('point', [x, (y +10)], {style:6, name:"x= " + x.toFixed(2)});// point sommet
	var li2 = board.create('line',[pointBas,pointHaut],
    {straightFirst:false, straightLast:false, strokeWidth:2, dash:2});

    //var bulleAxeBas= board.create('text', [-2, 0, "x= " + x.toFixed(2) ],
		//{anchor: pointBas,strokeColor: "#fff", cssClass:'mytext'});
	//var bulleAxeHaut= board.create('text', [-2, 0, "x= " + x.toFixed(2) ],
		//{anchor: pointHaut,strokeColor: "#fff", cssClass:'mytext'});
}

function afficherLesZeros(){

 var ord = board.create('point', [0,(ordonnee)], {style:6, name:'', fixed:true});
 var discriminant= pente*pente - (4 * exp * ordonnee);
 var valDiscriminant= Math.sqrt(discriminant);
 if (discriminant >= 0){
 var premierZero= ((- pente + valDiscriminant)/2*exp).toFixed(2);
 var deuxiemeZero= ((- pente - valDiscriminant)/2*exp).toFixed(2);
  var zero1 = board.create('point', [premierZero,0], {style:6, name: premierZero, fixed:true});
  var zero2 = board.create('point', [deuxiemeZero,0], {style:6, name:deuxiemeZero, fixed:true});
 } else if(discriminant < 0){
 	var bulleAucuneSolution= board.create('text', [-2, 0, "L'équation n'a aucune solution"],
		{anchor: ord,strokeColor: "#fff", cssClass:'mytext'});    //  équation test: x²- 3x+4
 }
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
	    p1= board.create('point', [0, (ordonnee+pente)], {style:6, name:'a', trace:true,color: 'green',strokeWidth:0.1});
		p2= board.create('point', [1, (ordonnee+pente)], {style:6, name:'b', trace:true,color: 'green',strokeWidth:0.1});
		p3= board.create('point', [0, (ordonnee+0)], {style:6, name:'o', trace:true,color: 'green',strokeWidth:0.1});

		// afficher la bulle d'information en utilisation la librairie MathJax pour afficher les fractions
		var bullePente= board.create('text', [-2, 0, " La pente = " + pente],
		{anchor: p3,strokeColor: "#fff", cssClass:'mytext'});
		//var bullePente= board.create('text',[-2, 0,'$\\\\dfrac {variation sur Y}{Variation sur X} $'],
		//{anchor: p3,strokeColor: "#fff", cssClass:'mytext'});
		// function() {0
        //return '$$ \frac ab $$';}],

			return p3.moveTo([p3.X(), p1.Y()], 2500, {callback: animerVariationEnX});
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
	    p1= board.create('point', [0, (ordonnee+pente)], {style:6, name:'a', trace:true,color: 'green',strokeWidth:0.1});
		p2= board.create('point', [1, (ordonnee+pente)], {style:6, name:'b', trace:true,color: 'green',strokeWidth:0.1});
		p3= board.create('point', [0, (ordonnee+0)], {style:6, name:'o', trace:true,color: 'green',strokeWidth:0.1});

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
	var stringEquation= board.create('text', [4,-1, function(){return 'y= '+((p.Y()-t.Y())/(p.X()-t.X())).toFixed(2) //(1)
	+ 'x +' + (p.Y()-(p.X()*((p.Y()-t.Y())/(p.X()-t.X())))).toFixed(2)}])//(2)
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
	var stringEquation= board.create('text', [4,-1,function(){return 'y= '+ ((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X()))).toFixed(2)//(1)
	+ 'x² +' + (-2*((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X()) ))*p1.X()).toFixed(2) //(2)
	+ 'x +' + ((p1.Y()*4*((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X())))+((-2*((p2.Y() - p1.Y())
	/ ( (p2.X() - p1.X()) * (p2.X() - p1.X()) ))*p1.X())*(-2*((p2.Y() - p1.Y()) )
	/ ( (p2.X() - p1.X()) * (p2.X() - p1.X()) ))*p1.X())) / (4*((p2.Y() - p1.Y()) /
	( (p2.X() - p1.X()) * (p2.X() - p1.X()) )))).toFixed(2)}]);	// affichage fonction avec les points


	// affichage dynamique de l'équation quadratique dans le DOM
	board.on('update', function(){
		document.getElementById('equationGraph').innerHTML= 'y= '+ ((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X()))).toFixed(2)//(1)
	+ 'x² +' + (-2*((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X()) ))*p1.X()).toFixed(2) //(2)
	+ 'x +' + ((p1.Y()*4*((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X())))+((-2*((p2.Y() - p1.Y())
	/ ( (p2.X() - p1.X()) * (p2.X() - p1.X()) ))*p1.X())*(-2*((p2.Y() - p1.Y()) )
	/ ( (p2.X() - p1.X()) * (p2.X() - p1.X()) ))*p1.X())) / (4*((p2.Y() - p1.Y()) /
	( (p2.X() - p1.X()) * (p2.X() - p1.X()) )))).toFixed(2);	//
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
