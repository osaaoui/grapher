$(function(){
  $("#clavier-virtuel").find("button").click(function () {
  	$("input").focus();
    //alert("Hi");
    var text = String.fromCharCode(178);
    var text2;
    var saisie = this.id;

    if (saisie == "x2") {
      text2 = "x";
      text = text2.concat(text);
    } else if (saisie == "y2") {
      text2 = "y";
      text = text2.concat(text);
    }
    var inputText= document.getElementById('input').value;

    var res = inputText.concat(text);
    document.getElementById("input").value = res;
  });

});
