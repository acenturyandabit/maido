var roomName;
$(() => {
    //If there is a chat link, open the relevant chat
    k = new URLSearchParams(window.location.search);
    if (k.has("room")) {
        roomName = k.get("room");
        initialiseConversation();
    } else {
        //redirect to homepage
        window.location.href = "index.html";
    }
    /*var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // Start loading the page.*/
    /*
    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    });*/
})

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function puid(){
    return Date.now();
}

var userdata = new Proxy({},{
    get:function(obj,prop){
        if (prop=='prettyName')return $("#username")[0].innerText;
        return obj[prop];
    },
    set:function(obj,prop,val){
        if (prop=='prettyName')$("#username").text(val);
        else obj[prop]=val;
        return true;    
    }
});
userdata.others={};
userdata.saveableData=function(){
    e={};
    Object.assign(e,userdata);
    e.others=undefined;
    e.prettyName=userdata.prettyName;
    return e;
}

function initialiseConversation() {
    document.title = roomName;
    $(".titlebar").text(name);
    //Check for localstorage session
    //prompt the user for password
    if (localStorage['userdata']) {
        try {
            e=JSON.parse(localStorage['userdata']);
            if (!e.prettyName){
                e.prettyName=genRandomWords(2);
                // use kaleidogen to come up with a profile picture
            }
            Object.assign(userdata,e);
            if (userdata.passwords && userdata.passwords[name]) {
                showLoading();
                tryLogin(userdata.passwords[name]);
            } else {
                requestPassword();
            }
        } catch (e) {
            console.log(e);
            createNewUser();
            requestPassword();
            //something went wrong
        }

    } else {
        createNewUser();
        requestPassword();
    }
}

function createNewUser() {
    userdata['uid'] = guid();
    userdata.prettyName=genRandomWords(2);
    localStorage['userdata'] = JSON.stringify(userdata);
}

function tryLogin(password) {
    loadMessages();
}

function requestPassword(password) {
    loadMessages();
}

function genRandomWords(n=1){
    str=[];
    for (i=0;i<n;i++)str.push(xPassList[Math.floor(Math.random()*xPassList.length)]);
    return str.join("_");
}

var xPassList=["'bout",
"F",
"Nov.",
"Tues.",
"about-face",
"acclimate",
"acrimonious",
"adman",
"aerobic",
"agilely",
"albumin",
"almost",
"amerce",
"ancestress",
"anon",
"antitank",
"applaud",
"archangel",
"artefact",
"assert",
"atomic",
"austerity",
"awning",
"badman",
"bankcard",
"bashfulness",
"beatify",
"beheld",
"besetting",
"big-time",
"bisect",
"blessed",
"bluefish",
"bombed",
"bossy",
"brainy",
"bridgeable",
"brouhaha",
"bullishly",
"businesswoman",
"caftan",
"campground",
"capriciousness",
"carp",
"catatonic",
"celebratory",
"chalcedony",
"chastity",
"chiffonier",
"choreographically",
"cirrhotic",
"clearinghouse",
"cloture",
"codfish",
"collectively",
"comity",
"compete",
"conceptualization",
"confidentially",
"connotative",
"consultation",
"contrition",
"coping",
"corruptibility",
"country-and-western",
"cramped",
"crevice",
"crouch",
"culvert",
"cutler",
"dangle",
"deathtrap",
"decorative",
"deformation",
"dementedly",
"deplorable",
"designation",
"development",
"dido",
"diploid",
"discommode",
"dishevelment",
"disputatiously",
"disuse",
"dogtrot",
"double-digit",
"dramatist",
"drowse",
"durst",
"eater",
"efflorescence",
"electroshock",
"embroidery",
"encouragingly",
"enormity",
"enzymatic",
"erratic",
"eunuch",
"exceptionally",
"exothermic",
"extemporaneous",
"fa",
"famished",
"fatuity",
"fenestration",
"fierce",
"firefighting",
"flamboyancy",
"flimsiness",
"fly-fishing",
"forbearance",
"formal",
"fractional",
"fretted",
"fugal",
"futilely",
"gap",
"gem",
"gestural",
"glancing",
"gnomish",
"gossipy",
"grass",
"grip",
"guardsman",
"haberdasher",
"halter",
"hard-core",
"haughty",
"heartburn",
"helpful",
"hexagon",
"hipness",
"homegrown",
"horn",
"housewares",
"hung",
"hyperthyroidism",
"idyllic",
"immaterially",
"imperialist",
"improbable",
"incense",
"incredulous",
"individual",
"infamously",
"ingloriously",
"input",
"instigate",
"intercom",
"interweave",
"invigorating",
"irreversibly",
"jangler",
"jocosity",
"junketeer",
"kill",
"knothole",
"lambda",
"lastly",
"leaky",
"lemming",
"licit",
"linden",
"liturgical",
"loiter",
"lovesick",
"lusty",
"magnetizable",
"malocclusion",
"manufacture",
"mason",
"mayday",
"megalomaniac",
"merge",
"metropolitan",
"militarily",
"minute",
"misplacement",
"modification",
"monograph",
"morphine",
"movies",
"munitions",
"mystique",
"nauseate",
"neonate",
"nickelodeon",
"noisiness",
"nonfiction",
"nonspecialist",
"notification",
"o'er",
"obstruction",
"officer",
"onlooking",
"orangeade",
"ostracism",
"outskirts",
"overflow",
"overtime",
"pajamas",
"paperwork",
"paroxysm",
"paternity",
"peculiarity",
"pentathlon",
"periwinkle",
"pestle",
"phonic",
"piety",
"pirogi",
"plateau",
"plurality",
"pollute",
"portability",
"potty",
"predawn",
"preppie",
"prier",
"prod",
"promptness",
"proton",
"publicity",
"purifier",
"quaff",
"quirt",
"ragweed",
"rasher",
"realistic",
"receptor",
"rectory",
"refasten",
"regrind",
"religious",
"repack",
"reputed",
"resplendent",
"retroactive",
"rhetorically",
"ringleader",
"roil",
"rove",
"rusticity",
"salinity",
"sash",
"scandium",
"scissors",
"scuffle",
"sectarianism",
"self-contradictory",
"semicircular",
"sequential",
"shakedown",
"shelving",
"shortage",
"sicko",
"simplification",
"skeptically",
"slaw",
"slum",
"sneaker",
"societal",
"son",
"sovereignty",
"speech",
"splenetic",
"spumy",
"stalemate",
"stave",
"stigmata",
"storybook",
"striker",
"stylus",
"subtitled",
"summery",
"supervise",
"swallow",
"syllabus",
"tactical",
"tape",
"teamster",
"tempestuously",
"terrycloth",
"thereupon",
"threatened",
"tie-dyed",
"titanium",
"toolbar",
"tough",
"tranquillize",
"travelog",
"trim",
"trundler",
"turnip",
"typhoon",
"unanimously",
"uncloak",
"undercarriage",
"undigested",
"unfeminine",
"uniformity",
"unmarketable",
"unquestionably",
"unsheathe",
"untruly",
"upsurge",
"valiant",
"velvety",
"vet",
"violin",
"voile",
"waking",
"waspish",
"wearisomely",
"wen",
"whisk",
"wildlife",
"wishful",
"woodwinds",
"wrathfully",
"yellow",
"zoological"
];