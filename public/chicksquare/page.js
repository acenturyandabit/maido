var sets=[];
$(document).ready(init);
function init(){
	//load barn chickens
	loadChickens();
	//add preexisting sets
	for (var i=0;i<sets.length;i++){
		addSet(sets[i],false);
	}
	rehash();
	
	//basic resetting things
	$("#addbox")[0].value="";
	haschicken=-1;
	canvas=document.getElementById("mainCanvas");
	w=canvas.width= window.innerWidth; //document.width is obsolete
    h=canvas.height = window.innerHeight; //document.height is obsolete
	ctx=canvas.getContext('2d');
	canvas.onwheel = function(event){
		event.preventDefault();
	};
	
	//initialise all birds
	for (var i=0;i<100;i++)birbs[i]=new birb();
	setInterval(draw,20);
	
	
	
	document.body.style.margin = "0px";
	document.body.style.overflow = "hidden";
	
	net = document.getElementById("d_mousenet");
	netimg=document.getElementById("mousenet");
	b=document.getElementById("barn");
	//barn canvas
	ctin=document.getElementById("tc_1");
	ctxin=ctin.getContext("2d");
	//set list	
	addSetToList("Normal");
	
	boxes = document.getElementsByClassName("c_nb");
	
	
	
	nestimg = new Image;
	nestimg.onload=redrawNests;
	nestimg.src = "nest.png";
	
	resetNet();
	
	
	$("body").on("mousemove",mousemove);
	$("body").on("click",mouseclick);
	$("body").on("keydown",kd);
	$("#netbtn").on("click",toggleNet);
	$("#barnbtn").on("click",function(){showBarn(2);});
	$(".tbli").on("click", under_showBarn);
	$("#atbbtn").on("click",function(){pickslot(addChicken);});
	$("#nextBox").on("click",function(){addNest(false)});
	$("#donoradbtn").on("click",function(){setBadge('donor')});
	$("#addsetbtn").on("click",function(){addSet($("#addbox")[0].value,true)});
	$(".c_nb").on("click",slotSelected);
	$("#sendBirb").on("click",submitUserBirb);
	$("#uckbtn").on("click",function(){loginAttempt($("#untb")[0].value,$("#pstb")[0].value)});
	ctin.width = $("#tb_1")[0].clientWidth;
	ctin.height = $("#tb_1")[0].clientHeight*0.7;
	
	
	
	
	
	
	
	// Handle tabbing off the page. Pause the current game.
    document.addEventListener('visibilitychange',ovbc);
	
    window.addEventListener('blur',ovbc);
	
    window.addEventListener('focus',ovbc);
	moving=true;
	setInterval(saveChickens,500);
	
	$("#atbbtn").hide();
	
	//factory
	factoryBirb=new birb();
	factoryinfo=Object.assign({},infos[0]);
	factoryinfo.probability=5;
	factoryinfo.name="";
	factoryinfo.desc="";
	factoryBirb.style=factoryinfo;
	fct=$("#cv_cfactory")[0].getContext('2d');
	$(".cfcpk").on("change",updateFactoryInfo);
	//initial fill
	
	//retrieve user chickens
	getUserSets();
	getsto();
	
	
	//net a random chicken and show it
	haschicken=Math.floor(Math.random()*100);
	showBarn(1);
	
	
}
var moving;

var ovbc=function(e) {
    if (document.hidden || document.webkitHidden || e.type == 'blur' ||
	document.visibilityState != 'visible') {
		saveChickens();
		moving=false;
		} else{
		loadChickens();
		moving=true;
	}
}

function addSetToList(setname){
	added_ok=true;
	$("#setlist")[0].innerHTML+="<li>"+setname+"</li>";
	$("#avsetdv p:contains("+setname+")").detach();
}

function saveChickens() {
	if (moving==false)return;
	// Save it using the Chrome extension storage API.
	if (chrome.storage.local){
		chrome.storage.local.set({'eggs': u_e});
		var chk=[];
		for (var i=0;i<$(".nestbox").length;i++){
			if (housebirbs[i]){
				chk.push(housebirbs[i].toBit());
			}else{
				chk.push({});
			}
		}
		chrome.storage.local.set({"badges": bdg});
		chrome.storage.local.set({"birbs": chk});
		chrome.storage.local.set({"sets": sets});
		chrome.storage.local.set({"timeStamp": Date.now()});
		chrome.storage.local.set({"nestAmt": $(".nestbox").length});
	}
}

function loadChickens() {
	if (chrome.storage){
		chrome.storage.local.get(function cb(items){
			if (items.timeStamp){
				u_e=items.eggs;
				while ($(".nestbox").length<items.nestAmt)addNest(true);
				if (items.badges){
					for (var i=0;i<items.badges.length;i++){
						setBadge(items.badges[i]);
					}
				}
				for (var i=0;i<items.sets.length;i++){
					if (sets.indexOf(items.sets[i])==-1){
						sets.push(items.sets[i]);
						addSet(items.sets[i]);
					}
				}
				
				for (var i=0;i<$(".nestbox").length;i++){
					if (items.birbs[i].name){
						if (!housebirbs[i])housebirbs[i]=new birb();
						housebirbs[i].fromBit(items.birbs[i]);
					}
				}
			}
		});
		}else{
		$("#d_extlink a")[0].href="http://chrome.google.com/webstore/detail/chicksquares/nkjbdebcjapomgjbegialdfhkamedpkc";
		$("#d_extlink a")[0].innerHTML="Get our Chrome Extension! Pleeeeeeease";
	}
}