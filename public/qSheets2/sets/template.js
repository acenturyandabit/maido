/*//TODO:
- Difficulty scaling
- Minimal answers
- Full answers
*/

qSheets.create("path/to/sheet", {
	prettyName: "Name to be displayed to the user.",
	notes: "Teaching material, probably.",
	instruction: "Have a go at these questions!",
	data: {}, // Store information about the last generated question between calls to subfunctions.
	gen: [function (difficulty) { // Generate a single question, returning divs for the question, min answer, and max answer.
			let qdiv=document.createElement('div');
			let a_min_div=document.createElement('div');
			let a_max_div=document.createElement('div');
			let questionString = "";
			//generate expression
			//display it
			render(qdiv, questionString);

			/*
			if (setSettings.answMax){
				//Now for the answer!
				aLink=document.createElement("a");
				aLink.id=thisSetName+"_a"+i;
				//aLink.href="#"+aLink.id;
				aLink.addEventListener("click",toggleNextSibling);
				aLink.innerHTML="Show full answer";
				rootdiv.append(aLink);
				aDiv=document.createElement("div")
				rootdiv.append(aDiv);
				aDiv.style.display="none";
				
				//const postIntegral=['-cos','sin','tan'];
				let quadrant=cardinalise(nicePi(innerVal,'quadrant'));
				printTo(aDiv,"The base angle of "+nicePi(innerVal)+" in the region &#960;&lt;x&le;0 is "+nicePi(baseVal)+", giving a base value of " +nicePi(baseVal,expressions[qtype])+".");
				if (nicePi(baseVal,expressions[qtype])!="undefined" && nicePi(baseVal,expressions[qtype])!="0"){
					printTo(aDiv,"The angle is in the "+quadrant+" quadrant. "+expressions[qtype]+" is " +((nicePi(innerVal,expressions[qtype],true)<0)?"negative":"positive") + " in the " +quadrant+" quadrant.");
					printTo(aDiv,"Hence, the exact value of "+expressions[qtype]+"("+nicePi(innerVal)+") is "+nicePi(innerVal,expressions[qtype])+".");
				}
			}*/
			/*
			if (setSettings.answMin){
				//And the minimal answer:
				aLink=document.createElement("a");
				aLink.id=thisSetName+"_ma"+i;
				//aLink.href="#"+aLink.id;
				aLink.addEventListener("click",toggleNextSibling);
				rootdiv.appendChild(document.createElement('br'));
				aLink.innerHTML="Show minimal answer";
				rootdiv.append(aLink);
				aDiv=document.createElement("div")
				rootdiv.append(aDiv);
				aDiv.style.display="none";
				//generating answer
				
			}*/



			updateDiff();
			qdiv.appendChild(document.createElement('hr'));

			return {q:qdiv,a_min:a_min_div,a_max:a_max_div};
		}]
	}



})







