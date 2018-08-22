var thisSetName="trigExactValsRad";

qSheets.y12adv.trigonometry[thisSetName]={
	prettyName:"Trigonometric functions: Exact values, radians",	
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
		printTo(iDiv,"There are many elements to memorise when familiarising yourself with exact values. "+
		"I recommend the following order of memorisation: "+
		"1. Memorise the sines, cosines and tans of the variables in degrees. "+
		"2. Memorise the conversions between degrees and radians. "+
		"3. Memorise the sines, cosines and tans of the variables in raidans (skipping the conversion step entirely). "+
		"4. Use the ASTC circle to identify the sign of the exact value; then memorise it so you don't need to draw it out. "+
		"5. Become comfortable with adding / subtracting 2n&#960; from the angle to find the base angle, where necessary.");
		printTo(iDiv,"This does imply that you may need 5 or more sessions to be able to do exact value trig like a 4U student, but you can do it!");
		//some rudimentary instruction
		
		var seedstring=metaSrand();
		printTo(rootdiv,seedstring);
		
		let instr=document.createElement('p');
		instr.innerHTML="Find the exact value of the following trigonometric ratios:";
		rootdiv.append(instr);
		
		for (let i=0;i<10;i++){
			let questionString="";
			//generate expression
			const expressions=['sin','cos','tan'];
			let qtype=rand()%3;
			let baseDeviation=5;
			let innerRange=baseDeviation*Math.floor(cDiff/0.15);
			let innerVal=(rand()%2-1)*innerRange+rand()%(2*baseDeviation)-baseDeviation;
			
			//Write the actual question
			//integral
			
			questionString+=expressions[qtype]+"("+nicePi(innerVal)+")";
			
			//display it
			printTo(rootdiv,questionString);
			
			let baseVal=(innerVal+nicePiNumerator.length*100) % nicePiNumerator.length;
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