
	function randcol(){
		var output="#";
		var ac_char=['0','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f'];
		for(var i=0;i<6;i++){
			output+=ac_char[Math.floor(Math.random()*17)];
		}
		return output;
	}
	
	var shardCount;
	var shapes=[];
	function shape(){
		this.factor=8;//Math.round(Math.random()*2+3);//how many times it repeats
		this.tRate=Math.random()*0.1-0.05;//rate of rotation
		this.rRate=Math.random()*4+1;//rate of radius increase
		this.r=0;//radius
		this.t=Math.random()*Math.PI;//theta
		this.color=randcol();//this color
		var p=Math.floor(Math.random()*3+3);
		this.bits=[];
		for (var i=0;i<p;i++)this.bits.push(new bit());
	}
	
	function bit(){
		this.dt=Math.random()*5;
		this.dr=Math.random()*20;
	}
	
	
	
	window.addEventListener("load",initCanvas);
	var canvas;
	var ctx;
	function initCanvas(){
		canvas=$("body>canvas")[0];	
		canvas.height=window.innerHeight;
		canvas.width=window.innerWidth;
		ctx=canvas.getContext('2d');
		setInterval(draw,100);
	}
		
	function draw(){
		//update everything
		ctx.fillStyle='black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		//make new shapes
		if (Math.random()*3<1){
			shapes.push(new shape());
		}
		
		//shift everything outwards
		for (var i=0;i<shapes.length;i++){
			s=shapes[i];
			s.r+=s.rRate;
			s.t+=s.tRate/Math.log(s.r+1+1000)*3;
			if (s.r>canvas.width*0.7)shapes.splice(i,1);
		}
		
		//draw everything
		for (var s of shapes){
			for (var i=0;i<s.factor;i++){
				ctx.beginPath();
				var ist=true;
				for (var b of s.bits){
                    xx=(s.r)*Math.cos(s.t+i*Math.PI*2/s.factor)+b.dr*Math.cos(b.dt+i*Math.PI*2/s.factor)+canvas.width/2;
                    yy=(s.r)*Math.sin(s.t+i*Math.PI*2/s.factor)+b.dr*Math.sin(b.dt+i*Math.PI*2/s.factor)+canvas.height/2	
					if(ist){ctx.moveTo(xx,yy);ist=false;}
					else ctx.lineTo(xx,yy);
                }
                b=s.bits[0];
                xx=(s.r)*Math.cos(s.t+i*Math.PI*2/s.factor)+b.dr*Math.cos(b.dt+i*Math.PI*2/s.factor)+canvas.width/2;
                yy=(s.r)*Math.sin(s.t+i*Math.PI*2/s.factor)+b.dr*Math.sin(b.dt+i*Math.PI*2/s.factor)+canvas.height/2;	
				ctx.lineTo(xx,yy);
				ctx.fillStyle=s.color;
				ctx.closePath();
				ctx.fill();
			}
		}
		//draw centre circle
		//draw eye mask
		
	}