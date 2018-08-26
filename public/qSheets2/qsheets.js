var qSheets={}; // object containing information about question sheets.
var qGens={}; // Internal generator populated with only the generators.
var qSearch={};
var setSettings={
	maxdiff:1,
	mindiff:0,
	diffrad:"RANDOM",
	answShow:"INLINE",
	answMin:true,
	answMax: true,
	qCount:10
}
/* qsheet object definition:
	{
	prettyName: the name of the sheet to be displayed to the user.
	gen('divname'): generate the quesiton set in the div provided.
	}
	
	
*/


function loadQuestionSet(e){
	// run the associated generator
	_loadQuestionSet(e.currentTarget.id.slice(6))
}
var cacheName;
function _loadQuestionSet(name){
	cacheName=name;
	$("#buttons").hide();
	$("#contentButtons").show();
	$("#contentDiv").empty();
	initDiff();
	let rootdiv=$("#contentDiv")[0]
	let heading=document.createElement('h1');
	heading.innerHTML=qGens[name].prettyName;
	rootdiv.append(heading);
	
	var seedstring=metaSrand();
	printTo(rootdiv,"Question set code: '"+seedstring+"'. Keep this if you want to revisit or share a question set.");
	
	var iLink=document.createElement("a");
	//iLink.id="topHead"+i;
	//iLink.href="#"+iLink.id;
	iLink.addEventListener("click",toggleNextSibling);
	rootdiv.appendChild(document.createElement('br'));
	rootdiv.appendChild(iLink)
	iLink.innerHTML="Notes";
	iDiv=document.createElement("div")
	iDiv.style.display="none";
	rootdiv.append(iDiv);
	printTo(iDiv,qGens[name].notes)
	let instr=document.createElement('p');
	printTo(iDiv,qGens[name].instruction)
	rootdiv.append(instr);
	for (let i=0;i<setSettings.qCount;i++){
		tq=qGens[name].gen(rootdiv,cDiff);
		var aLink=document.createElement("a");
		aLink.innerHTML="Answer"
		aLink.addEventListener("click",toggleNextSibling);
		rootdiv.appendChild(aLink);
		iDiv=document.createElement("div")
		iDiv.style.display="none";
		rootdiv.append(iDiv);
		printTo(iDiv,tq.answerString);
		
		rootdiv.appendChild(document.createElement('hr'));
		//if 
		updateDiff();
	}
	
}

function regenSet(){
	_loadQuestionSet(cacheName);
}

function resetWindow(){
	window.location.href="index.html";
	$("#contentButtons").hide();
	$("#buttons").show();
	$("#contentDiv").empty();
}

var full_path_bits=[];

function layout(div,i,name){
	if (!i.prettyName)return;
	if (i.gen){
		//add it to the generators
		qGens[name]=i;
		//add it to the search list
		full_path_bits.push(i.prettyName);
		qSearch[name]={
			fullName:full_path_bits.join("/"),
			rel:i
		}
		full_path_bits.pop();
		a=document.createElement("a");
		a.innerHTML=i.prettyName;
		a.id="a_gen_"+name;
		a.href="?q="+name;
		//a.addEventListener("click",loadQuestionSet);
		div.appendChild(a);
		div.appendChild(document.createElement("br"));
	}else{
		//append prettyName to the pathname
		full_path_bits.push(i.prettyName)
		//append link to the current div
		btn=document.createElement("button");
		btn.innerHTML=i.prettyName;
		btn.addEventListener("click",toggleNextSibling);
		div.appendChild(btn);
		//make a lower level div inside current div
		let newDiv=document.createElement("div");
		newDiv.classList.add("subcat")
		div.appendChild(newDiv);
		//hide lower level div
		newDiv.style.display="none";
		//populate lower level div
		for (j in i){
			layout(newDiv,i[j],j);
		}
		full_path_bits.pop();
		div.appendChild(document.createElement("br"));
	}
}


var prestr; // for future optimisiation
function updateSearch(){
	query=$("#searchBox")[0].value.toLowerCase();
	if (query.length>0){
		$("#searchResults").show();
		$("#primaryList").hide();
		$("#searchResults").empty()
		for (j in qSearch){
			i=qSearch[j];
			if (i.fullName.toLowerCase().includes(query)){
				a=document.createElement("a");
				a.id="a_sch_"+j;
				//a.href="#"+a.id;
				a.text=i.fullName;
				a.addEventListener("click",loadQuestionSet);
				$("#searchResults").append(a);
				$("#searchResults").append("<br>");
			}
		}
	}else{
		$("#primaryList").show();
		$("#searchResults").hide();
	}
	
}

$(window).ready(()=>{
	for (i in qSheets) {
		layout($("#primaryList")[0],qSheets[i],i);
	}
	$("#reset").on("click",resetWindow)
	$("#regen").on("click",regenSet)
	$("#showOpts").on("click",toggleNextSibling)
	// Fake argument processing
	thisurl=window.location.href.split("?q=");
	if (thisurl.length>1){
		_loadQuestionSet(thisurl[1]);
	}
	$("#searchBox").on("keyup",updateSearch);
	$("#options>input").on("change", updateSettings)
})

//settings event handlers
function updateSettings(e){
	if (e.target.type=="checkbox") setSettings[e.target.name]=e.target.checked;
	else setSettings[e.target.name]=e.target.value;
	if (e.target.name=="mindiff"){
		setSettings[e.target.name]=parseFloat(e.target.value);
		if (parseFloat($('input[name="maxdiff"]')[0].value)<parseFloat(e.target.value))$('input[name="maxdiff"]')[0].value=e.target.value;
	}
	if (e.target.name=="maxdiff"){
		setSettings[e.target.name]=parseFloat(e.target.value);
		if (parseFloat($('input[name="mindiff"]')[0].value)>parseFloat(e.target.value))$('input[name="mindiff"]')[0].value=e.target.value;
	}
	if (e.target.name=="qCount"){
		setSettings[e.target.name]=parseInt(e.target.value);
	}
}



