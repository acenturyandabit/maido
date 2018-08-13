var itemSVG;
$(document).ready(()=>{
	itemSVG=SVG('itemSVG').size($("body").width() * 0.8, $("body").height());
	autoLoad();
})

function newDiagram(){
	if (items!=[] && unsavedChanges){
		$("#confirmNew").show();
	}else{
		_newDiagram();
	}
	
}

function _newDiagram(){
	itemSVG.clear();
	items=[];
	$("#confirmNew").hide();
	$("#toBrowserSave")[0].value="";
}