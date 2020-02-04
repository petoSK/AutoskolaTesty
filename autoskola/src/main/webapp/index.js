var adr = "";
var method = "";
var s = "";
var test = 0;
var answeredQo = [];
var answeredQNr = [];
var count = 0;
var odpovede = [];
var spravneOdpovede = [];
var countDownDate = "";
var time;
var loggedUser="";
document.getElementById("rnd").addEventListener("click", randomTest);
document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("logoutButton").addEventListener("click", logout);
document.getElementById("home").addEventListener("click", home);

function home(){
	checkCookies();
	document.getElementById("username").value="";
	document.getElementById("data").innerHTML="";
	clearInterval(time);
	document.getElementById("timer").innerHTML = "20m:00s";
	
	
	
	
}
function checkCookies(){
	var adr="http://localhost:8080/autoskola/webapi/resources/listCookies"
		var method="GET";
	var str="";
	sendRequest(str,method,adr);
}
function makeList() {
	const myNode = document.getElementById("tests");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}

	for (var j = 1; j < 36; j++) {
		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "testDropdown");
		newDiv.setAttribute("onclick", "getTest(" + j + ")");
		var text = document.createTextNode(j);
		newDiv.appendChild(text);
		var element = document.getElementById("tests").appendChild(newDiv);
	}
	document.getElementsByClassName("testDropdown").onmouseover = function() {
		this.style.backgroundColor = "#ddd";
	}
}
/*function User(name) {
	this.name = name;
}*/

function login(){	
	
	var s=document.getElementById("username");
	
	if(s.value.length>2){
		console.log(s.value.length)
	loggedUser=s.value;
	console.log(loggedUser+"//"+s.value);
	submitUsername(s.value);
	document.getElementById("username").style.display="none";
		document.getElementById("loginButton").style.display="none";
			document.getElementById("welcome").style.display="block";
			document.getElementById("welcome").innerHTML="Welcome "+loggedUser;
	} else{
	document.getElementById("username").value="";
	document.getElementById("username").placeholder="min length=3";
}
}
function logout(){
	document.getElementById("username").style.display="initial"
		document.getElementById("loginButton").style.display="initial"
			document.getElementById("username").placeholder="enter user name";
	document.getElementById("username").value="";
	document.getElementById("welcome").style.display="none";
	var adr="http://localhost:8080/autoskola/webapi/resources/userLogout"
		var method="GET";
	var str="";
	sendRequest(str,method,adr);
	
}	
	
	function submitUsername(str) {
	
		var method="POST";
		var adr="http://localhost:8080/autoskola/webapi/resources/userLogin";
	
			var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				obj = this.responseText;
			}
		}					
		xhttp.open("POST", "http://localhost:8080/autoskola/webapi/resources/userLogin", true);
		xhttp.setRequestHeader("Content-type", "text/plain");
		//xhttp.setRequestHeader("Accept", "text/plain");
		xhttp.send(str);
		

	}


function eval() {
	var hodnotenie="";
	if(test!=0){                                                              // 1-12 za 2 body
	clearInterval(time);													// 13,14,15 za 1 bod
	console.log(spravneOdpovede);											// 16-23 za 2 body
	console.log(odpovede);													// 24-27 za 3 body
	var spravne=[];
	var nespravne=[];
	var dobreCoun=0;
	var zleCount=0;
	var body=0;
	for(var i=0;i<27;i++){
		
		if(spravneOdpovede[i]==odpovede[i]){
			if(i<=11) body=body+2;
			if(i>=12&&i<=14) body++;
			if(i>=15&&i<=23) body=body+2;
			if(i>=24) body=body+3;
			spravne[i]=1
			dobreCoun++;
		}
		else{
			nespravne[i]=1;	
			zleCount++;
		}
		
		
	}

	document.getElementById("res").style.visibility="visible";
	document.getElementById("result").style.height="140px";
	if(body>=50)document.getElementById("res").style.color="green";
	if(body<50)document.getElementById("res").style.color="red";
	document.getElementById("res").value = "dobre: "+dobreCoun+"\nzle: "+zleCount+"\nbody: "+body+"/55";
}
	else document.getElementById("res").value = "Najprv zrob test ;)"
}
function timer() {
	var distance = countDownDate - new Date().getTime();            //ziskame aktualny cas
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));    //vypocitame aktualne minuty
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);             // //vypocitame aktualne sekundy
	document.getElementById("timer").innerHTML = minutes + "m:" + seconds	
			+ "s ";
	
	if(minutes==0&&seconds==0){
		clearInterval(time);
		document.getElementById("timer").style.color="red";
		document.getElementById("timer").style.color="00m:00s";
		eval();
	}
}
function resetTest(){
	odpovede=[];                               //"zabudne" odpovede
	getTest(test);
	
}
function nextTest(){
	
	if(test==35) test=1;
	else test=test+1;
	getTest(test);
}
function previousTest(){
	
	if(test==1) test=35;
	else test=test-1;
	getTest(test);
}
function randomTest(){
var r=Math.floor(Math.random() * 35);
getTest(r);
}
function getTest(n) {
	document.getElementById("timer").style.color="#E1E2E2";
	document.getElementById("resTest").addEventListener("click", resetTest);
	document.getElementById("next").addEventListener("click", nextTest);
	document.getElementById("previous").addEventListener("click", previousTest);
	
	document.getElementById("res").style.visibility="hidden";
	document.getElementById("result").style.height="70px";
	spravneOdpovede = [];
	document.getElementById("timer").innerHTML = "20m:00s";
	countDownDate = new Date().getTime() + 12000;// 1200000ms == 20 minut
	clearInterval(time);
	time = setInterval(timer, 1000);

	for (var i = 0; i < 27; i++) {
		odpovede[i] = "";
	}
	const myNode = document.getElementById("data");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	adr = "http://localhost:8080/autoskola/webapi/resources/getTest";
	method = "POST";

	test = n;
	var newDiv = document.createElement("div");
	newDiv.setAttribute("class", "cisloTestu");
	var text = document.createTextNode("Test č. " + test);
	newDiv.appendChild(text);
	var element = document.getElementById("data").appendChild(newDiv);
	sendRequest(test,method,adr);
}


