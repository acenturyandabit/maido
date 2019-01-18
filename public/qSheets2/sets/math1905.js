/*//TODO:
- Difficulty scaling
- Minimal answers
- Full answers
*/

qSheets.create("USYD/MATH/1905", {
	prettyName: "MATH1905: First year statistics",
	notes: "Created by Steven Liu, in 2018-9. This has no official affiliation with the University of Sydney, NESA, or anything else really. Use at your own peril.",
	instruction: "Have a go at these questions!",
	data: {}, // Store information about the last generated question between calls to subfunctions.
	gen: [function (difficulty, qdiv, a_min_div, a_max_div) { // Generate a single question, returning divs for the question, min answer, and max answer.
			let questionString = "";
			n = rand() % 1000;

			k = [];
			max_height = 100;
			for (i = 0; i < n; i++) {
				k.push(rand() % max_height);
			}
			intervals = [];
			for (j = 0; j < max_height; j += rand() % 30) {
				intervals.push({
					p: j,
					c: 0
				});
			}
			for (i = 0; i < n; i++) {
				for (j = 0; j < intervals.length; j++) {
					if (k[i] < intervals[j].p) {
						intervals[j - 1].c++;
						break;
					}
				}
			}
			intervals.push({
				p: max_height,
				c: 0
			});
			$(qdiv).append($.parseHTML(
				`<p>The following histogram describes the heights of a population of ` + n + ` Macedonian megacats.</p>
			<canvas></canvas>
			<p>Calculate the number of cats with a height under ` + intervals[rand() % intervals.length].p + ` m.</p>`
			))

			c = $(qdiv).find("canvas")[0];
			ctx = c.getContext('2d');
			//draw axes
			ctx.beginPath();
			ctx.moveTo(20, 50);
			ctx.lineTo(20, 100);
			ctx.lineTo(400, 100);
			ctx.stroke();
			ctx.closePath();
			//draw axes labels

			//draw interval blocks.
			m_dct = 0;
			for (i = 0; i < intervals.length - 1; i++) {
				h = intervals[i].c / (intervals[i + 1].p - intervals[i].p);
				if (m_dct < h) m_dct = h;
			}
			for (let i = 0; i < intervals.length - 1; i++) {
				h = intervals[i].c / (intervals[i + 1].p - intervals[i].p) * 90 / m_dct;
				ctx.fillRect(20 + 2 * intervals[i].p, 100 - h, 2 * (intervals[i + 1].p - intervals[i].p), h);
			}

			//generate expression
			//display it

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
			
			//const postIntegral=['-cos','sin','tan'];
			let quadrant=cardinalise(nicePi(innerVal,'quadrant'));
			printTo(aDiv,"The base angle of "+nicePi(innerVal)+" in the region &#960;&lt;x&le;0 is "+nicePi(baseVal)+", giving a base value of " +nicePi(baseVal,expressions[qtype])+".");
			if (nicePi(baseVal,expressions[qtype])!="undefined" && nicePi(baseVal,expressions[qtype])!="0"){
				printTo(aDiv,"The angle is in the "+quadrant+" quadrant. "+expressions[qtype]+" is " +((nicePi(innerVal,expressions[qtype],true)<0)?"negative":"positive") + " in the " +quadrant+" quadrant.");
				printTo(aDiv,"Hence, the exact value of "+expressions[qtype]+"("+nicePi(innerVal)+") is "+nicePi(innerVal,expressions[qtype])+".");
			}
			*/
			/*
		
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
		},
		(diff,qdiv,a_min_div,a_max_div) => {
			k = [];
			for (i = 0; i < 10; i++) {
				k.push(rand() % 100);
			}
			$(qdiv).append($.parseHTML(
				`<p>A dataset about the `+vocab.random('num_property')+` of `+vocab.random('nouns')+` contains the following values: ` + k + `</p>
			<p>Calculate the average of the set.</p>`
			))
		},
		(diff,qdiv,a_min_div,a_max_div) => {
			k = [];
			for (i = 0; i < 10; i++) {
				k.push(rand() % 100);
			}
			$(qdiv).append($.parseHTML(
				`<p>A dataset about the `+vocab.random('num_property')+` of `+vocab.random('nouns')+` contains the following values: ` + k + `</p>
			<p>Calculate the standard deviation of  the set.</p>`
			))
		},
		(diff,qdiv,a_min_div,a_max_div) => {
			p = [];
			for (i = 0; i < 10; i++) {
				p.push([rand() % 100/100,rand() % 100/100]);
			}
			printout="";
			p.forEach((e,i)=>{
				printout=printout+"["+e.join(",")+"],";
			})
			$(qdiv).append($.parseHTML(
				`<p>Consider the following pairs of values: `+ printout + `</p>
			<p>Calculate the correlation coefficient of  the set.</p>`
			))
		},
	]
});