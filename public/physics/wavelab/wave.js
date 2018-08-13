const MAX_POINTS=3000;
const scaling_factor=0.01;
function wave(col,waveType,waveData){
	this.amp=1;
	this.freq=1;
	this.wln=1;
	this.phi=0;
	this.back=false;
	this.mat=new THREE.LineBasicMaterial( { color: col, linewidth:2 } );
	this.geo=new THREE.BufferGeometry();
	this.points=new Float32Array(MAX_POINTS*3);
	this.geo.addAttribute ('position',new THREE.BufferAttribute(this.points,3));
	this.line=new THREE.Line(this.geo,this.mat);
	scene.add(this.line);
	this.waveType=waveType;
	this.waveData=waveData;
	this.update=function(){
		updaters[this.waveType](this);
		this.line.geometry.attributes.position.needsUpdate = true;
	}
}
//Wave 1
var waves=[];
waves.push(new wave(0xff0000,"Vertical"));
waves.push(new wave(0x0000ff,"Horizontal"));
waves.push(new wave(0xff00ff,"sum","0 1"));
//sum wave

var updaters={};
updaters.Horizontal=function(w){
	positions = w.line.geometry.attributes.position.array;
	var x, index;
	x  = index = 0;

	for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {
		x=(2*halfLen/MAX_POINTS)*i;
		positions[ index ++ ] = x-halfLen;
		positions[ index ++ ] = 0;
		var phase=(w.freq*scaling_factor/2*Math.PI)*t+(x/w.wln*2*Math.PI)+w.phi/180*Math.PI;
		if (w.back)phase=-(w.freq*scaling_factor/2*Math.PI)*t+(x/w.wln*2*Math.PI)+w.phi/180*Math.PI;
		
		positions[ index ++ ] = w.amp*Math.sin(phase);
	}	
}

updaters.Vertical=function(w){
	positions = w.line.geometry.attributes.position.array;
	var x, index;
	x  = index = 0;

	for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {
		x=(2*halfLen/MAX_POINTS)*i;
		positions[ index ++ ] = x-halfLen;
		var phase=(w.freq*scaling_factor/2*Math.PI)*t+(x/w.wln*2*Math.PI)+w.phi/180*Math.PI;
		if (w.back)phase=-(w.freq*scaling_factor/2*Math.PI)*t+(x/w.wln*2*Math.PI)+w.phi/180*Math.PI;
		positions[ index ++ ] = w.amp*Math.sin(phase);
		positions[ index ++ ] = 0;
	}	
}

updaters.Clockwise=function(w){
	positions = w.line.geometry.attributes.position.array;
	var x, index;
	x  = index = 0;

	for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {
		x=(2*halfLen/MAX_POINTS)*i;
		positions[ index ++ ] = x-halfLen;
		var phase=(w.freq*scaling_factor/2*Math.PI)*t+(x/w.wln*2*Math.PI)+w.phi/180*Math.PI;
		if (w.back)phase=-(w.freq*scaling_factor/2*Math.PI)*t+(x/w.wln*2*Math.PI)+w.phi/180*Math.PI;
		positions[ index ++ ] = w.amp*Math.sin(phase);
		positions[ index ++ ] = w.amp*Math.cos(phase);
	}	
}

updaters.Anticlockwise=function(w){
	positions = w.line.geometry.attributes.position.array;
	var x, index;
	x  = index = 0;

	for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {
		x=(2*halfLen/MAX_POINTS)*i;
		positions[ index ++ ] = x-halfLen;
		var phase=(w.freq*scaling_factor/2*Math.PI)*t+(x/w.wln*2*Math.PI)+w.phi/180*Math.PI;
		if (w.back)phase=-(w.freq*scaling_factor/2*Math.PI)*t+(x/w.wln*2*Math.PI)+w.phi/180*Math.PI;
		positions[ index ++ ] = w.amp*Math.cos(phase);
		positions[ index ++ ] = w.amp*Math.sin(phase);
	}	
}

updaters.sum=function(w){
	positions = w.line.geometry.attributes.position.array;
	p1=waves[w.waveData.split(" ")[0]].line.geometry.attributes.position.array;
	p2=waves[w.waveData.split(" ")[1]].line.geometry.attributes.position.array;
	var x, index;
	x  = index = 0;

	for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {
		x=(2*halfLen/MAX_POINTS)*i;
		positions[ index ++ ] = x-halfLen;
		positions[ index ++ ] = p1[index-1]+p2[index-1];
		positions[ index ++ ] = p1[index-1]+p2[index-1];
	}	
}