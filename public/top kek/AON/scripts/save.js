$(window).keydown(function(event) {
	//if (event.ctrlKey)console.log(event.which)
	if (!(event.which == 83 && event.ctrlKey) && !(event.which == 19)) return true;
	if ($("#toBrowserSave")[0].value!=""){
		saveLocal();
		$("#status").text('Saved to '+$("#toBrowserSave")[0].value);
		setTimeout(()=>{$("#status").text('Ready')},2000);
	}else{
		$("#saveSplash").show();
	}
	event.preventDefault();
	return false;
});

function autoLoad(){
	if (localStorage.autosaveTT && localStorage["storedTT"+localStorage.autosaveTT]){
		loadFromStorage(localStorage.autosaveTT);
	}
}

function setAutoload(){
	localStorage.autosaveTT=$("#autoload")[0].value;
}

function showLoadScreen(){
	$("#localSaves").empty();
	for (i in localStorage){
		if (i.includes('storedTT')){
			b=document.createElement("button")
			b.innerText=i.slice(8);
			$(b).on('click',(e)=>{loadFromStorage(e.target.innerText)});
			$("#localSaves").append(b)
			$("#localSaves").append("<br>")
		}
	}
	$("#loadSplash").show();
}

function loaderLoad(){
	staticTree=JSON.parse($('#loadSplash textArea')[0].value)
	loadFrom(staticTree);
	$("#loadSplash").hide();
}

function loadFromStorage(i){
	staticTree=JSON.parse(localStorage['storedTT'+i]);
	loadFrom(staticTree);
	$("#loadSplash").hide();
	$("#toBrowserSave")[0].value=i;
}


function showSaveScreen(){
	$('#saveSplash').show();
	$('#saveSplash textArea')[0].value=JSON.stringify(toStaticTree())
}

var unsavedChanges=false;
function saveLocal(){
	localStorage['storedTT'+$("#toBrowserSave")[0].value]=JSON.stringify(toStaticTree());
	unsavedChanges=false;
}

function loadFrom(staticTree){
	itemSVG.clear();
	items=[];
	for (j in staticTree){
		i=new item();
		i=Object.assign(i,staticTree[j]);
		items.push(i)
		renderNew(items[j])
	}
	for (j in items){
		aboves=JSON.parse(JSON.stringify(items[j].above));
		items[j].above=[];
		for (_j in aboves){
			items[j].above.push(getItem(aboves[_j]));
			renderLink(getItem(aboves[_j]),items[j])
		}
		belows=JSON.parse(JSON.stringify(items[j].below));
		items[j].below=[];
		for (_j in belows){
			items[j].below.push(getItem(belows[_j]));
		}
		
		
	}
	// draw everything
}

function toStaticTree(){
	staticItems=[];
	for (j in items){
		staticItems.push(items[j].toStaticItem());
	}
	return staticItems;
}