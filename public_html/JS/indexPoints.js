var board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8});
var ordonnee;
var pente;
var p1, p2, p3;
function addCurve(board, func, atts){
	var f= board.create('functiongraph', [func], atts,{fixed: false});
	return f;
}

function traceAvecP(){
	var equation = document.getElementById('input').value;//alert(equation);
	pente= parametreA(tokenize(equation));
	ordonnee= parametreB(tokenize(equation));
	var exp = exposant(tokenize(equation));
	var point1;
	var point2

/*Cette premiere partie est pour une ligne. On trace la ligne en utilisent les duex points
 *La duexieme partie trace une courbe, ou sommet est le sommet de la curbe et p2 est un point
 *qui est situe a +1 de -b/2a (x) et la valeur de y est l'ordonnee.
*/
	if (exp == 0) {
		point1 = board.create('point', [1,(ordonnee+pente)], {style:6, name:'p1'});
		point2 = board.create('point', [(ordonnee/-pente), 0], {style:6, name:'p2'});
		var ligne = board.create('line', [point1,point2]);
		
		// Code pour représenter la pente de l'équation linéaire sous forme de triangle 
		// se déplaçant le long de la ligne
/*   
 suppression du glider qui ne fait que créer un point de plus sur la courbe. Il peut porter à confusion.
 On attache le triangle à l'un des deux points définis en haut, ce qui rend le triangle plus visible.
 */		
		//var glisseur= board.create('glider', [0, 0, ligne]),
		triangle= board.create('slopetriangle', [ligne, point1]);
		
		affichageEquationLineairePoint(point1,point2);
		document.getElementById("equationGraph").innerHTML= " Équation linéaire: y = ax + b";
		//afficherEquationExt(point1,point2);
	
		
	} else if (exp != 0 ){
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
		f.addParents([sommet, p2]);
				

	}
}

//animerPente();
function animerPente(){
	return animerVertical();
}

		

//function animerPente(){
//	animerVertical();
//}
animerVertical= function (){
	p1= board.create('point', [0, (ordonnee+pente)], {style:6, name:'a', trace:true});
		p2= board.create('point', [1, (ordonnee+pente)], {style:6, name:'b', trace:true});
		p3= board.create('point', [0, (ordonnee+0)], {style:6, name:'o', trace:true});

	    
	return p3.moveTo([0,(ordonnee+pente)], 1500, {callback: animerHorizontal}); 
	
};
animerHorizontal= function(){
	p1= board.create('point', [0, (ordonnee+pente)], {style:6, name:'a', trace:true});
		p2= board.create('point', [1, (ordonnee+pente)], {style:6, name:'b', trace:true});
		p3= board.create('point', [0, (ordonnee+0)], {style:6, name:'o', trace:true});

	return p1.moveTo([1, 5], 1500);
};



function clearAll(board){
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
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
	var tokenRegExp  = new RegExp('\s*(-?[0-9]*x{1}'+text+'?|-?[0-9]+|\S)\s*','g');
	var m;
	while ((m = tokenRegExp.exec(code)) !== null)
	results.push(m[1]);
	return results;

};

const exposant = function(code){
	var tok=code;
	var exp=0;
	var text = String.fromCharCode(178);
	var ouverture= new RegExp('-?[0-9]+x{1}'+text+'$');
	var sansX= /-?[0-9]+/;
	var ouvertureX='x'+text;
	var ouvertureNeg="-x"+text;
	for(var i=0; i<tok.length;i++){
		if(tok[i].match(ouverture)){
			exp+= Number(tok[i].match(sansX));
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
	var pente= /-?[0-9]+x$/;
	var sansX= /-?[0-9]+/;
	var penteX= 'x';
	var penteNegX="-x";
	for (var i=0; i< tok.length; i++){
		if(tok[i].match(pente)){
			// une fois la pente ax est trouvée, on veut retourner seulement l'entier a
			// et supprimer le x
			laPente+= Number(tok[i].match(sansX));
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


//function afficherEquationExt(p, t){
 
//	return affichageEquationLineairePoint(point1, point2);
//}

//document.getElementById("equationGraph").innerHTML = afficherEquationExt(point1, point2);






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
}
function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8});
}
