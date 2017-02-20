var board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
function addCurve(board, func, atts){
	var f= board.create('functiongraph', [func], atts);
	return f;
}
function plot(func, atts){
	if(atts==null){
		return addCurve(board, func, {strokewidth:1});
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
    //var exp = exposant(tokenize(equation)); 
 	//alert(exp);   
	var sliderA =board.create('slider',[[4,-3],[6,-3],[pente-4,pente,pente+4]],{name:'a'});
	var sliderB =board.create('slider',[[4,-3.5],[6,-3.5], [ordonnee -4, ordonnee,ordonnee +4]], {name:'b'});
	function f(x) {
	return sliderA.Value()*x + sliderB.Value();
	}
	c= plot(f);
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
        //var text = String.fromCharCode(178);
        //le regex permet d'isoler le param�tre a: par exemple: 3x, + 2 sera 
        // d�coup�e en ['3x', '+', '2']
        var tokenRegExp = /\s*(-?[0-9]*x|-?[\d]+|\S)\s*/g;

        var m;
        while ((m = tokenRegExp.exec(code)) !== null)
        results.push(m[1]);
        return results;
        
}

const exposant = function(code){
	alert(code);
	var codeExp = "&#178;";
	//var ouverture= new RegExp =("x" + codeExp);
	//var ouverture= /xcodeExp/;
	//alert(code.match(ouverture));
	
};

/*
 * fonction qui retourne le param�tre A de l'�quation
 * Param: code   type: String
 */
    const parametreA = function(code){
    var tok = code;
	var laPente=0;
	var pente= /-?[0-9]+x/;
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
		 if(tok[i].match(/^-?[^x\+]$/)){
			ordonnee+= Number(tok[i].match(/^-?[^x\+]$/));
			}
	
	}
	return ordonnee;	
};     





function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
}
