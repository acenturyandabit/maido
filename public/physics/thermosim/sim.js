//a pseudo realistic time button?
const R=8.314;
//you can hover over each pathlet of the PV diagram to figure out how everything works
var cycleType=0;
var state={
	p:0,
	v:0,
	n:100,
	t:0,
	path_percent:0,
	path_number:0,
	dof: 2,
	get gamma(){
		return this.dof+2/this.dof;
	},
	w:0,
	e:0,
	q:0,
	dV:0,
	dE:0,
	pdE:0,
	iq:0
};


function auto(condition,state){
	switch(condition){
		case 't': 
		state.t=state.p*state.v/state.n/R;
		break;
	}
}
var bounds={
	pMax:0,
	pMin:0,
	vMax:0,
	vMin:0,
	tMax:0,
	tMin:0,
	sMax:0,
	sMin:0
};
function getBounds(cycle){
	//reset the bounds
	bounds={
		pMax:0,
		pMin:0,
		vMax:0,
		vMin:0,
		tMax:0,
		tMin:0,
		sMax:0,
		sMin:0
	};
	state.iq=0;
	state.w=0;
	state.q=0;
	//scan the cycle to get new bounds
	var stateCopy=Object.assign({},state);
	for (var i=0;i<cycle.paths.length;i++){
		stateCopy.path_number=i;
		for (var j=0;j<100;j++){
			stateCopy.path_percent=j;
			cycle.paths[stateCopy.path_number](stateCopy);
			if (stateCopy.p>bounds.pMax)bounds.pMax=stateCopy.p;
			if (stateCopy.p<bounds.pMin)bounds.pMin=stateCopy.p;
			if (stateCopy.v>bounds.vMax)bounds.vMax=stateCopy.v;
			if (stateCopy.v<bounds.vMin)bounds.vMin=stateCopy.v;
			if (stateCopy.t>bounds.tMax)bounds.tMax=stateCopy.t;
			if (stateCopy.t<bounds.tMin)bounds.tMin=stateCopy.t;
			
		}
		if (state.dE==0)state.pdE=state.E=state.dE=stateCopy.dof/2*stateCopy.p*stateCopy.v;
		if (state.dV==0)state.v=state.dV=stateCopy.v;
	}
	//do a bit of scaling
	bounds.pMax*=1.1;
	bounds.vMax*=1.1;
	//bounds.tMax*=1.1;
	bounds.pMin*=0.9;
	bounds.vMin*=0.9;
	//bounds.tMin*=0.9;
}

function updateState(){
	templus=temmins=false;
	//generally increment everything
	state.path_percent++;
	if (state.path_percent>99){
		state.path_percent=0;
		state.path_number++;
		if (state.path_number==cycles[cycleType].paths.length)state.path_number=0;
	}
	cycles[cycleType].paths[state.path_number](state);
	//calculate work, energy, heat.
	var dw=(state.v-state.dV)*state.p;
	state.w+=dw;
	state.e=state.dof/2*state.p*state.v;
	state.q+=state.e-state.pdE-dw;
	state.iq+=(state.e-state.pdE-dw>0)?(state.e-state.pdE-dw):0;
	state.dV=state.v;
	state.pdE=state.e;
}