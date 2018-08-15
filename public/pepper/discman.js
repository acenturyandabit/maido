
var discussionDoc;

var localDataCopy={
	items:{}
};

$(document).ready(()=>{
	let addr=window.location.href;
	k=RegExp("\\?discussion\\=([^\\&#]+)").exec(addr);
	if (k && k[1]){
		db.collection('pepper').doc(k[1]).get().then((doc)=>{
			if (doc.exists){
				//load stuff!
				discussionDoc=db.collection('pepper').doc(k[1]);				
				discussionDoc.get().then((r)=>{
					document.title="PEPPER: "+r.data().title;
				})
				discussionDoc.collection("items").onSnapshot(function(querySnapshot) {
					$("#body>div>div.listbox>div").each((i,e)=>{e.classList.add("unseen")});
					localDataCopy.items={};
					querySnapshot.forEach(function(doc) {
						if ($("#"+doc.id)[0]){
							$("#"+doc.id)[0].classList.remove("unseen");
							$("#"+doc.id+">p")[0].innerText=doc.data().text;
						}else{
							newItem=$('#template')[0].cloneNode(true)
							newItem.children[0].innerText=doc.data().text;
							newItem.id=doc.id;
							newItem.style.display="block";
							$("#"+doc.data().type+"_box>.listbox").append(newItem);
						}
						if (doc.data().connections)$("#"+doc.id+">span>span").text(doc.data().connections.length);
						localDataCopy.items[doc.id]=doc.data();
						if (!localDataCopy.items[doc.id].connections)localDataCopy.items[doc.id].connections=[];
					});
					$("#body>div>div.listbox>div.unseen").remove();
					$("#loading").hide();
					if (linkingID!=""){//update linking if working on linking.
						drawLinks(linkingID);
					}
					//sort all elements and read them
					sortable=[];
					for (v in localDataCopy.items){
						sortable.push([localDataCopy.items[v].connections.length,v,localDataCopy.items[v].type]);
					}
					sortable.sort((a,b)=>{return a[0]-b[0]});
					for (i in sortable){
						$("#"+sortable[i][2]+"_box>div.listbox").prepend($("#"+sortable[i][1]));//reinsert them all in
					}
					//perform a roughly complexity n swap sort from top and bottom
					
					// let kappa=['problems','solutions'];
					// let lst;
					// let max;
					// let hold;
					// for (j=0;j<2;j++){
						// lst=$("#"+kappa[j]+">div.listbox>div span.linkCount");
						// max=0;
						// hold=undefined;
						// for (i in lst){
							// if (!isNaN(i)){
								// if (i>max)max=i;
								// if (hold){
									// if (Number(hold.innerText)>=Number(lst[i].innerText)){
										// $(lst[i].parentNode.parentNode).insertBefore(hold.parentNode.parentNode);
										// break;
									// }
								// }
								// if (lst[i+1] && Number(lst[i].innerText)<Number(lst[i+1].innerText)){
									// hold=lst[i];
								// }
							// }
						// }
						// hold=undefined;
						// //backwards pass
						// for (i in lst){
							// if (!isNaN(i)){
								// i=max-i;
								// if (hold){
									// if (Number(hold.innerText)<=Number(lst[i].innerText)){
										// $(lst[i].parentNode.parentNode).insertAfter(hold.parentNode.parentNode);
										// break;
									// }
								// }
								// if (lst[i-1] && Number(lst[i].innerText)>Number(lst[i-1].innerText)){
									// hold=lst[i];
								// }
							// }
						// }
					// }
					//lol that took a while
				});
				}else{
				//throw a 404
				bits=window.location.href.split("/");
				bits[bits.length-1]="404.html";
				window.location.href=bits.join("/");
			}
			// load everything
			//console.log("opened"+k[1]);
		})
		}else{
		//show splash
		$("#splash").show();
	}
})

//db.collection

var ccds;

function joindiscussion(create=false){
	// hash the discussion name using the password, then put it to the server
	dpw=$("#password")[0].value;
	psum=1;
	for (let i=0;i<dpw.length;i++){
		psum*=dpw.charCodeAt(i);
	}
	srand(psum);
	did=$("#discussionID")[0].value;
	ccds=[];
	for (let i=0;i<25;i++)ccds[i]=0;
	for (let i=0;i<did.length;i++){
		ccds[i%25]+=did.charCodeAt(i)*rand();
	}
	//pad to 25 characters if not the same DID
	for (let i=did.length;i<25;i++){
		ccds[i%25]=rand();
	}
	allowedChars=[];
	for (let i='a'.charCodeAt(0);i<'z'.charCodeAt(0);i++)allowedChars[allowedChars.length]=String.fromCharCode(i);
	for (let i='0'.charCodeAt(0);i<'9'.charCodeAt(0);i++)allowedChars[allowedChars.length]=String.fromCharCode(i);
	for (let i='A'.charCodeAt(0);i<'Z'.charCodeAt(0);i++)allowedChars[allowedChars.length]=String.fromCharCode(i);
	for (let i=0;i<25;i++){
		ccds[i]=allowedChars[ccds[i]%allowedChars.length];
	}
	ccds=ccds.join("");
	//check if the discussion has already been taken
	doc=db.collection("pepper").doc(ccds);
	doc.get().then((d)=>{
		if (d.exists){
			if (create){
				$("#sorrytaken").show();
				$("#spellcheck").hide();
				}else{
				window.location.href+="?discussion="+ccds;
			}
			}else{
			if(create){
				//create a new document
				db.collection("pepper").doc(ccds).set({
					title:did
					}).then(()=>{
					window.location.href+="?discussion="+ccds;
					//navigate away!
				});
				}else{
				$("#spellcheck").show();
				$("#sorrytaken").hide();
			}
		}
	})
}



var preseed=0;

function srand(newPreseed){
	if (newPreseed.length){//process strings as well
		let k=0;
		for (i in newPreseed){
			k+=newPreseed.charCodeAt(i)
		}
		newPreseed=k;
	}
	preseed=newPreseed;
}

function rand(){ // returns a rather large integer.
	return preseed = preseed * 16807 % 2147483647;
}