var https=require('https')

var exports=module.exports={}
var formdata=require('form-data')
exports.middleware=function(req,res,next){
    console.log("henlo")
    https.get('https://sonia.sydney.edu.au/SoniaOnline/School.aspx?SchoolId=28',(_res)=>{
        var schoolID=_res.headers[0].split("="[1])    
        console.log(schoolID);
        form=new formdata();
        form.append("ctl00$LoginControl$RoleNames","Student");
        form.append("ctl00$LoginControl$UserName","sliu3976");
        form.append("ctl00$LoginControl$Password","Eunice17");
        var request2=https.request({
            method:'post',
            host:'https://sonia.sydney.edu.au',
            path:"/SoniaOnline/School.aspx?SchoolId=28",
            headers:{
                'Cookie':'SchoolId='+schoolID
            }
        })
        form.pipe(request)
        request.on('response',function(__res){
            console.log(__res.headers)
        })
        username=
    })
    res.end();
}