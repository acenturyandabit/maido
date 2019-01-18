/*//TODO:
- Difficulty scaling
- Minimal answers
- Full answers
*/

qSheets.create("USYD/ELEC/ELEC1103", {
	prettyName: "ELEC1103: First year electronics",
	notes: "Its just a test bro",
	instruction: "Have a go at these questions!",
	data: {}, // Store information about the last generated question between calls to subfunctions.
	gen: [function (difficulty, qdiv, a_min_div, a_max_div) { // Generate a single question, returning divs for the question, min answer, and max answer.
			let E =(Math.random()*0.1).toPrecision(3);
			let Q =(Math.random()*0.1).toPrecision(3);
			let questionString = "If it takes E="+engShowNumber(E)+"J of energy to separate Q="+engShowNumber(Q)+"C of charge, what is the resultant voltage?";
			//generate expression
			//display it
			qdiv.innerText=questionString;
			let V=(E/Q).toPrecision(3);
			let answerString="The voltage is V="+engShowNumber(V)+"V.";
			a_min_div.innerText=answerString;

			updateDiff();
			//return {q:qdiv,a_min:a_min_div,a_max:a_max_div};
		},
		function (difficulty, qdiv, a_min_div, a_max_div) { // Generate a single question, returning divs for the question, min answer, and max answer.
			let V =(Math.random()*0.1).toPrecision(3);
			let Q =(Math.random()*0.1).toPrecision(3);
			let questionString = "How much energy does it take to move Q="+engShowNumber(Q)+"C of charge through a potential of V="+engShowNumber(V)+"V?";
			//generate expression
			//display it
			qdiv.innerText=questionString;
			let E=(V*Q).toPrecision(3);
			let answerString="It takes E="+engShowNumber(E)+"J of energy.";
			a_min_div.innerText=answerString;

			updateDiff();
			//return {q:qdiv,a_min:a_min_div,a_max:a_max_div};
		},
		function (difficulty, qdiv, a_min_div, a_max_div) { // Generate a single question, returning divs for the question, min answer, and max answer.
			let t =(Math.random()*0.1).toPrecision(3);
			let Q =(Math.random()*0.1).toPrecision(3);
			let questionString = "If Q="+engShowNumber(Q)+"C of charge moves to the left in t="+engShowNumber(t)+"s, what is the current to the left?";
			//generate expression
			//display it
			qdiv.innerText=questionString;
			let A=(Q/t).toPrecision(3);
			let answerString="The current is I="+engShowNumber(A)+"A.";
			a_min_div.innerText=answerString;

			updateDiff();
			//return {q:qdiv,a_min:a_min_div,a_max:a_max_div};
		},
		function (difficulty, qdiv, a_min_div, a_max_div) { // Generate a single question, returning divs for the question, min answer, and max answer.
			let v={};
			v.t =(Math.random()*0.1).toPrecision(3);
			v.i =(Math.random()*0.1).toPrecision(3);
			let questionString = "How many electrons move past a fixed reference point every t={t}s  if the current is i={i}A?";
			questionString=questionString.split(/[{}]/);
			for (i=1;i<questionString.length;i++){
				if (questionString[i].length==1){
					questionString[i]=engShowNumber(v[questionString[i]]);
				}
			}
			questionString=questionString.join("");
			//generate expression
			//display it
			qdiv.innerText=questionString;
			v.e=(v.i*v.t/1.602*10**-19).toPrecision(3);
			let answerString = "{e} electrons pass the point.";
			
			answerString=answerString.split(/[{}]/);
			for (i=1;i<answerString.length;i++){
				if (answerString[i].length==1){
					answerString[i]=engShowNumber(v[answerString[i]]);
				}
			}
			answerString=answerString.join("");
			a_min_div.innerText=answerString;

			updateDiff();
			//return {q:qdiv,a_min:a_min_div,a_max:a_max_div};
		}
	]
	}
)







