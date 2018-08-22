var thisSetName="fractional_integrals";

/*//TODO:
- Difficulty scaling
- Minimal answers
- Full answers
*/
qSheets.y12adv.integration[thisSetName]={
	prettyName:"Fractional Integrals",	
	gen:function (divname){
		let rootdiv=$("#"+divname)[0];
		initDiff();
		
		// Make the heading
		let heading=document.createElement('h1');
		heading.innerHTML=this.prettyName;
		rootdiv.append(heading);
		printTo(rootdiv,"Seed:"+metaSrand());
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
		printTo(iDiv,"N.B. This sheet requires an understanding of Logs and Exponentials. If you haven't yet done this topic, maybe try those sheets first.");
		printTo(iDiv,"There are various ways of dealing with fractions. For Advanced Maths, you will need to know the following:");
		printTo(iDiv,"int(f'(x)/f(x)) = ln (f(x)) + C.");
		printTo(iDiv,"int(1/(ax+b)^n) = int((ax+b)^-n) = -(n+1)/a (ax+b)^-(n+1) + C.");
		//some rudimentary instruction
		let instr=document.createElement('p');
		instr.innerHTML="Integrate the following expressions.";
		rootdiv.append(instr);
		let integralSign="&#8747;";
		for (let i=0;i<10;i++){
			let questionString="";
			//generate expression
			let qtype=rand()%2;
			let definite=rand()%2;
			let lowerStr="";
			let upperStr="";
			let lowerFracConst=(rand()%5)*2-3;
			let upperFracConst=(rand()%5)*2-3;
			let lowerPoly;
			let aLp;
			let powerConstant;
			switch (qtype){
				case 0:
					//generate the lower polynomial
					lowerPoly=makeRandomPolynomial(4);
					aLp=multiplyPolynomials([lowerFracConst],lowerPoly);
					lowerStr=printPolynomial(aLp);
					//generate the upper polynomial
					upperStr=printPolynomial(multiplyPolynomials([upperFracConst],differentiatePolynomial(lowerPoly)));
				break;
				case 1:
					lowerPoly=makeRandomPolynomial(2);
					aLp=multiplyPolynomials([lowerFracConst],lowerPoly);
					powerConstant=rand()%5+1;
					lowerStr="("+printPolynomial(aLp)+")<sup>"+powerConstant+"</sup>";
					upperStr=(rand()%5)*2-3;
				break;
			}
			
			questionString=integralSign;
			if (definite){
				// generate upper and lower limits
				let upperLimit=(rand()%5)*2-3;
				let lowerLimit=(rand()%5)*2-3;
				questionString+="<span class='supsub'><sup>"+upperLimit+"</sup>"+"<sub>"+lowerLimit+"</sub></span>";
			}
			questionString+="   <span class='frac'><sup>"+upperStr+"</sup><sub>"+lowerStr+"</sub></span>";
			//display it
			questionString+="dx";
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
			}
			
			
			
			updateDiff();
			rootdiv.appendChild(document.createElement('hr'));
		}
	}
	
}