function printTo(div,text){
	p=document.createElement("p");
	p.innerHTML=text;
	div.appendChild(p);
	
}

function toggleNextSibling(e){
	// Show the answer
	if (e.target.nextElementSibling.style.display=="block"){
		e.target.nextElementSibling.style.display="none";
		e.target.innerHTML=e.target.innerHTML.replace("Hide","Show");
	}else{
		e.target.nextElementSibling.style.display="block";
		e.target.innerHTML=e.target.innerHTML.replace("Show","Hide");
	};
	return false;
}

