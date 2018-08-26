//next ver: mobile compatible





//todo: egg count LHS top

var canvas;
var ctx;
var slant=0.1;
var w;
var h;




function xfrom(x,y,z,size){
	var k;
	k=(z-x)*Math.sqrt(3)/2;
	k*=size;
	return k;
}
function yfrom(x,y,z,size){
	var k;
	k=y-(x+z)/2;
	k*=size;
	return k; 
}

//x left up
//y down
//z right up

var ignoreclick=false;








function genstyle(){
	//use ajax and sql to get list of styles, pick random style.
	var n = Math.round(Math.random()*100);
	var s;
	var ind=Math.random();
	for (var i=0;i<infos.length;i++){
		if (ind>=infos[i].rs && ind<infos[i].re){
			return infos[i];
		}
	}
}

function birb(){
	
	this.specific=0;
	this.getName=function(){
		while(1){
			if (this.name.charAt(0)=='#'){
				this.name=names[this.name][Math.round(Math.random()*(names[this.name].length-1))];
				}else if(this.name.charAt(0)=="!"){
				this.specific=Math.round(Math.random()*(names[this.name].length-1));
				this.name=names[this.name][this.specific];
				}else{
				return this.name;
			}
		}
	}
	
	this.getDesc=function(){
		while(1){
			if (this.desc.charAt(0)=='#'){
				this.desc=desc[this.desc][Math.round(Math.random()*(desc[this.desc].length-1))];
			}else if (this.desc.charAt(0)=="!"){
				this.desc= desc[this.desc][this.specific];
			}else{
				return this.desc;
			}
		}
	}
	
	this.getEPS=function(){
		return this.style.eps;
	}
	
	this.reset=function(){
		this.x=Math.random()*(w+(1+slant)*h);
		this.size=Math.random()*h/50+h/50;
		this.y=-this.size*2;
		this.style=genstyle();
		this.name=this.style.name;
		this.desc=this.style.desc;
	}
	
	this.draw=function(_ctx,_x,_y,_size){
		if(!this.style)this.reset();
		if (this.isImage){
			_ctx.drawImage(this.imageElement,_x-size*Math.sqrt(3)/2,_y,size*Math.sqrt(3)/2,size*2);
			return;
		}
		//body
		_ctx.strokeStyle=this.style.outlinestyle;
		_ctx.beginPath();
		_ctx.moveTo(_x,_y);
		_ctx.lineTo(_x-Math.sqrt(3)/2*_size,_y+_size/2);
		_ctx.lineTo(_x-Math.sqrt(3)/2*_size,_y+_size*3/2);
		_ctx.lineTo(_x,_y+_size*2);
		_ctx.lineTo(_x+Math.sqrt(3)/2*_size,_y+_size*3/2);
		_ctx.lineTo(_x+Math.sqrt(3)/2*_size,_y+_size/2);
		_ctx.lineTo(_x,_y);
		_ctx.moveTo(_x-Math.sqrt(3)/2*_size,_y+_size/2);
		_ctx.lineTo(_x,_y+_size);
		_ctx.lineTo(_x+Math.sqrt(3)/2*_size,_y+_size/2);
		_ctx.moveTo(_x,_y+_size);
		_ctx.lineTo(_x,_y+_size*2);
		_ctx.moveTo(_x,_y);
		_ctx.closePath();
		_ctx.fillStyle=this.style.innerstyle;
		_ctx.fill();
		_ctx.stroke();	
		//wing
		_ctx.beginPath();
		_ctx.moveTo(_x+_size/(Math.sqrt(3)*2),_y+_size*3/2);
		_ctx.lineTo(_x+_size/(Math.sqrt(3)*2),_y+_size*4/3);
		_ctx.lineTo(_x+_size/(Math.sqrt(3)),_y+_size*7/6);
		_ctx.stroke();
		_ctx.closePath();
		//top
		_ctx.beginPath();
		_ctx.arc(_x+xfrom(0.5,0,0.35,_size),_y+_size+yfrom(0.5,0,0.35,_size),_size/10,0,Math.PI*2,true);
		_ctx.arc(_x+xfrom(0.5,0,0.5,_size),_y+_size+yfrom(0.5,0,0.5,_size),_size/10,0,Math.PI*2,true);
		_ctx.arc(_x+xfrom(0.5,0,0.65,_size),_y+_size+yfrom(0.5,0,0.65,_size),_size/10,0,Math.PI*2,true);
		_ctx.closePath();
		_ctx.fillStyle=this.style.topstyle;
		_ctx.fill();
		
		//beak
		_ctx.beginPath();
		_ctx.moveTo(_x-Math.sqrt(3)/4*_size,_y+_size*3/4+_size/5);
		_ctx.lineTo(_x-Math.sqrt(3)/4*_size-_size/10,_y+_size*3/4+_size/5);
		_ctx.lineTo(_x-Math.sqrt(3)/4*_size,_y+_size*3/4+_size*2/5);
		_ctx.stroke();
		_ctx.closePath();
		_ctx.fillStyle=this.style.beakstyle;
		_ctx.fill();
		
		//eyes
		_ctx.beginPath();
		_ctx.fillStyle=this.style.eyestyle;
		if (!this.blinking){
			_ctx.arc(_x-Math.sqrt(3)/2*_size+_size/7,_y+_size/2+_size*2/7,_size/10,0,Math.PI*2,true);
			_ctx.fill();
			_ctx.closePath();
			_ctx.beginPath();
			_ctx.arc(_x-_size/7,_y+_size+_size/7,_size/10,0,Math.PI*2,true);
			_ctx.fill();
		}else{
			_ctx.moveTo(_x+xfrom(0.75,0.2,0,_size),_y+_size+yfrom(0.75,0.2,0,_size));
			_ctx.lineTo(_x+xfrom(0.95,0.2,0,_size),_y+_size+yfrom(0.95,0.2,0,_size));
			_ctx.moveTo(_x+xfrom(0.25,0.2,0,_size),_y+_size+yfrom(0.25,0.2,0,_size));
			_ctx.lineTo(_x+xfrom(0.05,0.2,0,_size),_y+_size+yfrom(0.05,0.2,0,_size));
			_ctx.stroke();
		}
		_ctx.closePath();
	}
	this.update=function(){
		this.x-=(1+slant)*h/40/this.size;
		this.y+=1*h/40/this.size;
		if (this.x<-this.size || this.y>h)this.reset();
	}
	this.inner_update=function(){
		this.y=this.size*Math.sin(Date.now()*0.005+this.boprand)*0.05;
		if (Math.random()>0.99){
			this.blinking=true;
			var thing=this;
			setTimeout(function(){thing.blinking=false;},200);
		}
	}
	this.boprand=Math.random()*30;
	this.blinking=false;
	this.x=Math.random()*w;
	this.y=Math.random()*h;
	this.style=genstyle();
	this.desc=this.style.desc;
	this.name=this.style.name;
	this.size=Math.random()*h/50+h/50;
	this.displayflag=false;
	this.toBit=function(){
		var p={
			'name':this.getName(),
			'desc':this.getDesc(),
			'style':this.style
		};
		return p;
	}
	this.fromBit=function(obj){
		this.name=""+obj.name;
		this.desc=""+obj.desc;
		var p = this;
		this.style=Object.assign({}, obj.style);
		if (!obj.style.name)this.style=genstyle();
	}
}
var birbs=[];
var housebirbs=[];//birbs in the barn
var net;
var netimg;
var ctin;
var ctxin;


