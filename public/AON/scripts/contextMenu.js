$(document).ready(()=>{
	$("#itemSVG").on("contextmenu",backContext);
	$("#itemSVG").on("click",hideContext);
	$(".contextmenu>button").on("click",hideContextParent);
	$("body").on("keyup",escQuit)
});
function backContext(e){
	if (e.target.parentElement!=e.currentTarget)return false;
	$("#backContext")[0].style.left=e.clientX
	$("#backContext")[0].style.top=e.clientY
	$("#backContext").show();
	if (e.target!=ctxElem)$("#elemContext").hide();
	return false;
}

function hideContext(e){
	if ($("#backContext")[0].style.display!="none")$("#backContext").hide();
}

function hideContextParent(e){
	e.target.parentElement.style.display="none";
}

function escQuit(e){
	if (e.keyCode==27){
		$(".splash").hide();
	}
}

var ctxElem;
function elemContext(e){
	ctxElem=e.target;
	$("#elemContext")[0].style.left=e.clientX
	$("#elemContext")[0].style.top=e.clientY
	$("#elemContext").show();
	$("#backContext").hide();
	return false;
}

function deleteContext(){
	ctxID=ctxElem.id.split("++")[0];
	ctxitem=getItem(ctxID)
	for (i in ctxitem.above){
		oi=ctxitem.above[i];
		var index = oi.below.indexOf(ctxitem);
		if (index > -1) {
		  oi.below.splice(index, 1);
		}
		SVG.get(ctxID+"++"+oi.uniqueID).remove();
	}
	for (i in ctxitem.below){
		oi=ctxitem.below[i];
		var index = oi.above.indexOf(ctxitem);
		if (index > -1) {
		  oi.above.splice(index, 1);
		}
		SVG.get(oi.uniqueID+"++"+ctxID).remove();
	}
	var index=items.indexOf(ctxitem);
	if (index>-1)items.splice(index,1);
	SVG.get(ctxID).remove();
	SVG.get(ctxID+"++t").remove();
	hideMnips();
	ctxElem=undefined;
	$("#elemContext").hide();
}