var items=[];
function item(name){
	this.uniqueID=generateUUID();
	//this.tier=tier;
	this.name=name;
	this.details="";
	this.cx=300;
	this.cy=300;
	this.above=[];
	this.below=[];
	this.toStaticItem=function(){
		staticItem=Object.assign({},this);
		staticItem.above=[];
		for (_j in this.above){
			staticItem.above.push(this.above[_j].uniqueID)
		}
		staticItem.below=[];
		for (_j in this.below){
			staticItem.below.push(this.below[_j].uniqueID)
		}
		return staticItem;
	}
}

function createNew(){
	$("#newItemSplash").show();
}

function getItem(uniqueID){
	return items.find((i)=>{return i.uniqueID==uniqueID})
}

const blockWidth=100;
const blockHeight=50;
function _addElement(){
	unsavedChanges=true;
	let newElem=new item($("#newItemSplash input")[0].value);
	newElem.details=$("#newItemSplash textarea")[0].value
	items.push(newElem);
	$("#newItemSplash").hide();
	renderNew(newElem);
}

function renderNew(newElem){
	itemSVG.rect(blockWidth,blockHeight)
		.move(newElem.cx-blockWidth/2,newElem.cy-blockHeight/2)
		.fill('#0044dd')
		.attr({'id':newElem.uniqueID})
		.mousedown(startMove)
		.mouseup(linkDrop)
		.on('contextmenu',elemContext)
		.click(selectThis);
	itemName=itemSVG.plain(newElem.name);
	itemName.attr({'fill':'black','id':newElem.uniqueID+"++t"})
		.move(newElem.cx-itemName.bbox().width/2,newElem.cy-itemName.bbox().height/2)
		.mousedown(startMove)
		.mouseup(linkDrop)
		.on('contextmenu',elemContext)
		.click(selectThis);
	itemName.node.style['user-select']='none';
}