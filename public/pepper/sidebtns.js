
var editingID="";
function showEdit(id){
	editingID=id;
	$("#dialog p")[0].innerHTML="Click 'Submit' when you're done :)";
	$("#dialog p")[1].style.display="none";
	$("#dialog p")[2].innerHTML="";
	if (localDataCopy.items[id].type=='problem'){
		$("#dialog h2").text("Edit issue...");
		}else{
		$("#dialog h2").text("Edit recommendation...");
	}
	$("#dialogTA")[0].value=localDataCopy.items[id].text;
	$("#dialogTA").show();
	$("#dialog").show();
}


var delID="";
function showDelete(id){
	delID=id;
	$("#dialog h2").text("Are you sure you want to delete this?");
	$("#dialog p")[0].innerHTML="You won't be able to get this item back!";
	$("#dialog p")[1].style.display="none";
	$("#dialog p")[2].innerHTML="";
	$("#dialogTA").hide();
	$("#dialog").show();
}

linkingID="";
function showLinks(id){ //also handles link and unlink connections
	if (linkingID==""){
		drawLinks(id);
		}else{
		if (linkingID==id){//exit linking mode
			resetLinking();
			return;
		}
		if (localDataCopy.items[linkingID].connections.includes(id)){ //unlinking
			discussionDoc.collection("items").doc(linkingID).update({
				connections:firebase.firestore.FieldValue.arrayRemove(id)
			})
			discussionDoc.collection("items").doc(id).update({
				connections:firebase.firestore.FieldValue.arrayRemove(linkingID)
			})
			}else{
			if (localDataCopy.items[linkingID].type!=localDataCopy.items[id].type){
				discussionDoc.collection("items").doc(linkingID).update({
					connections:firebase.firestore.FieldValue.arrayUnion(id)
				})
				discussionDoc.collection("items").doc(id).update({
					connections:firebase.firestore.FieldValue.arrayUnion(linkingID)
				})
			}else{
				
				$("#linkShadow p").text("Link problems to solutions, so we can solve them! If you share a concern, add another problem entry [links are votes], and please link it to an appropriate solution!");
				$("#linkShadow p").addClass("flash");
				setTimeout(()=>{
					$("#linkShadow p").text("Click the link icon on darkened items to link problems and solutions. Press Escape or click a reset button when you're done!");
				},5000);
				setTimeout(()=>{
					$("#linkShadow p").removeClass("flash");
				},200);
			}
		}
	}
}

function drawLinks(id){
	linkingID=id;
	$("#body>div>div.listbox>div").each((i,e)=>{e.classList.add("inactive")});
	if (localDataCopy.items[id]){
		$("#"+id).removeClass("inactive");
		$("#"+id).parent().prepend($("#"+id)[0]);
		for (i in localDataCopy.items[id].connections){
			$("#"+localDataCopy.items[id].connections[i]).removeClass("inactive");
			$("#"+localDataCopy.items[id].connections[i]).parent().prepend($("#"+localDataCopy.items[id].connections[i])[0]);
		}
	}
	$("#linkShadow").show();
}

function resetLinking(){
	$("#body>div>div.listbox>div").removeClass("inactive");
	$("#linkShadow").hide();
	linkingID="";
	$(".linkIco").show();
}