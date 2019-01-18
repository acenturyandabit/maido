//MATHS

//Functions:
/*
metaSrand: Generate a random seed string and seeds the random generator with said string.
Args: none
Returns: string.

srand:  Seed the random generator.
Args: newPreseed: string or number
Returns: none

rand: Generate a random number.
Returns:A random number up to INT_max.

makeRandomPolynomial: Generates a random polynomial.

...





*/



var preseed=0;

//Thanks XKCD!

function metaSrand(){
	let seedStr="";
	for (i=0;i<3;i++)seedStr+=xPassList[Math.floor(Math.random()*xPassList.length)]+" ";
	srand(seedStr);
	return seedStr;
}

function srand(newPreseed){
	if (newPreseed.length){//process strings as well
		let k=0;
		for (i in newPreseed){
			k+=newPreseed.charCodeAt(i)
		}
		newpreseed=k;
	}
	preseed=newpreseed;
}

function rand(){ // returns a rather large integer.
	return preseed = preseed * 16807 % 2147483647;
}

function makeRandomPolynomial(n_max_terms,overParams,defParams={max_coef:10, min_coef:-10, integers:true, must_have_x_term:true, allNonZero:false, includeMaxCoeff:false}){
	let params=Object.assign(defParams,overParams)
	let coefCount=rand()%(n_max_terms-2)+2;
	if (params.allNonZero || params.includeMaxCoeff||(params.must_have_x_term && n_max_terms==2))coefCount=n_max_terms;
	let coeffs=Array(coefCount).fill(0);
	let coefZeroWarning=params.must_have_x_term;
	let randomCoefficient;
	for (let c=coefCount-1;c>=0;c--){
		do{			
			randomCoefficient=(rand()%100/100)*(params.max_coef-params.min_coef)+params.min_coef;
			if (params.integers)randomCoefficient=Math.floor(randomCoefficient);
			if (randomCoefficient!=0)coefZeroWarning=false;
		}while (((params.includeMaxCoeff && c==coefCount-1) || (coefZeroWarning && c==1) || params.allNonZero) && randomCoefficient==0);
		coeffs[c]=randomCoefficient;
	}
	return coeffs;
}

function differentiatePolynomial(coeffs){
	//Takes polynomial coefficients.
	//Returns a new set of coefficients: the derivative's coefficients.
	let newCoeffs=Array(coeffs.length-1).fill(0);
	for (let c=coeffs.length-1;c>0;c--){
		newCoeffs[c-1]=coeffs[c]*c;
	}
	return newCoeffs;
}

function multiplyPolynomials(coeffs1,coeffs2){
	//Takes 2 sets of polynomial coefficients.
	//Returns a new set of coefficients: the product of the two polynomials.
	let finalLen=coeffs1.length+coeffs2.length+1;
	let newCoeffs=Array(finalLen).fill(0);
	for (let c1=0;c1<coeffs1.length;c1++){
		for (let c2=0;c2<coeffs2.length;c2++){
			newCoeffs[c1+c2]+=coeffs1[c1]*coeffs2[c2];
		}
	}
	
	return newCoeffs;
}

function addPolynomials(coeffs1,coeffs2){
	let coefCount=(coeffs1.length>coeffs2.length)?coeffs1.length:coeffs2.length;
	let newCoeffs=Array(coefCount).fill(0)
	for (let c=coefCount-1;c>=0;c--){
		if (c<coeffs1.length)newCoeffs[c]+=coeffs1[c];
		if (c<coeffs2.length)newCoeffs[c]+=coeffs2[c];
	}
	return newCoeffs;
}

                       //0 1 2 3 4 5 6 7
const nicePiNumerator=  [0,1,1,1,1,3,2,5];
const nicePiDenominator=[1,6,4,3,2,4,3,6];
var nicePiMapping={};


function cardinalise(x){
	if (x%10==1)return x+"st";
	if (x%10==2)return x+"nd";
	if (x%10==3)return x+"rd";
	return x+"th";
}

function near(a,b,eps=0.01){
	return (Math.abs(a-b)<eps);
}

