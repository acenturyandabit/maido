var thisSetName="my_awesome_name";

/*//TODO:
- Difficulty scaling
- Minimal answers
- Full answers
*/
qSheets.y12adv._category_._subcategory_[thisSetName]={
	prettyName:"Check out this awesome sheet!",
	notes: "Something to show in a note at the beginning of the sheet.",
	instruction: "Tell your students to do something!",
	data:{},// Store information about the last generated question between calls to subfunctions.
	gen:function (rootdiv,difficulty){ // Generate a single question.
		for (let i=0;i<10;i++){
			let questionString="";
			//generate expression
			
			//display it
			render(rootdiv,questionString);
			
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
			rootdiv.appendChild(document.createElement('hr'));
		}
	}
	
}