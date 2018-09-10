var cDiff;
var delDiff;
function initDiff(){
	cDiff=setSettings.mindiff;
	deldiff=(setSettings.maxdiff-setSettings.mindiff)/setSettings.qCount;
	switch (setSettings.diffrad){
		case "RANDOM":
			cDiff=(rand()%500/500)*(setSettings.maxdiff-setSettings.mindiff)+setSettings.mindiff;
			break;
		case "FIXED":
			cDiff=setSettings.maxdiff;
			break;
		//case "INCREASING":
			//nothing
	}
}

function updateDiff(){
	switch (setSettings.diffrad){
		case "RANDOM":
			cDiff=(rand()%500/500)*(setSettings.maxdiff-setSettings.mindiff)+setSettings.mindiff;
			break;
		case "INCREASING":
			cDiff+=deldiff;
			break;
	}
}