var driv_speed=0.3;
function block(){
	this.geometry=new THREE.BoxBufferGeometry(10,100,10);
	this.material=new THREE.MeshStandardMaterial( { color: 0xeeeeee } );
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.castShadow=true;
	this.mesh.recieveShadow=true;
	this.scrambleX=function(){
		this.mesh.position.x=(Math.random()*10+20)*(1-Math.floor(Math.random()*2)*2);
	}
	this.scrambleX();
	this.mesh.position.y=Math.random()*40-40;
	scene.add(this.mesh);
	this.update=function(){
		this.mesh.position.z+=driv_speed;
		if (this.mesh.position.z>100){
			this.mesh.position.z=-300;
			this.mesh.position.y=Math.random()*40-40;
			this.scrambleX();
		}
		return 1;
	}
	
	
}