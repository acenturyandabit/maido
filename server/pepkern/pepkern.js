var https = require("http");
var cookies = {};
var request = require("request");
var exports = (module.exports = {});
var formdata = require("form-data");
exports.middleware = function(req, res, next) {
  //console.log("henlo");
  
  https.get(
    "https://sonia.sydney.edu.au/SoniaOnline/Secure/EForm.aspx?ElectronicFormInstanceId=65504",
    {
        
    }
    _res => {
      if (_res.headers[0]) {
        var schoolID = _res.headers[0].split("="[1]);
        //console.log(schoolID);
      } else {
        //console.log(_res);
        if (_res.headers["set-cookie"]) {
          for (i in _res.headers["set-cookie"]) {
            ckstr = _res.headers["set-cookie"][i];
            ckstr = ckstr.split("=");
            ckkey = ckstr.shift();
            cookies[ckkey] = ckstr.join("=");
          }
          console.log(JSON.stringify(cookies).replace(/:/g,"=").replace(/{|}|"/g,"").replace(/,/g,";")+";");
          form = new formdata();
          form.append("ctl00$LoginControl$RoleNames", "Student");
          form.append("ctl00$LoginControl$UserName", "sliu3976");
          form.append("ctl00$LoginControl$Password", "Eunice17");
          var request2 = https.request({
            method: "post",
            host: "sonia.sydney.edu.au",
            path: "/SoniaOnline/School.aspx?SchoolId=28",
            headers: {
              Cookie: 
              JSON.stringify(cookies).replace(/:/g,"=").replace(/{|}|"/g,"").replace(/,/g,";")+";"
            }
          });
          console.log(request2);
          form.pipe(request2);
          request2.on("response", function(__res) {
            console.log(__res.headers);
          });
        }
      }
      //username=
    }
  );
  /*
  request(
    "https://sonia.sydney.edu.au/SoniaOnline/Secure/EForm.aspx?ElectronicFormInstanceId=65504",{
    },
    (error, response, body) => {
      console.log("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      console.log("body:", body); // Print the HTML for the Google homepage.
    }
  );*/
  res.end();
};
