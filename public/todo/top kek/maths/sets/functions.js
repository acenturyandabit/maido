var thisSetName="my_awesome_name";

/*//TODO:
- Difficulty scaling
- Minimal answers
- Full answers
*/
qSheets.y12adv._category_._subcategory_[thisSetName]={
	prettyName:"Check out this awesome sheet!",	
	gen:function (divname){
		let rootdiv=$("#"+divname)[0];
		initDiff();
		// Make the heading
		let heading=document.createElement('h1');
		heading.innerHTML=this.prettyName;
		rootdiv.append(heading);
		
		var iLink=document.createElement("a");
		iLink.id="topHead"+i;
		//iLink.href="#"+iLink.id;
		iLink.addEventListener("click",toggleNextSibling);
		rootdiv.appendChild(document.createElement('br'));
		rootdiv.appendChild(iLink)
		iLink.innerHTML="Notes on the learning process";
		iDiv=document.createElement("div")
		iDiv.style.display="none";
		rootdiv.append(iDiv);
		printTo(iDiv,"Some preliminary information you want students to see.");
		
		
		//some rudimentary instruction
		let instr=document.createElement('p');
		instr.innerHTML="What do you want the students to do?";
		rootdiv.append(instr);
		
		for (let i=0;i<10;i++){
			let questionString="";
			//generate expression
			
			//display it
			printTo(rootdiv,questionString);
			
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
				
				
				
				
				
				printTo(aDiv,nicePi(innerVal,expressions[qtype]));
			}
			
			
			
			updateDiff();
			rootdiv.appendChild(document.createElement('hr'));
		}
	}
	
}