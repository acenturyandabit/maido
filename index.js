const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
	app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
	});
*/

app.use(express.static(__dirname + '/public'));

//setup qsheets


// // views is directory for all template files
// app.set('views', [__dirname + '/pages',__dirname + '/pages/crashcards']);
// app.set('view engine', 'ejs');

// const {Pool, Client} = require('pg');

// if (!process.env.PORT)console.log("listening on 8080");
//console.log(process)
app.listen(process.env.PORT || 8080);

// app.get("/", function(req, res){ 
	// res.render("index"); 
// });

// ignore=[
	
	
	
// ]


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