function nicePi(i,applyFunction=undefined, numericalVal=false){
	//returns a string: a formatted nice factor of pi.
	let formattedStr='';
	let mode=(i+nicePiNumerator.length*10)%nicePiNumerator.length;
	let npi=Math.floor(i/nicePiNumerator.length);
	upper=nicePiNumerator[mode]+Math.floor(i/nicePiNumerator.length)*nicePiDenominator[mode];
	lower=nicePiDenominator[mode];
	switch (applyFunction){
		case "sin":
		case "cos":
		case "tan":
			let answ=Math[applyFunction](upper*Math.PI/lower);
			if (numericalVal)return answ;
			formattedStr="undefined";
			if (near(answ,Math.sqrt(3)))formattedStr='&#8730;3';
			if (near(answ,-Math.sqrt(3)))formattedStr='-&#8730;3';
			
			if (near(answ,Math.sqrt(1/3)))formattedStr='1/&#8730;3';
			if (near(answ,-Math.sqrt(1/3)))formattedStr='-1/&#8730;3';
			
			if (near(answ,0)) formattedStr="0";
			
			if (near(answ,1)) formattedStr="1";
			if (near(answ,-1)) formattedStr="-1";
			
			if (near(answ,-Math.sqrt(1/3)))formattedStr='-1/&#8730;3';
			if (near(answ,Math.sqrt(1/3)))formattedStr='1/&#8730;3';
			
			if (near(answ,0.5)) formattedStr="1/2";
			if (near(answ,-0.5)) formattedStr="-1/2";
			
			if (near(answ,Math.sqrt(0.5))) formattedStr="1/&#8730;2";
			if (near(answ,-Math.sqrt(0.5))) formattedStr="-1/&#8730;2";
			
			
			if (near(answ,Math.sqrt(0.75))) formattedStr="&#8730;3/2";
			if (near(answ,-Math.sqrt(0.75))) formattedStr="-&#8730;3/2";
			break;
		case "quadrant":
			if (mode<4 && npi%2)return 3;
			else if (mode<4)return 1
			else if (npi%2) return 4;
			else return 2;
		default:
			if (upper==0)return "0";
			formattedStr=(
			((upper==1)?"":((upper==-1)?"-":upper))
			+"&#960;"//pi
			+((lower==1)?"":"/"+lower)
			);
	}
	return formattedStr;	
}

function nastyPi(i,d,isFrac=false){
	//returns a string: a formatted nice factor of pi, but with an extra denominator term.
	let modInnerConstant=(i+100)%nicePiNumerator.length;
	upper=nicePiNumerator[modInnerConstant]+Math.floor(i/nicePiNumerator.length)*nicePiDenominator[modInnerConstant];
	lower=nicePiDenominator[modInnerConstant];
	if (isFrac)upper*=d;
	else lower*=d;
	if (lower*upper>0){
		lower=Math.abs(lower);
		upper=Math.abs(upper);
	}else{
		lower=Math.abs(lower);
		upper=-Math.abs(upper);
	}
	if (upper==0)return 0;
	else return (
		((upper==1)?"":((upper==-1)?"-":upper))
		+"&#960;"//pi
		+((lower==1)?"":"/"+lower)
	);
}

function printNice(x,suffix='',plusInFront){
	//deal with fractional coefficients
	let bottom=0;
	if (x.length){
		if (x.includes('/')){
			bottom=Number(x.split('/')[1]);
			x=Number(x.split('/')[0]);
			//sign correction
			if (x*bottom>0){
				bottom=Math.abs(bottom);
				x=Math.abs(x);
			}else{
				bottom=Math.abs(bottom);
				x=-Math.abs(x);
			}
			
		}
		else x=Number(x);
	}
	if (!x)return "";
	let retval="";
	if (x<0){
		if (x==-1 && suffix) retval="-"+suffix;
		else retval=x.toString()+suffix;
	}
	//-1,1 case
	if (x>0){
		if (plusInFront)retval+="+";
		if (!(x==1 && suffix))retval+=x;
		retval+=suffix;
	}
	if (bottom && bottom!=1){
		retval="<span class='frac'><sup>"+retval+"</sup><sub>"+bottom+"</sub></span>";
	}
	return retval;
}

function printPolynomial(coefficients,varName='x'){
	//Coeffs is an array of polynomial coefficients.
	let output="";
	let firstCoef=true;
	for (let c=coefficients.length-1;c>=0;c--){
		output += printNice(coefficients[c],((c>0)?varName:"") + ((c>1)?("<sup>"+c+"</sup>"):""),!firstCoef);
		if (coefficients[c]!=0)firstCoef=false;
	}
	//Returns a string: the formatted polynomial.
	return output;
}