function sendRequest(str,method,adr) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var obj = JSON.parse(this.responseText);
		
			if(test!="")displayTest(obj);
			//if(Object.keys(obj).length==1)console.log(Object.keys(obj[0])+":"+Object.values(obj)+":"+Object.keys(obj).length);
			//if(Object.keys(obj).length==1&&Object.keys(obj!="user"))console.log("no user");
			//console.log(Object.keys(obj).length);
			
		}
	}
	
	xhttp.open(method, adr, true);
	xhttp.setRequestHeader("Content-type", "text/plain");
	// xhttp.setRequestHeader("Accept", "text/plain");
	xhttp.send(str);
}

function displayTest(obj) {

	var i = 1;
	var file = "";
	for ( var k in obj) {
		file = "images/" + test + "_" + i + ".png";

		spravneOdpovede.push(obj[k].answer)

		var newDiv = document.createElement("div");
		newDiv.setAttribute("class", "otazka");
		var text = document.createTextNode(obj[k].question);
		newDiv.appendChild(text);
		var element = document.getElementById("data").appendChild(newDiv);
		if (i >= 16) {
			var newImg = document.createElement("img");
			newImg.setAttribute("src", file);
			if (i >= 24)
				newImg.setAttribute("class", "crossroad");
			else
				newImg.setAttribute("class", "imgs");
			element.src = "images/" + test + "_" + i + ".png";
			element = document.getElementById("data").appendChild(newImg);
		}
		newDiv = document.createElement("div");
		newDiv.setAttribute("class", "abc");
		newDiv.setAttribute("id", test + "_" + i + "a");
		text = document.createTextNode(obj[k].optionA);
		newDiv.appendChild(text);
		element = document.getElementById("data").appendChild(newDiv);
		newDiv = document.createElement("div");
		newDiv.setAttribute("class", "abc");
		newDiv.setAttribute("id", test + "_" + i + "b");
		text = document.createTextNode(obj[k].optionB);
		newDiv.appendChild(text);
		element = document.getElementById("data").appendChild(newDiv);
		newDiv = document.createElement("div");
		newDiv.setAttribute("class", "abc");
		newDiv.setAttribute("id", test + "_" + i + "c");
		text = document.createTextNode(obj[k].optionC);
		newDiv.appendChild(text);
		element = document.getElementById("data").appendChild(newDiv);
		var items = document.getElementsByClassName("abc");
		for (var j = 0; j < items.length; j++) {
			items[j].addEventListener("click", logAnswer);
		}
		i++;
	}
	
}

function logAnswer() {
	var id = this.id;
	var cisloOtazky = "";
	var l = 0;
	for (l = 0; l < id.length - 2; l++) { // zisti cislo otazky , na kt som
		// odpovedal
		cisloOtazky = "";
		if (id.charAt(l) == ("_")) {
			cisloOtazky = cisloOtazky + id.charAt(l + 1);
			if (id.charAt(l + 2) == ("a") || id.charAt(l + 2) == ("b")
					|| id.charAt(l + 2) == ("c")) {
				l = id.length;
			} else {
				cisloOtazky = cisloOtazky + id.charAt(l + 2);
				l = id.length;
			}
		}
	}
	var odpoved = id.charAt(id.length - 1);

	checkIfAnswered(cisloOtazky, odpoved);

}

function checkIfAnswered(q, o, id) {
	console.log("checkIfAnswered " + q + " " + o + " " + s)
	var e = false;
	// for (var i = 0; i < 27; i++) {
	if (odpovede[q - 1] == "") {
		
		odpovede[q - 1] = o;
		document.getElementById(test + "_" + q + o).style.color = "#19FF19"; // novej
		// odpovedi
		// dame
		// zelenu
		// farbu
	} else {
		document.getElementById(test + "_" + q + odpovede[q - 1]).style.color = "#B3F2FF"; // starej
		// odpovedi
		// dame
		// povodnu
		// farbu
		document.getElementById(test + "_" + q + o).style.color = "#19FF19"; // novej
		// odpovedi
		// dame
		// zelenu
		// farbu
		odpovede[q - 1] = o;

	}
	// console.log(odpovede);
}



