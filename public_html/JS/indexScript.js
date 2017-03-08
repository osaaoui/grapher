
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
        var stringEquationD= board.create('text', [4,-1,function(){return 'y= '+ ((m.Y() - z.Y()) / ( (m.X() - z.X()) * (m.X() - z.X()) )).toFixed(2)
	+ 'x² +' + (-2*((m.Y() - z.Y()) / ( (m.X() - z.X()) * (m.X() - z.X()) ))*z.X()).toFixed(2)
	+ 'x +' + ((z.Y()*4*((m.Y() - z.Y()) / ( (m.X() - z.X()) * (m.X() - z.X())))+((-2*((m.Y() - z.Y()) / ( (m.X() - z.X()) * (m.X() - z.X()) ))*z.X())*(-2*((m.Y() - z.Y()) )/ ( (m.X() - z.X()) * (m.X() - z.X()) ))*z.X()))/(4*((m.Y() - z.Y()) / ( (m.X() - z.X()) * (m.X() - z.X()) )))).toFixed(2)}]);	// affichage fonction avec les points
	f.addParents([z, m]);
}

}

function slides (pente, ordonnee, exp) {
	var sliderA =board.create('slider',[[4,-3],[6,-3],[pente-4,pente,pente+4]],{name:'&nbsp&nbsp&nbsp&nbspA'});
	var sliderB =board.create('slider',[[4,-3.5],[6,-3.5], [ordonnee -4, ordonnee,ordonnee +4]], {name:'&nbsp&nbsp&nbsp&nbspB'});
	var sliderC =board.create('slider',[[4,-4],[6,-4],[exp-4,exp,exp+4]],{name:'&nbsp&nbsp&nbsp&nbspC'});
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


/* La fonction tokenize retourne un tableau de cha�nes de caract�res
 * elle prend en param�tre une chaine String (l'�quation � traiter)
 * Toutes les fonctions sont d�clar�es avec const dans un style fonctionnel
 * pour �viter des effets de bord (side effects).
 * On fera appel � la composition de fonctions pour retourner les valeurs
 */


const tokenize= function (code) {
        var results = [];
        var text = String.fromCharCode(178);
        //le regex permet d'isoler le param�tre a: par exemple: 3x, + 2 sera
        // d�coup�e en ['3x', '+', '2']
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
 * fonction qui retourne le param�tre A de l'�quation
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
			// une fois la pente ax est trouv�e, on veut retourner seulement l'entier a
			// et supprimer le x
			laPente+= Number(tok[i].match(sansX));
		// si la pente se pr�sente sous la forme x, c'est-�-dire sans coefficient
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
 * fonction qui retourne le param�tre b d'une �quation
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


function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
}
