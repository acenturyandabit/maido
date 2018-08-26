var mnipsize=10;
var mnips=[];
var mnipTarget;
var mnipGroup;
var ghostLinkerLine;
function selectThis(e){
	targetMnips(e.currentTarget.id.split("++")[0]);
}

function deselect(e){
	if (e.currentTarget==e.target){
		hideMnips();
	}
	if (e.target!=ctxElem)$("#elemContext").hide();
}


function targetMnips(id){
	mnipTarget=SVG.get(id)
	bbox=mnipTarget.bbox()
	mnips[0].move(bbox.x-mnipsize/2,bbox.y-mnipsize/2);
	mnips[1].move(bbox.x2-mnipsize/2,bbox.y-mnipsize/2);
	mnips[2].move(bbox.x-mnipsize/2,bbox.y2-mnipsize/2);
	mnips[3].move(bbox.x2-mnipsize/2,bbox.y2-mnipsize/2);
	mnips[4].move(bbox.cx-mnipsize/2,bbox.y-mnipsize/2);
	mnips[5].move(bbox.cx-mnipsize/2,bbox.y2-mnipsize/2);
	mnips[6].move(bbox.x-mnipsize/2,bbox.cy-mnipsize/2);
	mnips[7].move(bbox.x2-mnipsize/2,bbox.cy-mnipsize/2);
	mnips[8].move(bbox.cx-mnipsize*3/2,bbox.y-mnipsize/2);
	mnips[9].move(bbox.cx+mnipsize/2,bbox.y2-mnipsize/2);
	for (i in mnips){
		mnips[i].show()
	}
	mnipGroup.remove();
	itemSVG.put(mnipGroup);// move it to the top
}

function hideMnips(){
	for (i in mnips){
		mnips[i].hide();
	}
}




var linkTarget;
var linkType;
function linkFromAbove(e){
	linkTarget=mnipTarget;
	linkType='above';
	hideMnips();
	//ghostLinkerLine.show()
	// start the line drawing
}

function linkFromBelow(e){
	linkTarget=mnipTarget;
	linkType='below';
	hideMnips();
	//ghostLinkerLine.show()
	// start the line drawing
}
function drawLinker(e){
	if (linkTarget){
		bbox=linkTarget.bbox()
		if (linkType=='below'){
			ghostLinkerLine.plot(bbox.cx,bbox.y2,e.clientX,e.clientY);
		}else{
			ghostLinkerLine.plot(bbox.cx,bbox.y,e.clientX,e.clientY);
		}
		ghostLinkerLine.show()
	}
}

function endLinker(e){
	if (linkTarget && e.target==e.currentTarget){
		linkTarget=undefined;
		ghostLinkerLine.hide()
	}
}

function linkDrop(e){
	if (linkTarget){
		ghostLinkerLine.hide()
		other=getItem(e.target.id.split("++")[0])
		if (linkTarget!=SVG.get(other.uniqueID)){
			if (!getItem(linkTarget.node.id)[linkType].includes(other)){
				//Check whether or not the link already exists
				topElement=(linkType=='above')?other:getItem(linkTarget.node.id);
				bottomElement=(linkType=='above')?getItem(linkTarget.node.id):other;			
				topElement['below'].push(bottomElement);
				bottomElement['above'].push(topElement);
				renderLink(topElement,bottomElement)
				unsavedChanges=true;
			}
		}
		linkTarget=undefined;
	}
}

function renderLink(topElement,bottomElement){
	topElement=SVG.get(topElement.uniqueID);
	bottomElement=SVG.get(bottomElement.uniqueID);
	itemSVG.line(topElement.bbox().cx,topElement.bbox().y2,bottomElement.bbox().cx,bottomElement.bbox().y)
		.attr({'id':bottomElement.node.id+"++"+topElement.node.id})
		.stroke({ color: '#f06', linecap: 'round' })
}

