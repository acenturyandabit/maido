var thisSetName="circularMotion";

/*//TODO:
- THIS TOOK 6 HOURS LOL
- Minimal answers
- Full answers
*/

//How questions are structured
/*
	
	
	
	
	
	
	
	
*/




qSheets.HSCPhys[thisSetName]={
	prettyName:"Circular Motion",
	notes: "Circular motion questions.",
	instruction: "",
	tmp:{},// Store information about the last generated question between calls to subfunctions.
	
	eqns:[{
		solve: function (vars){
			let a=vars.a;
			let v=vars.v;
			let r=vars.r;
			if (a==undefined){
				return (v*v/r);
			}
			if (v==undefined){
				return Math.sqrt(a*r);
			}
			if (r==undefined){
				return (v*v/a);
			}
		},
		vars: ['a','v','r'],
		statement_sets:[
			[//boring set. Steven Liu 2018
				{type:"unit",ref:["a"],data:"ms^-2"},
				{type:"unit",ref:["v"],data:"ms^-1"},
				{type:"unit",ref:["r"],data:"m"},
				{type:"prompt",data:"A particle is moving in uniform circular motion."},
				{type:"info",ref:["a"],data:"The centripetal acceleration of the particle is {a}."},
				{type:"info",ref:["v"],data:"The particle is travelling at {v}."},
				{type:"info",ref:["r"],data:"The radius of the circle is {r}."},
				{type:"query",ref:["a"],data:"What is the acceleration of the particle?"},
				{type:"query",ref:["v"],data:"How fast is the particle moving?"},
				{type:"query",ref:["r"],data:"What is the radius of the circle?"},
				{type:"answer",ref:["a"],data:"The acceleration of the particle is given by a=v^2/r. The numerical value is {a}."},
				{type:"answer",ref:["v"],data:"The speed of the particle is given by v=sqrt(r*a). The numerical value is {v}."},
				{type:"answer",ref:["r"],data:"The radius of the circle is given by r=v^2/a. The numerical value is {r}."}
			],
			[
				{type:"unit",ref:["a"],data:"x10^6 ms^-2"},
				{type:"unit",ref:["v"],data:"x10^3 ms^-1"},
				{type:"unit",ref:["r"],data:"x10^6 m"},
				{type:"prompt",data:"A planet is orbiting around a star."},
				{type:"info",ref:["a"],data:"The acceleration experienced by the planet is {a}."},
				{type:"info",ref:["v"],data:"The planet moves at a speed of {v}."},
				{type:"info",ref:["r"],data:"The radius of the planet's orbit is {r}."},
				{type:"query",ref:["a"],data:"What is the gravitational acceleration of the planet??"},
				{type:"query",ref:["v"],data:"How fast is the planet moving?"},
				{type:"query",ref:["r"],data:"How far is the planet from the star?"},
				{type:"answer",ref:["a"],data:"The acceleration of the planet is given by a=v^2/r. The numerical value is {a}."},
				{type:"answer",ref:["v"],data:"The speed of the planet is given by v=sqrt(r*a). The numerical value is {v}."},
				{type:"answer",ref:["r"],data:"The radius of the planet's orbit is given by r=v^2/a. The numerical value is {r}."}
			]
		]
	},{
		solve: function (vars){
			let v=vars.v;
			let r=vars.r;
			let t=vars.t;
			if (v==undefined){
				return 2*Math.PI*r/t;
			}
			if (r==undefined){
				return 2*Math.PI*v*t;
			}
			if (t==undefined){
				return 2*Math.PI*r/v;
			}
		},
		vars: ['v','r','t'],
		statement_sets:[
			[
				{type:"unit",ref:['v'],data:"ms^-1"},
				{type:"unit",ref:['r'],data:"m"},
				{type:"unit",ref:['t'],data:"s"},
				{type:"prompt",data:"A particle is moving in uniform circular motion."},
				{type:"info",ref:["v"],data:"The particle is travelling at {v}."},
				{type:"info",ref:["r"],data:"The radius of the circle is {r}."},
				{type:"info",ref:["t"],data:"The particle takes {t} to go around the circle."},
				{type:"query",ref:["v"],data:"How fast is the particle moving?"},
				{type:"query",ref:["r"],data:"What is the radius of the circle?"},
				{type:"query",ref:["t"],data:"How long does it take for the particle to go around the circle?"},
				/*{type:"answer",ref:["v"],data:"The speed of the particle is given by v=sqrt(r*a). The numerical value is {v}."},
				{type:"answer",ref:["r"],data:"The radius of the circle is given by r=v^2/a. The numerical value is {r}."}
				{type:"answer",ref:["t"],data:"The acceleration of the particle is given by a=v^2/r. The numerical value is {a}."},*/
			]
		]
	}/*,{
		prompt:"A particle is moving in uniform circular motion.",
		solve: function (vars){
			let v=vars[0];
			let r=vars[1];
			let m=vars[2];
			let f=vars[2];
			if (v==undefined){
				return Math.sqrt(f*r/m);
			}
			if (r==undefined){
				return m*v*v/f;
			}
			if (m==undefined){
				return f*r/v/v;
			}
			if (f==undefined){
				return m*v*v/r;
			}
		},
		vars: [{//velocity
				units:"ms^-1",
				info:"The particle is travelling at <>.",
				query:"What is the velocity of the particle?"
			},
			{//radius
				units:"m",
				info:"The radius of the circle is <>.",
				query:"What is the radius of the circle?"
			},
			{//mass
				units:"kg",
				info:"The particle has a mass of <>.",
				query:"What is the mass of the particle?"
			},
			{//force
				units:"N",
				info:"The centripetal force experienced by the particle is <>.",
				query:"What is the centripetal force experienced by the particle?"
			}
		]
	},{
		prompt:"A particle is travelling with a fixed angular velocity.",
		solve: function (vars){
			let t=vars[0];
			let th=vars[1];
			let w=vars[2];
			if (t==undefined){
				return th/w;
			}
			if (th==undefined){
				return w*t;
			}
			if (w==undefined){
				return th/t;
			}
		},
		vars: [{//time
				units:"s",
				info:"The particle travels for <>.",
				query:"How long has the particle been travelling?"
			},
			{//theta (angle)
				units:"radians",
				info:"The particle has an angular displacement of <>.",
				query:"What is the particle's angular displacement?"
			},
			{//omega
				units:"rad/s",
				info:"The particle's angular velocity is <>.",
				query:"What is the angular velocity of the particle?"
			}		
		]
	}*/
	
	
	
	
	
	],
	
	
	gen:function (rootdiv,difficulty){ // Generate a single question.
		//choose an equation
		this.tmp.equation=rand()%this.eqns.length;
		let equation=this.eqns[this.tmp.equation];
		
		//pick a variable from the equation to solve for
		this.tmp.leaveOut=rand()%equation.vars.length;
		this.tmp.leaveOut=equation.vars[this.tmp.leaveOut];
		
		this.tmp.vars={};
		//generate a random value for each variable.
		for (i in equation.vars){
			this.tmp.vars[equation.vars[i]]=rand()%100;
		}
		
		//remove the specified variable and solve the equation.
		this.tmp.vars[this.tmp.leaveOut]=undefined;
		this.tmp.vars[this.tmp.leaveOut]=equation.solve(this.tmp.vars);
		
		///render the equation
		//choose statement set
		this.tmp.ssi=rand()%equation.statement_sets.length;
		let statement=equation.statement_sets[this.tmp.ssi];
		
		//step through things we need to print
		let varUnits={};
		let toPrint=[];//buffer of stuff to print
		let possible={};
		possible.prompt=[];
		possible.query=[];
		possible.info=[];
		possible.answer=[];
		for (i in statement){
			switch (statement[i].type){
				case "unit":
					varUnits[statement[i].ref[0]]=statement[i].data;
					break;
				case "prompt":
					possible.prompt.push(statement[i].data);
					break;
				case "query":
				case "answer":
					if (statement[i].ref[0]==this.tmp.leaveOut)possible[statement[i].type].push(Object.assign({},statement[i]));
					break;
				case "info":
					if (!statement[i].ref.includes(this.tmp.leaveOut))possible.info.push(Object.assign({},statement[i]));
					break;
			}
		}
		//shuffle the questions
		for (i in possible){
			possible[i]=shuffle(possible[i]);
		}
		//write out prompt
		printTo(rootdiv,possible.prompt[0]);
		//write out info
		let varsCopy=equation.vars.slice(0);//copy the vars
		varsCopy.splice(varsCopy.indexOf(this.tmp.leaveOut),1);
		for (i in possible.info){
			if (possible.info[i].ref.every((i)=>{return varsCopy.includes(i)})){
				tmpPrint=possible.info[i].data;
				//fill tmpPrint with the variable values.
				possible.info[i].ref.forEach((j)=>{tmpPrint=tmpPrint.replace("{"+j+"}",this.tmp.vars[j]+varUnits[j])});
				//write it 
				printTo(rootdiv,tmpPrint);
				//delete accounted-for variables.
				possible.info[i].ref.forEach((j)=>varsCopy.splice(varsCopy.indexOf(j),1));
			}
		}
		
		//write query
		printTo(rootdiv,possible.query[0].data);
		
		
		//write out relevant components of the questions
		//add a newline
		//rootdiv.appendChild(document.createElement('hr'));
		
		//write out the answer string to the tmp
		if (possible.answer.length){
			tmpPrint=possible.answer[0].data;
			possible.answer[0].ref.forEach((j)=>{tmpPrint=tmpPrint.replace("{"+j+"}",this.tmp.vars[j].toPrecision(3)+varUnits[j])});
			this.tmp.answerString=tmpPrint;
		}else{
			this.tmp.answerString="";
		}
		//return the question object
		return JSON.parse(JSON.stringify(this.tmp)); 
	},
	ans: function(rootdiv,q){
		if (q==undefined){
			q=this.tmp;
		}
		printTo(rootdiv,q.answerString);
	}
}