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


/* La fonction tokenize retourne un tableau de chaînes de caractères
 * elle prend en paramètre une chaine String (l'équation à traiter)
 * Toutes les fonctions sont déclarées avec const dans un style fonctionnel
 * pour éviter des effets de bord (side effects). 
 * On fera appel à la composition de fonctions pour retourner les valeurs
 */


const tokenize= function (code) {
        var results = [];
        
        //le regex permet d'isoler le paramètre a: par exemple: 3x + 2 sera 
        // découpée en ['3x', '+', '2']
        var tokenRegExp = /\s*(-?[0-9]*x|-?[\d]+|\S)\s*/g;

        var m;
        while ((m = tokenRegExp.exec(code)) !== null)
        results.push(m[1]);
        return results;
        
}

/*
 * fonction qui retourne le paramètre A de l'équation
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
	//alert(code);
	var ordonnee=0;
	for (var i=0; i< tok.length; i++){
		
		// puisque l'équation est divisée en 'ax', '+' ou '-', 'b'
		// donc le seul élément qui est un nombre est le paramètre 'b'
		 if(!isNaN(tok[i])){
			ordonnee= tok[i];
			}
	return ordonnee;
	}
		
};    





function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
}