function matchingParenPos(str,i){// finds the preceding matching paren if closeparen; or the proceeding matching paren if openparen, and returns its position.
	let parenCount=0;
	let parens="{[(<>)]}";
	let openParen=str[i];
	if ((closeParen=parens.indexOf(openParen))==-1){
		return i;
	}else{
		closeParen=parens[parens.length-1-closeParen];
	}
	if (parens.indexOf(closeParen)<parens.indexOf(openParen)){
		let k=openParen;
		openParen=closeParen;
		closeParen=k;//make sure closeparen is actually closeparen
	}
	
	if (str[i]==closeParen){
		for (i=i-1;i>-1;i--){
			if (str[i]==closeParen)parenCount++;
			if (str[i]==openParen){
				parenCount--;
				if (parenCount==-1){
					return i;
				}
			}
		}
	}
	if (str[i]==openParen){
		for (i=i+1;i<str.length;i++){
			if (str[i]==openParen)parenCount++;
			if (str[i]==closeParen){
				parenCount--;
				if (parenCount==-1){
					return i;
				}
			}
		}
	}
	return i; // if nothing found
}
var renderTopLevel=true;
function render(div, str){
	let innerEscape=false;
	if (str=="") return;
	if (renderTopLevel){
		let pp=document.createElement('p');
		div.appendChild(pp);
		div=pp;
		renderTopLevel=false;
		innerEscape=true;
	}
	// replacements
	str=str.replace(" ","");
	str=str.replace("pi","&#960;");
	let p=str.search(/[\^\/]/i)
	let p2,p3,_p;
	if (p==-1)p=str.length;
	switch (str[p]){
		case '^':
			//render preceding component
			_p=document.createElement('span');
			_p.innerHTML=str.slice(0,p);
			div.appendChild(_p);
			//check if there is a bracket next
			//if so, only send the subsequent bits.
			sup=document.createElement("sup");
			div.appendChild(sup);
			str=str.slice(p,str.length);
			p=0;
			if (str[p+1]=='('){
				p2=str.search(/([\)])/i)
				p+=2;
				p3=p2+1;
			}else{
				p2=str.search(/[^\-]+([\+\-\/\*])/i)
				if (p2==-1){
					p2=str.length;
				}
				p3=p2;
				p++;
			}
			render(sup,str.slice(p,p2),true);
			render(div,str.slice(p3,str.length),true);
			break;
		case '/':
			//check preceding bracket sequence
			_p=document.createElement('span');
			_p.classList.add('frac');
			div.appendChild(_p);
			sup=document.createElement('sup');
			_p.appendChild(sup);
			if(str[p-1]==')'){
				p_1=matchingParenPos(str,p-1);
			}
			render(sup,str.slice(p_1+1,p-1),true);
			//proceeding bracket sequence
			sub=document.createElement('sub');
			_p.appendChild(sub);
			if(str[p+1]=='('){
				p_1=matchingParenPos(str,p-1);
				p++;
			}
			render(sub,str.slice(p+1,p_1-1),true);
			break;
		default:
			_p=document.createElement('span');
			_p.innerHTML=str.slice(0,p);
			div.appendChild(_p);
			break;
	}
	if (innerEscape){
		renderTopLevel=true;
	}
}
/*
$(document).ready(()=>{
	testTexts=["ax^3+bx^5+c^(4^5)","ax^(bx+c)",'sin(3x+5)','(5+2x)/(x+3)','(ax+b)^4','pi'];
	for (i in testTexts)render($("#contentDiv")[0],testTexts[i])
});
*/

engIndices=["","k","M","G"];
negEngIndices=["","m","u","n","p"];
function engShowNumber(n){
	n=Number(n);
	let negative=false;
	let _n=Math.abs(n);
	if (_n/n!=1){
		negative=true;
	}
	let amt;
	amt=Math.floor(Math.log10(_n));
	// if (Math.abs(n)>1){
		
	// }else{
	// 	amt=Math.ceil(Math.log10(n));
	// }
	let precision=_n.toExponential().split("e")[0].replace(".","").length;
	amt=Math.floor(amt/3);
	let sf=_n/Math.pow(10,amt*3);
	sf=sf.toPrecision(precision);
	sf=sf.toString().split("e")[0];
	if (amt<0){
		if (negEngIndices[-amt]!=undefined)sf+=negEngIndices[-amt];
		else return n.toExponential();
	}else{
		if (engIndices[-amt]!=undefined)sf+=engIndices[amt];
		else return n.toExponential();
	}
	if (negative){
		sf="-"+sf;
	}
	return sf;
}