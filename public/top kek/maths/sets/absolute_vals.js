var thisSetName="absVals";

qSheets.y12adv.arithAlg[thisSetName]={
	prettyName:"Absolute values questions (Advanced Maths)",
	gen:function (divname){
		let rootdiv=$("#"+divname)[0];
		initDiff();
		// Make the heading
		let heading=document.createElement('h1');
		heading.innerHTML=this.prettyName;
		rootdiv.append(heading);
		
		var seedstring=metaSrand();
		printTo(rootdiv,seedstring);
		
		var iLink=document.createElement("a");
		iLink.id="topHead"+i;
		//iLink.href="#"+iLink.id;
		iLink.addEventListener("click",toggleNextSibling);
		rootdiv.appendChild(document.createElement('br'));
		rootdiv.appendChild(iLink)
		iLink.innerHTML="Notes on minimal answer";
		iDiv=document.createElement("div")
		iDiv.style.display="none";
		rootdiv.append(iDiv);
		printTo(iDiv,"For a minimal answer, we want 1) a correct integration, then 2) a correct evaluation.");
		
		//some rudimentary instruction
		let instr=document.createElement('p');
		instr.innerHTML="Evaluate the following integrals. Leave your answers in exact form:";
		rootdiv.append(instr);
		
		for (let i=0;i<10;i++){
			let coefficients=[];
			let integralSign="&#8747;";
			let questionString="";
			
			//generate expression
			const expressions=['sin','cos','sec<sup>2</sup>'];
			let expressionType=rand()%expressions.length;
			
			//generate inner function; nonzero x coefficient
			let xcoef;
			let isFrac=false;
			while (!(xcoef=rand()%6-3));
			if (xcoef<4 && !(rand()%5))isFrac=true;
			
			//generate inner constant term
			let innerConstant=rand()%18-9;
			
			//generate outside constant
			let exteriorConstant;
			while (!(exteriorConstant=rand()%20-10));
			//generate limits.
			
			// form of the limit is just an integer, where the int mod [length of above] is the factor to add, the int / [length of above] is the number of times pi is added.
			let upperLimit;
			let lowerLimit;
			
			let correlates=[
				[0,1,2,3,4,5,6,7],
				[0,1,3,4,6,7],
				[0,2,4,5],
				[0,1,3,4,6,7],
				[0,1,2,3,4,5,6,7],
				[0,2,4,5],
				[0,1,3,4,6,7],
				[0,1,3,4,6,7]
			]
			
			do{
			
				if (expressionType<2){
					lowerLimit=rand()%30-15;
					upperLimit=rand()%30-15;
				}else{
					let centre=rand()%3;
					centre*=nicePiNumerator.length;
					upperLimit=centre+rand()%nicePiNumerator.length-nicePiNumerator.length/2;
					lowerLimit=centre+rand()%nicePiNumerator.length-nicePiNumerator.length/2;
				}
				
				
				//if you implement increasing difficulty levels, then make the rearrangement not happen on higher difficulties.
				if (upperLimit<lowerLimit){
					let k=upperLimit;
					upperLimit=lowerLimit;
					lowerLimit=k;
				}
			}while (!(correlates[(innerConstant+800)%8].includes((upperLimit+800)%8) && correlates[(innerConstant+800)%8].includes((lowerLimit+800)%8)));
			
			
			//Write the actual question
			//integral
			questionString+=integralSign+"<span class='supsub'><sup>"+nastyPi(upperLimit,xcoef,isFrac)+"</sup>"+"<sub>"+nastyPi(lowerLimit,xcoef,isFrac)+"</sub></span>";
			
			//inner function
			innerPiConstant=nicePi(innerConstant);
			innerPiConstant=((innerPiConstant==0)?"":(((innerPiConstant[0]=='-')?"":"+")+innerPiConstant))
			questionString+=printNice(exteriorConstant,expressions[expressionType]+"("+printPolynomial([0,(isFrac)?xcoef:"1/"+xcoef])+innerPiConstant+")dx");
			
			
			//display it
			printTo(rootdiv,questionString);
			/*
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
				
				const postIntegral=['-cos','sin','tan'];
				printTo(aDiv,"The integral of"+expressions[expressionType]+" is "+postIntegral[expressionType]+".");
				if (innerpoly[1]!=1){
				printTo(aDiv,"Since the internal expression has an x-coefficient of "+innerpoly[1]+", we need to multiply our answer by 1/"+innerpoly[1]+".");
				}
				printTo(aDiv,"This gives us the integrated expression ("+exteriorConstant + "/" + innerpoly[1] + ")" + postIntegral[expressionType] + "("+printPolynomial(innerpoly)+").");
				printTo(aDiv,"Then, finally, we evaluate our integral from "+nicePi(upperLimit)+"to"+nicePi(upperLimit)+".");
				printTo(aDiv,"This gives us the exact value "+exteriorConstant + "/" + innerpoly[1] + " x (" +nicePi(upperLimit,postIntegral[expressionType])+"-"+nicePi(lowerLimit,postIntegral[expressionType])+").");
				printTo(aDiv,"(You may simplify this if you can.)");
				
				
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
				
			*/
			
			
			updateDiff();
			rootdiv.appendChild(document.createElement('hr'));
		}
	}
	
}