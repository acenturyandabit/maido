var setsadded=0;
function addSet(setname, detract) {
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET",'https://chicksquares.herokuapp.com/addSet?setname=' + setname, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			// JSON.parse does not evaluate the attacker's scripts.
			setsadded++;
			var resp = JSON.parse(xhr.responseText);
			if (resp) {
				if (resp.infos){
					for (var i = 0; i < resp.infos.length; i++) {
						infos.push(resp.infos[i]);
					}
					rehash();
				}
				if (resp.descname)for (var i = 0; i < resp.descname.length; i++) {
					Object.defineProperty(desc, resp.descname[i], {
						value: resp.descgroup[i],
						writable: true
					});
				}
				if (resp.namename)for (var i = 0; i < resp.namename.length; i++) {
					Object.defineProperty(names, resp.namename[i], {
						value: resp.namegroup[i],
						writable: true
					});
				}
				$("#setlist")[0].innerHTML += "<li>" + setname + "</li>";
				$("#avsetdv p:contains("+setname+")").detach();
				sets.push(setname);
				if(detract)u_e-=resp.setCost;
			} else {
				$("#addbox")[0].value = "Invalid :/";
			}
		}
	};
	xhr.send();
}


function getUserSets() { //get sets to add to the list, based on num of eggs.
	var xhr = new XMLHttpRequest();
	xhr.open("GET", 'https://chicksquares.herokuapp.com/userSets', true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			// JSON.parse does not evaluate the attacker's scripts.
			var resp = JSON.parse(xhr.responseText);
			for (var i of resp)infos.push(JSON.parse(i.data));
			rehash();
		}
	};
	xhr.send();
}

$(document).ready(cfactoryInit);
function cfactoryInit(){
	$("#factNameTB").on("change", factChngName);
	$("#factDescTB").on("change", factChngDesc);
}
function factChngName(){
	factoryinfo.name=$("#factNameTB")[0].value;
}
function factChngDesc(){
	factoryinfo.desc=$("#factDescTB")[0].value;
}
function submitUserBirb() { //get sets to add to the list, based on num of eggs.
	//validate
	if (factoryinfo.name.length>0 && factoryinfo.desc.length>0 && u_e>500){
		if (u_e>500){
			var xhr = new XMLHttpRequest();
			xhr.open("POST", 'https://chicksquares.herokuapp.com/pushBirb', true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(factoryinfo));
			u_e-=500;
			$("#sendBirb")[0].innerHTML="Done!";
			setTimeout(resetAddBtn,2500);
		} else{
			$("#sendBirb")[0].innerHTML="Not Enough Eggs!";
			setTimeout(resetAddBtn,2500);
		}
	}else{
		$("#sendBirb")[0].innerHTML="Please Enter Name and Description!";
		setTimeout(resetAddBtn,2500);
	}
}
function resetAddBtn(){
	$("#sendBirb")[0].innerHTML="Submit (500 eggs)";
}


var nextQuery;
function getsto() { //get sets to add to the list, based on num of eggs.
	var xhr = new XMLHttpRequest();
	xhr.open("GET", 'https://chicksquares.herokuapp.com/listSets?eggs=' + u_e, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			// JSON.parse does not evaluate the attacker's scripts.
			var resp = JSON.parse(xhr.responseText);
			for (var i of resp.sets) {
				if (!($("#avsetdv p:contains("+i.name+")").length || $("#setlist li:contains("+i.name+")").length)) {
				$("#avsetdv").append("<p>" + i.name + " (" + i.cost + " eggs)</p>");
				}
			}
			nextQuery=resp.nextCall;
		}
	};
	xhr.send();
}