var thisSetName="drawgraphs";

/*//TODO:
- Difficulty scaling
- Minimal answers
- Full answers
*/
qSheets.y12adv[thisSetName]={
	prettyName:"Drawing graphs of functions",	
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
		iLink.innerHTML="Parabola checklist";
		iDiv=document.createElement("div")
		iDiv.style.display="none";
		rootdiv.append(iDiv);
		printTo(iDiv,"Vertex, focus, directrix, axis of symmetry.");
		
		
		//some rudimentary instruction
		/*
		let instr=document.createElement('p');
		instr.innerHTML="What do you want the students to do?";
		rootdiv.append(instr);
		*/
		
		for (let i=0;i<10;i++){
			let questionString="";
			//generate expression
			let qtype=rand()%7;
			let yorx;
			let xory;
			pDiv=document.createElement("div");
			rootdiv.append(pDiv);
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
				aCv=document.createElement("canvas")
				aCv.width=500;
				aCv.height=500;
				ctx=aCv.getContext('2d')
				aDiv.append(aCv);
				//generating answer
			}			
			switch (qtype){
				case 0:
					coefs = makeRandomPolynomial(3,{allNonZero:true});
					questionString="Graph the function "+printNice(coefs[0],"x")+printNice(coefs[1],"y",true)+printNice(coefs[2],'',true)+"=0.";
					//draw axes
					ctx.beginPath();
					const cenX=250;
					const cenY=250;
					const maxX=10;
					const maxY=10;
					function toInnerCoords(){
						
					}
					ctx.moveTo(0,cenX);
					ctx.lineTo(cenY*2,cenX);
					ctx.moveTo(cenY,0);
					ctx.lineTo(cenY,cenX*2);
					ctx.moveTo(-750,250-coefs[0]/coefs[1]*-1000-coefs[2]/coefs[1]);
					ctx.lineTo(1250,250-coefs[0]/coefs[1]*1000-coefs[2]/coefs[1]);
					ctx.closePath();
					ctx.stroke();
					break;
				case 1:
					//Parabolae: general form
					yorx=(rand()%2)?'y':'x';
					xory=(yorx=='y')?'x':'y';
					coefs = makeRandomPolynomial(3,{allNonZero:true});
					questionString="Graph the function "+yorx+"="+printPolynomial(coefs,xory)+".";
					break;
				case 2:
					//Parabolae: vertex form, x
					yorx=(rand()%2)?'y':'x';
					xory=(yorx=='y')?'x':'y';
					coefs = makeRandomPolynomial(4,{allNonZero:true});
					questionString="Graph the function "+printNice(coefs[0],yorx)+"="+printNice(coefs[1],'(')+xory+printNice(coefs[2],'',true)+')<sup>2</sup>'+printNice(coefs[3],'',true)+".";
					break;
				case 3:
					//circles
					coefs = makeRandomPolynomial(3,{includeMaxCoeff:true});
					questionString=("Graph the function "+
						((coefs[0])?"(":'')+'x'+printNice(coefs[0],'',true)+((coefs[0])?")":'')+"<sup>2</sup>+"+
						((coefs[1])?"(":'')+'y'+printNice(coefs[1],'',true)+((coefs[1])?")":'')+"<sup>2</sup>"+
						"="+coefs[2]**2);
					break;
				case 4:
					//random polynomial
					questionString=("Graph the "+((rand()%2)?"function f(x)=":'polynomial y=')+printPolynomial(makeRandomPolynomial(5)))+".";
					break;
				case 5:
					//trig and that's it
					const trigQtypes=['cos','sin','sec','tan','cosec','cot'];
					questionString="Graph the function y=" +printNice(rand()%5*2-3,trigQtypes[rand()%trigQtypes.length])+"("+printPolynomial(makeRandomPolynomial(2))+").";
					break;
				case 6: 
					//exponentials yay
					questionString="Graph the function y=" +printNice(rand()%5+2,"<sup>"+printNice((rand()%5)*2-2)+"x</sup>")+".";
					break;

					//ok theres a lot of absolute values :3
					//absolute y side?
					//absolute x side?
					//absolute x itself?
					//absolute y itself?
					//just randomly throw absolute values here n there?
			}
			printTo(pDiv,questionString)
			
			//display it
			
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