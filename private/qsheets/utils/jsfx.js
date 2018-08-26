function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = rand()% (i + 1);
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function range(lenstart,end){
	if (end==undefined){
		return[...Array(lenstart).keys()]
	}else{
		Array.from(new Array(end-lenstart), (x,i) => i + lenstart)
	}
}
