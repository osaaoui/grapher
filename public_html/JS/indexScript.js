
var board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true, zoomfactor: 0.8});
var sliderA;
var sliderB;
var sliderC;
var ordonnee;
var pente;
var exp;
var a = 0.1;
var b = 0;
var c = 0;

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
	pente= parametreA(tokenize(equation));
	ordonnee= parametreB(tokenize(equation));
	exp = exposant(tokenize(equation));
	slides (pente, ordonnee, exp);
}

// Rajouter l'option snapWidth:1 pour que la manipulation du slider ne retourne que des entiers (ie. pas de nombres fractionnaires, etc)
function slides (pente, ordonnee, exp) {
	sliderA =board.create('slider',[[4,-3],[6,-3],[pente-4,pente,pente+4]],{name:'&nbsp&nbsp&nbsp&nbspA', snapWidth:1});
	sliderB =board.create('slider',[[4,-3.5],[6,-3.5], [ordonnee -4, ordonnee,ordonnee +4]], {name:'&nbsp&nbsp&nbsp&nbspB',snapWidth:1});
	sliderC =board.create('slider',[[4,-4],[6,-4],[exp-4,exp,exp+4]],{name:'&nbsp&nbsp&nbsp&nbspC',snapWidth:1});
	function f(x) {
		return sliderC.Value()*(x*x)+ sliderA.Value()*x + sliderB.Value();
	}
	var stringEquation= board.create('text', [4,-2,function(){return 'y= '+sliderC.Value().toFixed(2)
	+ 'x²' + (sliderA.Value()<0?'':'+')+ sliderA.Value().toFixed(2)
	+ 'x'+(sliderB.Value()<0?'':'+')+sliderB.Value().toFixed(2)}], {fontSize:18});
	c=plot(f);
	myFunction();
}


function myFunction() {
var valSliderA = sliderC.Value();
var valSliderB = sliderA.Value();
var valSliderC = sliderB.Value();
	$("#sliderA1").slider({
		orientation: "horizontal",range: "min",min: valSliderA - 4,max: valSliderA + 4,value: valSliderA,
		slide: function(event, ui) {
			$("#a").val(ui.value);
			a = ui.value;
			sliderC.setValue(a);
			board.updateQuality = board.BOARD_QUALITY_HIGH;
			board.update();
		}
	});


	$("#a").val($("#sliderA1").slider("value"));

	$("#sliderB1").slider({
		orientation: "horizontal",range: "min",min: valSliderB - 4,max: valSliderB + 4,value: valSliderB,
		slide: function(event, ui) {
			$("#b").val(ui.value);
			b = ui.value;
			sliderA.setValue(b);
			board.updateQuality = board.BOARD_QUALITY_HIGH;
			board.update();
		}
	});

	$("#b").val($("#sliderB1").slider("value"));

	$("#sliderC1").slider({
		orientation: "horizontal",range: "min",min: valSliderC-4,max: valSliderC+4,value: valSliderC,
		slide: function(event, ui) {
			$("#c").val(ui.value);
			c = ui.value;
			sliderB.setValue(c);
			board.updateQuality = board.BOARD_QUALITY_HIGH;
			board.update();
		}
	});
	$("#c").val($("#sliderC1").slider("value"));
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

function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
}
