$(function(){
    	$("#clavier-virtuel").find("button").click(function () {
    		//alert("Hi");
		var text = $(this).text();
		$("input").val($("input").val()+ text);
		                
});

});