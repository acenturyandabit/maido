
var b;
var selectSlot;
var nestimg;
var boxes;
var u_e=0;
var eggs=0;
function eggcumulate(){
	if (eggs-u_e>100)setBadge ("haxxor");
	for (var i=0;i<$(".nestbox").length;i++){
		if (housebirbs[i]){
			u_e+=housebirbs[i].getEPS()/50;
		}
	}
	eggs=Math.floor(u_e);
	$("#d_eggs p")[0].innerHTML="Eggs: "+eggs;
	if (u_e>nextQuery)getsto();
}

function pickslot() {
	if (haschicken<-1)showBarn(2);
	else{
		var slot;
		showBarn(2);
		document.getElementById("selectPrompt").style.display = "block"; ///this line
		selectSlot = true;
	}
}

function slotSelected(e) {
	var k=e.currentTarget;
	if (k.localName=="div"){
		k=k.childNodes[1];
	}
	k=k.id;
	k=k.slice(k.length-1);
	if (selectSlot) {
		selectSlot = false;
		addChicken(k);
		document.getElementById("selectPrompt").style.display = "none";
		}else{
		if (housebirbs[k]){
			haschicken=-2-k;
			showBarn(1);
		}
	}
}

function addChicken(index) {
	housebirbs[index] = Object.assign({}, birbs[haschicken]);
	resetNet();
	redrawNests();
	showBarn(2);
}

function addNest(ignore){
	//calculate nest cost
	var nestcost=Math.floor(300 ** (($(".nestbox").length-4)*0.15 + 1));
	if (u_e>nestcost || ignore){
		if (!ignore)u_e-=nestcost;
		var newbox = $(".nestbox")[0].cloneNode(true);
		$("#shed")[0].insertBefore(newbox,$(".finalbox")[0]);
		newbox.addEventListener("click",slotSelected);
		newbox.childNodes[1].id="slt"+($(".nestbox").length-2);
		$("#nextBox")[0].innerHTML=Math.floor((300 ** (($(".nestbox").length-4)*0.15 +1))) + " eggs";
	}
	redrawNests();
}

function resetNet() {
	document.getElementById("name").innerHTML = "No chicken selected!";
	document.getElementById("desc").innerHTML = "Try the net!";
	
	dvext = document.getElementById("tb_1");
	ctin.width = dvext.clientWidth;
	ctin.height = dvext.clientHeight * 0.7;
	if (haschicken>-1)birbs[haschicken].reset();
	haschicken=-1;
	$("#atbbtn").hide();
}


function redrawNests() {
	var boxdiv = document.getElementsByClassName("nestbox");
	var boxtex = document.getElementsByClassName("nbname");
	var epstex = document.getElementsByClassName("nbeps");
	var boxctx;
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].width = boxdiv[0].clientWidth;
		boxes[i].height = boxdiv[0].clientHeight * 0.8;
		boxctx = boxes[i].getContext('2d');
		if (i == boxes.length - 1)boxctx.filter = "grayscale(90)";
		boxctx.drawImage(nestimg, 0, boxes[i].height * 0.6, boxes[i].width, boxes[i].height * 0.4);
		if (i==boxes.length-1)return;
		if (housebirbs[i]) {
			housebirbs[i].draw(boxctx, boxes[i].width/2,housebirbs[i].y,boxes[i].height/2);
			boxtex[i].innerHTML = housebirbs[i].getName();
			$(".nbeps")[i].innerHTML=housebirbs[i].getEPS() + " Eggs per sec";
			}else if (i!= boxes.length - 1){
			boxtex[i].innerHTML = "Empty";
			$(".nbeps")[i].innerHTML="0 Eggs per sec";
		}
	}
	
}
function under_showBarn(sender){
	var k = sender.target.parentElement.id[2];
	if (k==$(".tbli").length)hideBarn();
	else showBarn(k);
}

function showBarn(screen) {
	hideNet();
	b.style.display = "block";
	var t;
	var dvext;
	$(".tbli").removeClass("active");
	$("#t_"+screen).addClass("active");
	$(".tab").addClass("hidden");
	$(".tab").removeClass("activetab");
	$("#tb_"+screen).removeClass("hidden");
	$("#tb_"+screen).addClass("activetab");
	var lebirb;
	//convert string to int
	screen=screen*2/2;
	
	switch (screen) {
		case 1:
		dvext = document.getElementById("tb_1");
		ctin.width = dvext.clientWidth;
		ctin.height = dvext.clientHeight * 0.7;
		if (haschicken != -1) {
			//display chick selected in haschicken
			
			if (haschicken>-1){
				lebirb=birbs[haschicken];
				$("#atbbtn")[0].innerHTML="Add to barn";
				}else{
				lebirb=housebirbs[-2-haschicken];
				$("#atbbtn")[0].innerHTML="Back to barn";
			}
			lebirb.blinking=false;
			lebirb.draw(ctxin, ctin.width/2,0,ctin.height/2);
			//display stats
			dvext = document.getElementById("name");
			dvext.innerHTML = lebirb.getName();
			document.getElementById("desc").innerHTML = lebirb.getDesc();
			$("#atbbtn").show();
			}else{
			resetNet();
		}
		break;
		case 2:
		//load chickos
		redrawNests();
		//blink 'em
		break;
		case 3:
			factoryDraw();
		break;
	}
	
}

var factoryBirb;
var fct;
var factoryinfo;
function factoryDraw(){
	//draw the birb!
	factoryBirb.draw(fct,100,0,100);
}
var factoryKeyMap={
	"Beak":"beakstyle",
	"Body":"innerstyle",
	"Crown":"topstyle",
	"Eyes":"eyestyle",
	"Edges":"outlinestyle"
}

function updateFactoryInfo(e){
	console.log(e);
	var p=e.currentTarget.parentElement.innerHTML.split(":")[0];
	factoryinfo[factoryKeyMap[p]]=e.currentTarget.value;
	factoryDraw();
}

function hideBarn() {
	ignoreclick = true;
	b.style.display = "none";
}


