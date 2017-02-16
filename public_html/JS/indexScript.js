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
    var tok = tokenize(equation);
	var ordonnee;
	var pente= /[0-9]+x/;
	var sansX= /[0-9]+/;
	var penteX= 'x';
	for (var i=0; i< tok.length; i++){
		if(tok[i].match(pente)){
			//alert("parametre a= "+ tok[i]);
			pente= tok[i].match(sansX);
			
			//alert("La pente est= " + pente);
			
		}else if (tok[i]==penteX){
			pente= 1;
			alert("La pente est= " + pente);
		}else if(!isNaN(tok[i])){
			ordonnee= tok[i];
			//alert("ordonnee est: " + ordonnee);
		}
		
	}
	/*var tabPara=trouverPara(equation);
	var paraA=tabPara[0][0]; //alert(paraA);
	var paraB=tabPara[1][0]; //alert(paraB); */
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

function tokenize(code) {
        var results = [];
        var tokenRegExp = /\s*([A-Za-z]+|[0-9]+x|\S)\s*/g;

        var m;
        while ((m = tokenRegExp.exec(code)) !== null)
        results.push(m[1]);
        return results;
   }     

/* function trouverPara(equation){
        equation=equation.replace(/ /g,"");
        var tabPara;
	var placeX=equation.indexOf("x");
	var res = equation.substring(0, placeX);
	if(res.match(/(-?[0-9])+/)){
	tabPara = [res.match(/(-?[0-9])+/)];// premier element du tableau parametre a de ax+b
	}else{
	var tab=[1];
	tabPara =[tab];
	}
	res= equation.substring(placeX,equation.length);
	tabPara.push(res.match(/(-?[0-9])+/)); // deuxième element du tableau parametre b de ax+b
	return tabPara;
} */


function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
}
