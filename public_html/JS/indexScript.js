
var board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8});
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


function trace(){
    var equation = document.getElementById('input').value;//alert(equation);
    var pente= parametreA(tokenize(equation));
    //alert("La pente = " + pente);
    var ordonnee= parametreB(tokenize(equation));
    //alert("Ordonnee = " + ordonnee);
    var exp = exposant(tokenize(equation));
var p;
//

//

if (exp == 0) {
 	p = board.create('point', [1,(ordonnee+pente)], {style:6, name:'p1'});
 	var t = board.create('point', [(ordonnee/-pente), 0], {style:6, name:'p2'});
	var ligne = board.create('line', [p,t]);
        affichageEquationLineairePoint(p,t);
	slides (pente, ordonnee, exp);
} else if (exp != 0 ){
	var xxx = -pente/(2*exp);//-b/2a
	var yyy = (4*exp*ordonnee-(pente*pente))/(4*exp); //(4ac-b²)/4a
        var zzz= (exp*(xxx+1)*(xxx+1))+(pente*(xxx+1))+ordonnee;// nouveau point de depart pour "p2"
	var z = board.create('point', [xxx, yyy], {style:6, name:'p1'});// point sommet
	var m = board.create('point', [(xxx+1), zzz], {style:6, name:'p2'}); //le "p2" est placer sur la courbe à 1 de distance par rapport au sommet(ceci évite les conflits 0/0)
	slides (pente, ordonnee, exp);
	var ligne = board.create('functiongraph', function(x) {
			var ax = z.X(),
					ay = z.Y(),
					bx = m.X(),
					by = m.Y(),
					a = (by - ay) / ( (bx - ax) * (bx - ax) );
	      return a * (x - ax) * (x - ax) + ay;
				}, {fixed: false});
        affichageEquationQuadratiquePoint(z,m);
	f.addParents([z, m]);
}

}
// Rajouter l'option snapWidth:1 pour que la manipulation du slider ne retourne que des entiers (ie. pas de nombres fractionnaires, etc)
function slides (pente, ordonnee, exp) {
	var sliderA =board.create('slider',[[4,-3],[6,-3],[pente-4,pente,pente+4]],{name:'&nbsp&nbsp&nbsp&nbspA', snapWidth:1});
	var sliderB =board.create('slider',[[4,-3.5],[6,-3.5], [ordonnee -4, ordonnee,ordonnee +4]], {name:'&nbsp&nbsp&nbsp&nbspB',snapWidth:1});
	var sliderC =board.create('slider',[[4,-4],[6,-4],[exp-4,exp,exp+4]],{name:'&nbsp&nbsp&nbsp&nbspC',snapWidth:1});
	function f(x) {
				return sliderC.Value()*(x*x)+ sliderA.Value()*x + sliderB.Value();
	}
  var stringEquation= board.create('text', [4,-2,function(){return 'y= '+sliderC.Value().toFixed(2)
	+ 'x²' + (sliderA.Value()<0?'':'+')+ sliderA.Value().toFixed(2)
	+ 'x'+(sliderB.Value()<0?'':'+')+sliderB.Value().toFixed(2)}], {fontSize:18});
	c=plot(f);

}




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
 }
 
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
	+ 'x +' + ((p1.Y()*4*((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X())))+((-2*((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X()) ))*p1.X())*(-2*((p2.Y() - p1.Y()) )/ ( (p2.X() - p1.X()) * (p2.X() - p1.X()) ))*p1.X()))/(4*((p2.Y() - p1.Y()) / ( (p2.X() - p1.X()) * (p2.X() - p1.X()) )))).toFixed(2)}]);	// affichage fonction avec les points
 }
function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
}
