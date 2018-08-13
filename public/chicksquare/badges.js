var t_badges=[
	"newbie",
	"haxxor",
	"donor"
]

var t_pbm=[];
t_pbm["haxxor"]="Amazing!";
t_pbm["donor"]="Thank you!";
var bdg=[];
function setBadge(name){
	if (t_badges.includes(name) && !bdg.includes(name)){
		var newbadge = $(".badge")[0].cloneNode(true);
		newbadge.childNodes[1].src="./badges/"+name+".png";
		newbadge.childNodes[3].innerHTML=t_pbm[name];
		$(".badge")[0].parentElement.appendChild(newbadge,$(".finalbox")[0]);
		bdg.push(name);
	}
}