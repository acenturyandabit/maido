
function showNewIssue(){
	$("#dialog h2").text("Enter a new issue");
	$("#dialog p")[0].innerHTML="Please describe it in detail, so your compatriots know what <i>exactly</i> the bejeesus is going wrong.";
	$("#dialog p")[1].style.display="block";
	$("#dialog p")[1].innerHTML="It would be nice to include some good things about the current situation as well!";
	$("#dialog p")[2].innerHTML="Spot any related solutions? Don't forget to connect them, and help us solve your problem!";
	$("#dialogTA")[0].value="";
	$("#dialogTA").show();
	$("#dialog").show();
}



function showNewRecommend(){
	$("#dialog h2").text("Enter a new recommendation");
	$("#dialog p")[0].innerHTML="Please describe it in detail, so everyone knows how brilliant your solution is!";
	$("#dialog p")[1].style.display="none";
	$("#dialog p")[2].innerHTML="Spot any related problems? Help us connect them!";
	$("#dialogTA")[0].value="";
	$("#dialogTA").show();
	$("#dialog").show();
}


function dialogSubmit(){
	if ($("#dialogTA")[0].value!=""){
		switch($("#dialog h2").text()){
			case "Enter a new recommendation":
			discussionDoc.collection("items").add({"text":$("#dialogTA")[0].value, "connections":[],"type":'solution'})
			break;
			case "Enter a new issue":
			discussionDoc.collection("items").add({"text":$("#dialogTA")[0].value, "connections":[],'type':'problem'})
			break;
			case "Edit issue...":
			case "Edit recommendation...":
			discussionDoc.collection("items").doc(editingID).update({"text":$("#dialogTA")[0].value});
			editingID="";
			break;
		}
	}
	//unvalidated cases
	switch($("#dialog h2").text()){
		case "Are you sure you want to delete this?":
		if (linkingID==delID){
			resetLinking();
		}
		discussionDoc.collection("items").doc(delID).delete();
		delID="";
	}
	$("#dialog").hide();
}

// mass event handling (?)


const catchy=["goes well with salt",": Engine for Prompt Problem Engagement and Resolution","est. 2018"];
$(document).ready(()=>{
	srand(Date.now());
	$("#header>span:nth-child(2)").text(catchy[rand()%catchy.length]);
	$(".listbox").on("click",".editIco",function(e){
		showEdit(e.currentTarget.parentNode.id);
	})
	$(".listbox").on("click",".linkIco",function(e){
		showLinks(e.currentTarget.parentNode.id);
	})
	$(".listbox").on("click",".deleteIco",function(e){
		showDelete(e.currentTarget.parentNode.id);
	})
	$("#body>div>div.status>button").on("click",(e)=>{//reset filters
		if (linkingID!=""){
			//if linking mode, reactivate everything
			resetLinking();
			}else{
			$("#"+e.parentNode.parentNode.id+">div.listbox>div").removeClass("inactive");
		}
		//Reactivate everything on that side if not linking mode
		
	});
	$('body').on("keydown",(e)=>{
		if (e.keyCode==27){
			resetLinking(); //and maybe some other reset stuff
		}
	});
	$(".filter").on("keyup",(e)=>{
		if (e.currentTarget.value!=""){
			let id=e.currentTarget.parentNode.parentNode.id;
			$("#"+id+">div.listbox>div").addClass("inactive");
			$("#"+id+">div.listbox>div:contains("+e.currentTarget.value+")").each((i,e)=>{
				e.classList.remove("inactive");
				$("#"+id+">div.listbox").prepend(e);
			});
		}else{
			$("#"+e.currentTarget.parentNode.parentNode.id+">div.listbox>div").removeClass("inactive");
		}
	});
})