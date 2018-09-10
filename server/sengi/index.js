const rp = require ('request-promise');
const cheerio = require ('cheerio');

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/pages');
app.set('view engine', 'ejs');

//const {Pool, Client} = require('pg');

app.listen(process.env.PORT || 8080);


/////////////PROPERTY SETS////////////////////

function fillprop(properties, outputObj, s, $){
	for (var propCount=0;propCount<properties.length;propCount++){
		let pname=properties[propCount].propertyName;
		if (s.getters[pname]){
			outputObj[pname]=s.getters[pname]($);
			continue;
		}
		outputObj[pname]=[];
		for (var toMatchCount=0;toMatchCount<properties[propCount].regq.length;toMatchCount++){
			outputObj[pname].concat(properties[propCount].regq[toMatchCount].exec(outputObj.primaryString));
		}
		outputObj[pname]=outputObj[pname].join();
	}
}

//try and get this from the server, where possible. 

//send out templates, get the user to fill them in? 
//presets
//we dont want them to execute any bogus code, so send JSON.


var phoneProps=[
	{// this is the primary string, so no actual getter
		displayName:"primaryString",
		propertyName:"primaryString",
		invisible:true, //implement this
	},
	{// Name. Same as primaryString, until i can a better getter.
		displayName:"Name",
		propertyName:"primaryString",
	},
	{
		displayName:"Screen size",
		propertyName:"scrsiz",
		regq:[/\d(\d|\.)+(?= inch)/gi]
	},
	{
		displayName:"Price",
		propertyName:"price"
	}
];

///////////////////////WEBSITE SETS/////////////////////

//after converting to json: 
//urlPattern: "stufffffff {q} stuffff"
//name
//resultSelector is still resultselector.


var siteInfo={
	banggood:{
		displayName:"Banggood",
		generateURI:(query)=>{
			return `https://www.banggood.com/search/`+query+`.html`;
		},
		resultSelector:".goodlist_1 li .img a[class*=middle_products]",
		getters:{
			primaryString:($)=>{return $("title").text();},
			price:($)=>{return $(".now").text();}
			
		}
	},
	ebay:{
		displayName:"Ebay",
		generateURI:(query)=>{
			return `https://www.ebay.com.au/sch/i.html?_nkw=`+query;
		},
		resultSelector:"li.sresult>h3>a",
		getters:{
			primaryString:($)=>{return $("title").text();},
			price:($)=>{return $("span[itemprop='price']")[0].attributes.content;}
			
		}
	}
}


///////INDEX /////

app.get("/", function(req, res){
	var data={siteInfo:[]};
	var count=0;
	for (var i in siteInfo){
		data.siteInfo[count]={};
		data.siteInfo[count].siteID=i;
		data.siteInfo[count].displayName=siteInfo[i].displayName;
		count++;
	}
	res.render("index",data); 
});


///////////////////////STATUS HOLDER///////////////
var statusQueue={};

//client facing
app.get("/compare", function(req, res){
	if (req.query.followup=="true"){
		res.send(JSON.stringify(statusQueue[req.query.qid]));
		if (statusQueue[req.query.qid].status=="ready"){
			statusQueue[req.query.qid]="";
		}
		return;
	}else{
		//QID should be sent here, and cached by the client.
		res.render("comparison",{qid:req.query.qid});
	}
	
	
});





////////////////// Actual processing///////////////////


app.post("/startcompare", function(req,res){
	/////get search parameters
	req.body.q;
	req.body.sites;//array of sites
	//req.query.q: query string
	//req.query.sites: CSV siteIDs
	
	
	//validation procedures
	
	
	//generate search ID for tracing
	var tmp="";
	do{
		for (i=0;i<5;i++)tmp+=String.fromCharCode(97+Math.floor(Math.random()*26));
	}while(statusQueue[tmp]);
	statusQueue[tmp]={status:"Initiating search...",data:{}};
	res.send(tmp);//send the client the search ID
	
	
	
	
	//store data
	var amt=0;
	var result;
	function innerdone(i,a,r){	
		if (i==-1){
			amt+=a;
			result=r;
		}else{
			amt--;
			if (amt==0){
				//callback!
				var plist=[];
				for (var j=0;j<phoneProps.length;j++){
					if (!phoneProps[j].invisible)pList.push({displayName:phoneProps[j].displayName,propertyName:phoneProps[j].propertyName})
				}
				for (var j=0;j<phoneProps.length;j++)plist.push({displayName:phoneProps[j].displayName,propertyName:phoneProps[j].propertyName});
				statusQueue[tmp].data={data:result,pList:plist};
				statusQueue[tmp].status="ready";
				return;//dont status update the message anymore
			}
		}
		statusQueue[tmp].status="Parsing results ("+amt+" remaining...)";
	}
	
	///////iterate over each site
	for (var i=0;i<req.body.sites.length;i++){
		var s=siteInfo[req.body.sites[i]];
		var sopts={
			uri: s.generateURI(req.body.q),
			transform: function(body){
				return cheerio.load(body);
			}
		}
		rp(sopts).then(($)=>{
			var resultList=[];
			var resamt=$(s.resultSelector).length;
			//start callback handler
			innerdone(-1,resamt,resultList);
			//populate the array
			for (var i=0;i<resamt;i++)resultList[i]={};
			//ready the requests!
			$(s.resultSelector).each((i,e)=>{
				resultList[i]={};
				resultList[i].href=e.attribs.href;
				var tempOpts={
					uri: e.attribs.href,
					transform: function(body){
						return cheerio.load(body);
					}
				};
				rp(tempOpts).then(($)=>{
					fillprop(phoneProps, resultList[i], s, $);
					resultList[i].name=$("title").text();
					fillprop(phoneProps,resultList[i],resultList[i].name);
					resultList[i].price=$(".now").text();
					innerdone(i);
					
					
				}).catch((err)=>{
					console.log(err);
				});
			});
		}).catch ((err)=>{
			console.log(err);
		});
	}
});