$(document).ready(()=>{
	itemSVG.click(deselect);
	itemSVG.mousemove(drawLinker);
	itemSVG.mouseup(endLinker);
	// make the item manipulators 
	mnips.push(itemSVG.circle(mnipsize).hide().attr('id','mnip_tlc').mousedown(startMoveMnip));// top left corner circle
	mnips.push(itemSVG.circle(mnipsize).hide().attr('id','mnip_trc').mousedown(startMoveMnip));// top right corner circle
	mnips.push(itemSVG.circle(mnipsize).hide());// bottom left corner circle
	mnips.push(itemSVG.circle(mnipsize).hide());// bottom right corner circle
	mnips.push(itemSVG.rect(mnipsize,mnipsize).hide());// top square
	mnips.push(itemSVG.rect(mnipsize,mnipsize).hide());// bottom square
	mnips.push(itemSVG.rect(mnipsize,mnipsize).hide());// left square
	mnips.push(itemSVG.rect(mnipsize,mnipsize).hide());// right square
	mnips.push(itemSVG.image("img/linkico.png",mnipsize,mnipsize)
	.mousedown(linkFromAbove)
	.hide())//upper link
	mnips.push(itemSVG.image("img/linkico.png",mnipsize,mnipsize).hide()//lower link
	.mousedown(linkFromBelow)
	.hide())//upper link
	mnipGroup=itemSVG.group();
	for (i in mnips){
		mnipGroup.add(mnips[i])
	}
	ghostLinkerLine=itemSVG.line(0,0,0,0)
	.stroke({ color: '#f06', linecap: 'round' })
	.hide()
	ghostLinkerLine.marker('start',10,10,function(add){
		add.circle(10).fill('#f00')
	})
	ghostLinkerLine.marker('end',10,10,function(add){
		add.circle(10).fill('#0f0')
	})
})

var movingMnip;
var mdx;
var mdy;
function moveMnip(e){
	if (movingMnip){
		switch(movingMnip.id()){
			case 'mnip_trc':
				mnipTarget.size(mnipTarget.width()+(e.clientX-sdx),mnipTarget.height()-(e.clientY-sdy));
				mnipTarget.move(mnipTarget.x(),mnipTarget.y()+(e.clientY-sdy));
				sdx=e.clientX;
				sdy=e.clientY;
		}
		// targetMnips(mnipTarget.node.id);
		
		// _moveTarget=SVG.get(moveTarget)
		// _moveTarget.node.style.cursor="move"
		// _moveTarget.move(movingItem.cx-blockWidth/2,movingItem.cy-blockHeight/2)
		// _moveTarget=SVG.get(moveTarget+"++t")
		// _moveTarget.move(movingItem.cx-_moveTarget.bbox().width/2,movingItem.cy-_moveTarget.bbox().height/2)
		// targetMnips(moveTarget)
		// _moveTarget=SVG.get(moveTarget)
		// // Move constituent bits and pieces as well.
		// for (j in movingItem.above){
			// i=movingItem.above[j]
			// SVG.get(movingItem.uniqueID+"++"+i.uniqueID).plot(SVG.get(i.uniqueID).bbox().cx,SVG.get(i.uniqueID).bbox().y2,_moveTarget.bbox().cx,_moveTarget.bbox().y)
		// }
		// for (j in movingItem.below){
			// i=movingItem.below[j]
			// SVG.get(i.uniqueID+"++"+movingItem.uniqueID).plot(_moveTarget.bbox().cx,_moveTarget.bbox().y2,SVG.get(i.uniqueID).bbox().cx,SVG.get(i.uniqueID).bbox().y)
		// }
		// unsavedChanges=true;
	}
}


function endMove(e){
	if (moveTarget){
		_moveTarget=SVG.get(moveTarget)
		_moveTarget.node.style.cursor="default";
		moveTarget=undefined;
	}
}

function startMoveMnip(e){
	movingMnip=SVG.get(e.currentTarget.id);
	sdx=e.clientX;
	sdy=e.clientY;
}

$(document).ready(()=>{
	$("body").on("mousemove",moveMnip);
	$("body").on("mouseup",endMove);
})






