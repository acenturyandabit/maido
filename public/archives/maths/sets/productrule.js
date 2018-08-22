/*
	TODO:
	difficulty levels
	question count
	minimal / extended answers
	// As much as possible, the difficulty of the question must exactly match localdiff. Otherwise the problems may be too easy or too hard.
*/

qSheets.y12adv.derivative.productrule={
	prettyName:"Product Rule (Polynomial only)",
	gen:function (divname){
		let rootdiv=$("#"+divname)[0];
		// Make the heading
		initDiff();
		let heading=document.createElement('h1');
		heading.innerHTML=this.prettyName;
		rootdiv.append(heading);
		
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
		printTo(iDiv,"For a minimal answer, we want 1) evidence that the product rule was used - by keeping the derivative in its expanded form, and 2) a simplified answer. That is all.")
		
		//some rudimentary instruction
		let instr=document.createElement('p');
		instr.innerHTML="Find the derivative of the following expressions with respect to x:";
		rootdiv.append(instr);
		
		
		
		
		
		
		for (let i=0;i<setSettings.qCount;i++){
			let coefficients=[];
			let questionString="(";
			//generate first part of expression
			
			let nTerms=2;
			if (cDiff>0.7)nTerms+=Math.round(rand()%100/100);
			coefficients.push(makeRandomPolynomial(nTerms));
			questionString+=printPolynomial(coefficients[0]);
			questionString+=")";
			
			//generate second part of expression: same as first, just more coefficients.
			questionString+="(";
			
			nTerms=2;
			nTerms+=Math.floor(cDiff/0.5);
			coefficients.push(makeRandomPolynomial(nTerms,{includeMaxCoeff:true}));
			questionString+=printPolynomial(coefficients[1]);
			questionString+=")";
			//display it
			printTo(rootdiv,questionString);
			
			//Now for the answer!
			if (setSettings.answMax){
				aLink=document.createElement("a");
				aLink.id="minihead_1_"+i;
				//aLink.href="#minihead_1_"+i;
				aLink.addEventListener("click",toggleNextSibling);
				aLink.innerHTML="Show full answer";
				
				rootdiv.append(aLink);
				aDiv=document.createElement("div")
				rootdiv.append(aDiv);
				
				//generating answer
				let aLine = "";
				let u=coefficients[0];
				let ud=differentiatePolynomial(coefficients[0]);
				let v=coefficients[1];
				let vd=differentiatePolynomial(coefficients[1]);
				
				aLine="u=";
				aLine+=printPolynomial(u);
				printTo(aDiv,aLine);
				
				aLine="u'=";
				aLine+=printPolynomial(ud);
				printTo(aDiv,aLine);
				
				aLine="v=";
				aLine+=printPolynomial(v);
				printTo(aDiv,aLine);
				
				aLine="v'=";
				aLine+=printPolynomial(vd);
				printTo(aDiv,aLine);
				
				printTo(aDiv,"By the product rule, df(x)/dx = uv' + vu':");
				
				printTo(aDiv,"=("+printPolynomial(u)+")("+printPolynomial(vd)+")+("+printPolynomial(v)+")("+printPolynomial(ud)+")");
				printTo(aDiv,"="+printPolynomial(multiplyPolynomials(u,vd))+"+"+printPolynomial(multiplyPolynomials(v,ud)));
				printTo(aDiv,"="+printPolynomial(addPolynomials(multiplyPolynomials(u,vd),multiplyPolynomials(v,ud))));
				aDiv.style.display="none";
			}
			//And the minimal answer:
			if (setSettings.answMin){
				aLink=document.createElement("a");
				aLink.id="minihead_2_"+i;
				//aLink.href="#minihead_2_"+i;
				aLink.addEventListener("click",toggleNextSibling);
				rootdiv.appendChild(document.createElement('br'));
				aLink.innerHTML="Show minimal answer";
				
				rootdiv.append(aLink);
				aDiv=document.createElement("div")
				rootdiv.append(aDiv);
				
				//generating answer
				u=coefficients[0];
				ud=differentiatePolynomial(coefficients[0]);
				v=coefficients[1];
				vd=differentiatePolynomial(coefficients[1]);
							
				printTo(aDiv,"By the product rule, df(x)/dx = uv' + vu':");
				
				printTo(aDiv,"=("+printPolynomial(u)+")("+printPolynomial(vd)+")+("+printPolynomial(v)+")("+printPolynomial(ud)+")");
				printTo(aDiv,"="+printPolynomial(addPolynomials(multiplyPolynomials(u,vd),multiplyPolynomials(v,ud))));
				aDiv.style.display="none";
			}
			rootdiv.appendChild(document.createElement('hr'));
			updateDiff();
			
		}
	}
	
}