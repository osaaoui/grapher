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
	function f(x) {
	return eval(document.getElementById('input').value);
	}
	c= plot(f);
}
function clearAll(board){
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
	return board;
}

function trouverPara(equation){
	var placeX=equation.indexOf("x");
	var res = equation.substring(0, placeX);
	var tabPara = [res.match(/([0-9])+/)]; // premier element du tableau parametre a de ax+b
	res= equation.substring(placeX,equation.length);
	tabPara.push(res.match(/([0-9])+/)); // deuxième element du tableau parametre b de ax+b
	return tabPara;
}