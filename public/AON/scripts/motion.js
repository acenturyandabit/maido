var moveTarget;
var sdx;
var sdy;
function moveItem(e){
	if (moveTarget){
		movingItem=items.find((i)=>{return i.uniqueID==moveTarget})
		movingItem.cx=e.originalEvent.clientX+sdx;
		movingItem.cy=e.originalEvent.clientY+sdy;
		_moveTarget=SVG.get(moveTarget)
		_moveTarget.node.style.cursor="move"
		_moveTarget.move(movingItem.cx-blockWidth/2,movingItem.cy-blockHeight/2)
		_moveTarget=SVG.get(moveTarget+"++t")
		_moveTarget.move(movingItem.cx-_moveTarget.bbox().width/2,movingItem.cy-_moveTarget.bbox().height/2)
		targetMnips(moveTarget)
		_moveTarget=SVG.get(moveTarget)
		// Move constituent bits and pieces as well.
		for (j in movingItem.above){
			i=movingItem.above[j]
			SVG.get(movingItem.uniqueID+"++"+i.uniqueID).plot(SVG.get(i.uniqueID).bbox().cx,SVG.get(i.uniqueID).bbox().y2,_moveTarget.bbox().cx,_moveTarget.bbox().y)
		}
		for (j in movingItem.below){
			i=movingItem.below[j]
			SVG.get(i.uniqueID+"++"+movingItem.uniqueID).plot(_moveTarget.bbox().cx,_moveTarget.bbox().y2,SVG.get(i.uniqueID).bbox().cx,SVG.get(i.uniqueID).bbox().y)
		}
		unsavedChanges=true;
	}
}


function endMove(e){
	if (moveTarget){
		_moveTarget=SVG.get(moveTarget)
		_moveTarget.node.style.cursor="default";
		moveTarget=undefined;
	}
}

function startMove(e){
	moveTarget=e.currentTarget.id.split("++")[0];
	movingItem=getItem(moveTarget);
	sdy=movingItem.cy-e.clientY;
	sdx=movingItem.cx-e.clientX;
	targetMnips(moveTarget)
}

$(document).ready(()=>{
	$("body").on("mousemove",moveItem);
	$("body").on("mouseup",endMove);
})