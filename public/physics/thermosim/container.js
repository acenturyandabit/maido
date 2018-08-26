var ptcctx;
$(document).ready(()=>{			
	//initialise 
	setInterval(coniter,1);
	$("#partbox")[0].width=$("#partbox")[0].clientWidth;
	$("#partbox")[0].height=$("#partbox")[0].clientHeight;
	ctr_stat.w=$("#partbox")[0].width/3;
	ctr_stat.tsw=$("#partbox")[0].width/3;
	ctr_stat.h=$("#partbox")[0].height;
	ptcctx=$("#partbox")[0].getContext('2d');
	ptcctx.fillStyle="black";
	ptcctx.fillRect(0,0,1000,1000);
	//initialise 10 particles
	for(var i=0;i<50;i++)parts[i]=new proto_part();
});

var ctr_stat={
	w:200,
	h:200,
	tsw:200,
	pvh:100,
	vy:0,
	pph:100
}
const psmax=1;
function proto_part(){
	this.reset=function(){
		this.x=Math.random()*ctr_stat.w;
		this.y=Math.random()*ctr_stat.h-ctr_stat.pvh;
		this.vx=Math.random();
		this.vy=Math.random();
	}
	this.reset();
	
	this.scattervel=function(){
		this.vx=Math.random()-0.5;
		this.vy=Math.random()-0.5;
		let r=Math.sqrt(this.vx*this.vx+this.vy*this.vy);
		this.vx*=(state.t/bounds.tMax)*psmax/r;
		this.vy*=(state.t/bounds.tMax)*psmax/r;
	}
	this.update=function(){
		//scale velocity to match temperature
		let r=Math.sqrt(this.vx*this.vx+this.vy*this.vy);
		this.vx*=(state.t/bounds.tMax)*psmax/r;
		this.vy*=(state.t/bounds.tMax)*psmax/r;
		if (isNaN(this.vx) || isNaN(this.vy))this.reset();
		//move your position
		this.x+=this.vx;
		this.y+=this.vy;
		//if collide with wall, bounce off
		if (this.x>ctr_stat.w || this.x<0){
			this.scattervel();
		}
		if (this.y<0){this.scattervel();}
		if (this.y>ctr_stat.h-ctr_stat.pvh){
			this.vy =-this.vy;
			if (-this.vy<ctr_stat.vy)this.vy=-ctr_stat.vy*2;
			this.y+=this.vy;
		}
		//if 100% out of bounds, then reset
		if ((this.x>ctr_stat.w+10 || this.x<-0) || (this.y<-10||this.y>ctr_stat.h-ctr_stat.pvh+10)){
			this.reset();
		}
	}
}
var parts=[];
var pt=0;
var templus=false;
var temmins=false;
function coniter(){
	//clear screen
	ptcctx.fillStyle="white";
	ptcctx.fillRect(0,0,2*ctr_stat.tsw+ctr_stat.w,ctr_stat.h);
	//change volume
	//draw piston
	ptcctx.fillStyle="black";
	ctr_stat.pvh=(1-(state.v-bounds.vMin)/(bounds.vMax-bounds.vMin))*ctr_stat.h;
	ctr_stat.vy=ctr_stat.pvh-ctr_stat.pph;
	ctr_stat.pph=ctr_stat.pvh;
	ptcctx.fillRect(ctr_stat.tsw,ctr_stat.pvh-20,ctr_stat.w,20);
	//draw internal temperature
	ptcctx.fillStyle="rgb("+(state.t-bounds.tMin)/(bounds.tMax-bounds.tMin)*255+",0,"+(1-((state.t-bounds.tMin)/(bounds.tMax-bounds.tMin)))*255+")";
	ptcctx.fillRect(ctr_stat.tsw,ctr_stat.pvh,ctr_stat.w,ctr_stat.h-ctr_stat.pvh);
	//update & draw all particles
	ptcctx.fillStyle="black";
	for (var i=0;i<parts.length;i++){
		parts[i].update();
		ptcctx.fillRect(ctr_stat.tsw+parts[i].x,ctr_stat.h-parts[i].y,2,2);
	}
	//draw cold side
	ptcctx.fillStyle="red";
	ptcctx.fillRect(0,0,ctr_stat.tsw,ctr_stat.h);
	//draw hot side conductor
	ptcctx.fillStyle="black";
	if (pt>=state.t && !templus){
		ptcctx.fillRect(ctr_stat.tsw-10,0,10,ctr_stat.h);
		templus=false;
	}else{
		templus=true;
	}
	//draw hot side
	ptcctx.fillStyle="blue";
	ptcctx.fillRect(ctr_stat.tsw+ctr_stat.w,0,ctr_stat.tsw,ctr_stat.h);
	//draw cold side
	ptcctx.fillStyle="black";
	if (pt<=state.t && !temmins){
		ptcctx.fillRect(ctr_stat.tsw+ctr_stat.w,0,10,ctr_stat.h);
		temmins=false;
	}else{
		temmins=true;
	}
	pt=state.t;
	
}