function rehash(){
	$("#addbox")[0].value="Set Added!";
	//rescale probabilities
	var cpsum=0;
	for (var i=0;i<infos.length;i++){
		cpsum+=infos[i].probability;
	}
	var ccsum=0;
	for (var i=0;i<infos.length;i++){
		infos[i].rs=ccsum;
		ccsum+=infos[i].probability/cpsum;
		infos[i].re=ccsum;
	}
}

function within(_x1,_y1,_x,_y,_w,_h){
	if (_x1>_x && _x1<_x+_w && _y1>_y && _y1<_y+_h)return true;
	return false;
}

var netshown=false;
var body;
var net;

function toggleNet(){
	if (netshown==true)hideNet();
	else showNet();
}

function showNet(){
	hideBarn();
	ignoreclick=true;
	net.style.display="block";
	netshown=true;
}
function hideNet(){
	net.style.display="none";
	netshown=false;
}

function mousemove(event){
	net.style.left=(event.pageX-netimg.width*0.8)+"px";
	net.style.top=(event.pageY-netimg.height*0.2)+"px";
}
var haschicken=-1;
function mouseclick(event){
	if (ignoreclick==true){ignoreclick=false;return;}
	if (netshown==true){
		netimg.classList.toggle("flip");
		setTimeout(function(){
			netimg.classList.toggle("flip");
			if (haschicken>0){
				//birbs[haschicken].update(2);
				showBarn(1); 
			}
		},150);
		//netimg.style.animation="0.1s rotateRight linear";
		//check whether we have a chicken
		var _haschicken=-1;
		for (i=0;i<100;i++){
			if (i!=haschicken && within(event.pageX,event.pageY,birbs[i].x-birbs[i].size*Math.sqrt(3)/2,birbs[i].y,birbs[i].size*Math.sqrt(3),birbs[i].size*2)){
				_haschicken=i;
			}
		}
		resetNet();
		haschicken=_haschicken;
	}
}

function kd(event){
	if (event.key=="Escape"){
		hideBarn();
		hideNet();
	}
}

function draw(){
	//eggcumulate
	eggcumulate();
	//draw stuff
	if (moving){
		ctx.fillStyle='yellow';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		for (i=0;i<100;i++){
			birbs[i].update();
			if (i!=haschicken)birbs[i].draw(ctx,birbs[i].x, birbs[i].	y, birbs[i].size);
		}
		for (i=0;i<housebirbs.length;i++){
			if (housebirbs[i])housebirbs[i].inner_update();
			redrawNests();
		}
	}
}		