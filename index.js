var fs = require('fs');
var http = require('http');
var https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();










app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser())

var os = require('os');

/*
	app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
	});
*/

//exclusions

//app.use('/pepkern',require('./server/pepkern/pepkern.js').middleware)


app.use('/', (req, res, next) => {
	if (process.env !== 'development') {
		var result = req.url.match(/^\/qsheets\/\/.+\.js$/)
		if (result) {
			return res.status(403).end("eheh you're not meant to be here... idk hmu @ steeven.liu2@gmail.com if you want sth")
		}
	}
	if (req.url.match(/^.+?\.ejs/)) {
		return res.send().end()
	}
	next()
})

app.get('/tryIP', (req, res) => {
	var networkInterfaces = Object.values(os.networkInterfaces())
		.reduce((r, a) => {
			r = r.concat(a)
			return r;
		}, [])
		.filter(({
			family,
			address
		}) => {
			return family.toLowerCase().indexOf('v4') >= 0 &&
				address !== '127.0.0.1'
		})
		.map(({
			address
		}) => address);

		
	var ipAddresses = networkInterfaces.join(', ')
	res.send(ipAddresses);
})

app.use(express.static(__dirname + '/public'));

//setup qsheets


// // views is directory for all template files
app.set('views', [__dirname + '/views']);
app.set('view engine', 'ejs');

// const {Pool, Client} = require('pg');

// if (!process.env.PORT)console.log("listening on 8080");
//console.log(process)
app.listen(process.env.PORT || 8080);

//app.use('/idealogue',require('./server/idealogue.js'))
if (!process.env.PORT) {
	app.post("/toSaveLocal/*", function (req, res) {
		console.log(req.originalUrl.slice(13));
		console.log(req.body);
		fs.writeFile('toSave/' + req.originalUrl.slice(13), JSON.stringify(req.body), (e) => {
			console.log(e)
		});
		res.end();
	});
	app.get("/maido/getLatest", function (req, res) {
		let setName=req.query.name;
		fs.readdir('toSave/',(err,files)=>{
			latest=0
			files.forEach((val,i)=>{
				result=/mai-(.+)?-(\d+)/g.exec(val);
				if (result!=null && result[1]==setName){
					if (result[2]>latest){
						latest=result[2];
					}
				}
			})
			fs.readFile('toSave/mai-'+setName+"-"+latest, (e,d) => {
				res.send(d);
				res.end;
			});

		})
	});
}
// res.render("index"); 
// });

// ignore=[



// ]





//QSHEETS PRIVATE VERSION: WORK IN PROGRESS
app.get("/qsheets", function (req, res) {

	if (req.query.q) {
		//render the question page
		res.render("qsheets/query.ejs")
	} else {
		//render the index, with the given sets sent as a cookie.

	}



});

// fs.readdir("./pages/crashcards", (err, files) => {
// files.forEach(file => {

// if (file.indexOf(".ejs")!=-1){
// file=file.substring(0,file.length-4);
// console.log("/crashcards/"+file);
// app.get("/crashcards/"+file, function(req, res){ 
// res.render(file); 
// });
// }
// });
// });