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
	var paraA=trouverPara(equation)[0][0]; //alert(paraA);
	var paraB=trouverPara(equation)[1][0]; //alert(paraB);
	var sliderA =board.create('slider',[[4,-3],[6,-3],[Number(paraA)-4,paraA,Number(paraA)+4]],{name:'a'});
	var sliderB =board.create('slider',[[4,-3.5],[6,-3.5], [Number(paraB)-4, paraB, Number(paraB)+4]], {name:'b'});
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

function trouverPara(equation){
	var placeX=equation.indexOf("x");
	var res = equation.substring(0, placeX);
	var tabPara = [res.match(/([0-9])+/)]; // premier element du tableau parametre a de ax+b
	res= equation.substring(placeX,equation.length);
	tabPara.push(res.match(/([0-9])+/)); // deuxième element du tableau parametre b de ax+b
	return tabPara;
}

function erase () {
	$('#input').val('');
	JXG.JSXGraph.freeBoard(board);
	board = JXG.JSXGraph.initBoard('box', {boundingbox:[-5,8,8,-5], axis:true});
}
