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
var odpoved="";
var dobre="0";
var zle="0";
var tOtazky=[];

document.getElementById("rnd").addEventListener("click", randomTest);
document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("logoutButton").addEventListener("click", logout);
document.getElementById("home").addEventListener("click", home);
document.getElementById("randomq").addEventListener("mouseenter", showOptions); // /("click",
																				// nahodneOtazky)
document.getElementById("randomq").addEventListener("mouseleave", hideOptions); 
checkCookies();

function showOptions(){
	setTimeout(() => {  document.getElementById("vyberOtazku").style.display="block"; }, 600)
	
	
}
function hideOptions(){
	
		document.getElementById("vyberOtazku").style.display="none"; 
	
}

function home(){
	test="";
	document.getElementById("dobreZle").innerHTML="";
	document.getElementById("res").value="";
	document.getElementById("data").innerHTML="";
	document.getElementById("result").style.height="70px";
	clearInterval(time);
	document.getElementById("timer").innerHTML = "20m:00s";
	document.getElementById("timer").style.color = "#D1D2D2";
	document.getElementById("next").style.display="none";
	document.getElementById("previous").style.display="none";
	document.getElementById("dobreZle").style.display="none";
}
function saveResult(user,test,points,passed){
	
	if(loggedUser!=""){
		let currTest =new testResult(user,test,points,passed);
	console.log(currTest);
	let json = JSON.stringify(currTest);
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "http://localhost:8080/autoskola/webapi/resources/saveResult",
			true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send(json);
}else console.log("no logged user")
}

function otazka(id,q,a,b,c,o){
	this.id=id;
	this.q=q;
	this.a=a;
	this.b=b;
	this.c=c;
	this.o=o;	
}

function getOneQuestion(i){
	console.log("getOneQuestion "+i)
	clearInterval(time);
	document.getElementById("timer").innerHTML = "20m:00s";
	let adr="http://localhost:8080/autoskola/webapi/resources/getQuestion"
		let method="POST";
	let obj;
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			 obj = JSON.parse(this.responseText);	
			 displayQ(obj,i);
		}
	}
	xhttp.open(method, adr, true);
	xhttp.setRequestHeader("Content-type", "text/plain");
	// xhttp.setRequestHeader("Accept", "text/plain");
	xhttp.send(i);
	
}

function testResult(user,test,points,passed){
	this.user=user;
	this.test=test;
	this.points=points
	this.passed=passed;
}
function checkCookies(){
	let adr="http://localhost:8080/autoskola/webapi/resources/listCookies"
		let method="GET";
	let str="";
	sendRequest(str,method,adr);
}
function makeList() {
	const myNode = document.getElementById("tests");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}

	for (var j = 1; j < 36; j++) {
		let newDiv = document.createElement("div");
		newDiv.setAttribute("class", "testDropdown");
		newDiv.setAttribute("onclick", "getTest(" + j + ")");
		let text = document.createTextNode(j);
		newDiv.appendChild(text);
		let element = document.getElementById("tests").appendChild(newDiv);
	}
	document.getElementsByClassName("testDropdown").onmouseover = function() {
		this.style.backgroundColor = "#ddd";
	}
}

function login(){	
	let method="POST";
	let adr="http://localhost:8080/autoskola/webapi/resources/userLogin";
	let s=document.getElementById("username");
	
	if(s.value.length>2){
		console.log(s.value.length)
	loggedUser=s.value;
	console.log(loggedUser+"//"+s.value);
	sendText(method,adr,s.value);
	document.getElementById("username").style.display="none";
		document.getElementById("loginButton").style.display="none";
			document.getElementById("welcome").style.display="block";
			document.getElementById("hamburger").style.display="grid";
	// document.getElementById("hamburger").addEventListener("mouseover",
	// hamburgerMenu);
			document.getElementById("welcome").innerHTML="Welcome "+loggedUser;
			if(test!="") resetTest();
	} else{
	document.getElementById("username").value="";
	document.getElementById("username").placeholder="min length=3";
}
}
function hamburgerMenu(){
	document.getElementById("hamburger").style.background="white";
}
function logout(){
	loggedUser="";
	document.getElementById("username").style.display="initial"
		document.getElementById("loginButton").style.display="initial"
			document.getElementById("hamburger").style.display="none";
			document.getElementById("username").placeholder="enter user name";
	document.getElementById("username").value="";
	document.getElementById("welcome").style.display="none";
	let adr="http://localhost:8080/autoskola/webapi/resources/userLogout"
		let method="GET";
	let str="";
	sendText(method,adr,str);
	
}	
	
	function sendText(method,adr,str) {
			console.log("method "+method+"\n adr "+adr+"\n str "+str)
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				obj = this.responseText;	
			}
		}					
		xhttp.open(method, adr, true);
		xhttp.setRequestHeader("Content-type", "text/plain");
		/* xhttp.setRequestHeader("Accept", "application/json"); */
		xhttp.send(str);
	}
	
function eval() {
	let hodnotenie="";
	if(test!=0){    /* 1-12 za 2 body; 16-23 za 2 body; 24-27 za 3 body	*/																		// 13,14,15 za 1 bod
																			 
	clearInterval(time);													 																		 																		
	console.log(spravneOdpovede);											 																																		 
	console.log(odpovede);													 
																																					 
	let spravne=[];
	let nespravne=[];
	let dobreCoun=0;
	let zleCount=0;
	let body=0;
	let passed="false";
	for(let i=0;i<27;i++){
		
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
	if(body>=50)passed=true;
	document.getElementById("res").style.visibility="visible";
	document.getElementById("result").style.height="140px";
	if(body>=50)document.getElementById("res").style.color="green";
	if(body<50)document.getElementById("res").style.color="red";
	if(test=="")document.getElementById("res").value="vyber si test";
	document.getElementById("res").value = "dobre: "+dobreCoun+"\nzle: "+zleCount+"\nbody: "+body+"/55";
	
	saveResult(loggedUser,test,body,passed);
}
	else document.getElementById("res").value = "Najprv zrob test ;)"
}
function timer() {
	let distance = countDownDate - new Date().getTime();            // ziskame
																	// aktualny
																	// cas
	let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));    // vypocitame
																				// aktualne
																				// minuty
	let seconds = Math.floor((distance % (1000 * 60)) / 1000);             // //vypocitame
																			// aktualne
																			// sekundy
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
	console.log("reset odpovedi");
	odpovede=[];                               // "zabudne" odpovede
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
	console.log("random test called")
let r=Math.floor(Math.random() * 35);
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
	countDownDate = new Date().getTime() + 120000;// 1200000ms == 20 minut
	clearInterval(time);
	time = setInterval(timer, 1000);

	for (let i = 0; i < 27; i++) {
		odpovede[i] = "";
	}
	const myNode = document.getElementById("data");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	adr = "http://localhost:8080/autoskola/webapi/resources/getTest";
	method = "POST";

	test = n;
	let newDiv = document.createElement("div");
	newDiv.setAttribute("class", "cisloTestu");
	let text = document.createTextNode("Test č. " + test);
	newDiv.appendChild(text);
	let element = document.getElementById("data").appendChild(newDiv);
	sendRequest(test,method,adr);
}


function sendRequest(str,method,adr) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let obj = JSON.parse(this.responseText);	
			if(test!="")displayTest(obj);		
		}
	}
	xhttp.open(method, adr, true);
	xhttp.setRequestHeader("Content-type", "text/plain");
	// xhttp.setRequestHeader("Accept", "text/plain");
	xhttp.send(str);
}

function displayTest(obj) {
	let i = 1;
	let file = "";
	document.getElementById("next").style.display="block";
	document.getElementById("previous").style.display="block";
	document.getElementById("dobreZle").style.display="none";
	for ( let k in obj) {
		file = "images/" + test + "_" + i + ".png";
		document.getElementById("data").style.display="initial";
		spravneOdpovede.push(obj[k].answer)

		let newDiv = document.createElement("div");
		newDiv.setAttribute("class", "otazka");
		let text = document.createTextNode(obj[k].question);
		newDiv.appendChild(text);
		let element = document.getElementById("data").appendChild(newDiv);
		if (i >= 16) {
			let newImg = document.createElement("img");
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
		let items = document.getElementsByClassName("abc");
		for (let j = 0; j < items.length; j++) {
			items[j].addEventListener("click", logAnswer);
		}
		i++;
	}
}

function logAnswer() {
	let id = this.id;
	let cisloOtazky = "";
	let l = 0;
	for (l = 0; l < id.length - 2; l++) { // zisti cislo otazky , na kt som odpovedal
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
	let e = false;
	if (odpovede[q - 1] == "") {
		odpovede[q - 1] = o;
		document.getElementById(test + "_" + q + o).style.color = "#19FF19"; // novej odpovedi dame zelenu farbu
	} else {
		document.getElementById(test + "_" + q + odpovede[q - 1]).style.color = "#B3F2FF"; // starej odpovedi dame povodnu farbu
		document.getElementById(test + "_" + q + o).style.color = "#19FF19"; // novej odpovedi dame zelenu farbu
		odpovede[q - 1] = o;
	}
}

mybtn = document.getElementById("toTheTopBtn");




window.onscroll = function() {scroll()};

function scroll() {
if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
	mybtn.style.display = "block";
} else {
	mybtn.style.display = "none";
}
}
function topFunction() {
document.body.scrollTop = 0; 
document.documentElement.scrollTop = 0; 
}

function vyberOtazok(idO){

	console.log("typ otazky "+idO);
	let typOtazky=idO;
	let s="";
	let checkBoxes=document.getElementsByClassName("otazkaInput");	
for(let i=0;i<checkBoxes.length;i++){
	checkBoxes[i].checked=false;	
}
	document.getElementById(typOtazky).checked=true;	
nahodneOtazky(typOtazky);
}

function nahodneOtazky(typOtazky){
console.log("nahodneOtazky "+typOtazky)
	let cisloOtazky=5;
	let b=0;
	let e=0;
	dobre="0";
	zle="0";
	home();
	document.getElementById("dobreZle").style.display="block";
	
	let znacky=true;
	let krizovatky=true;
	let zakon=true;
	// logika pre vybratie otazky konkretneho typu (krizovatky,znacky,....) //id
	// 1-945
	// zakon za 2 body //1-12
	// zakon za 1 bod //13 14 15
	// znacky //16 17 18 19 20 21 22 23
    // krizovatky //24 25 26 27
	/*
	switch(typOtazky){
	case "zakon":{
		tOtazky=[];
		b=1;
		e=15;
	}
	break;
	case "znacky":{
		tOtazky=[];
		b=16;
		e=23;
	}
	break;
	case "krizovatky":{
		tOtazky=[];
		b=24;
		e=27;
	}
	}
	for(var i=1;i<946;i++){// pocet vsetkych otazok 946
		if(i>=b&&i<=e){	
	tOtazky.push(i)	;
		}
		if(i>e){
			b=b+27;
		e=e+27;
	// console.log(tOtazky+"\n"+"\n"+tOtazky.length)
		}
	}*/
	document.getElementById("dobreZle").innerHTML="dobre : "+dobre+" zle: "+zle;
	nextq();
}

function displayQ(obj,i){
	
	odpoved =obj.odpoved; 
	let newDiv;
	let text;
	document.getElementById("data").innerHTML="";
	let element1 = document.getElementById("img");
	 if(element1!=null) element1.classList.remove("img");
	 let element2 = document.getElementById("crossroad");
	 if(element2!=null) element2.classList.remove("crossroad");
	 
	 let elements = document.getElementsByClassName("abc");
	    while(elements.length > 0){
	        elements[0].parentNode.removeChild(elements[0]);
	    }
	 
	// document.getElementsByClassName("imgs").remove;
	// document.getElementsByClassName("abc").remove;
	// var el=document.getElementsByClassName("otazka");
	// el.remove;
// console.log("otazka_id "+obj.otazka_id)
// console.log("cislo testu "+Math.floor((obj.otazka_id/27)+1) )
// console.log("cislo otazky "+obj.otazka_id%27)
	   
	  
	  if(obj.otazka_id>27)  file = "images/" +  Math.floor((obj.otazka_id/27)+1) + "_" + obj.otazka_id%27 + ".png";     // cisloTestu_cisloOtazky.png
	  else file = "images/" +  1 + "_" + obj.otazka_id + ".png";   
	if(obj.otazka_id%27==0) file = "images/" +  Math.floor((obj.otazka_id/27)+1) + "_27.png"; 
	  // "next" button
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "button");
	newDiv.setAttribute("id", "nextQ");
	text = document.createTextNode("next");
	newDiv.appendChild(text);
	element = document.getElementById("data").appendChild(newDiv);
	document.getElementById("nextQ").innerHTML="next ("+tOtazky.length+") ";
	
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "otazka");
	text = document.createTextNode(obj.otazka);
	newDiv.appendChild(text);
	element = document.getElementById("data").appendChild(newDiv);
	
	if ((obj.otazka_id>=16&&obj.otazka_id<=27) || obj.otazka_id%27 >= 16||obj.otazka_id%27 == 0) { 
		
		
		let newImg = document.createElement("img");
		newImg.setAttribute("src", file);
		newImg.setAttribute("id", "img");
		newImg.setAttribute("class", "img");
		if (i >= 24){
			newImg.setAttribute("class", "crossroad");
			newImg.setAttribute("id", "crossroad");
		}
		else
			newImg.setAttribute("class", "imgs");
		element.src = "images/" + test + "_" + i + ".png";
		element = document.getElementById("data").appendChild(newImg);
		
	}
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "abc");
    text = document.createTextNode(obj.moznostA);
	newDiv.appendChild(text);
	element = document.getElementById("data").appendChild(newDiv);
	
	
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "abc");
	text = document.createTextNode(obj.moznostB);
	newDiv.appendChild(text);
	element = document.getElementById("data").appendChild(newDiv);
	
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "abc");
	text = document.createTextNode(obj.moznostC);
	newDiv.appendChild(text);
	element = document.getElementById("data").appendChild(newDiv);

	
	/*
	 * console.log(""+obj.otazka_id); console.log("\n"+obj.otazka);
	 * console.log("\n"+obj.moznostA); console.log("\n"+obj.moznostB);
	 * console.log("\n"+obj.moznostC); console.log("\n"+obj.odpoved);
	 */
	
	let items = document.getElementsByClassName("abc");
	for (let j = 0; j < items.length; j++) {
		items[j].addEventListener("click", checkAnswer);
	}
	
	 document.getElementById("nextQ").addEventListener("click",nextq)
}





function checkAnswer(ans){
	
// console.log("check")
	console.log("tvoja odpoved: "+this.innerHTML.substring(0,1)+" :: Spravna odpoved: "+odpoved)
	// 80FF80
	// document.getElementsByClassName("abc").style.backgroundColor="#1D2228";
	let items = document.getElementsByClassName("abc");
	for (let j = 0; j < items.length; j++) {
		items[j].removeEventListener("click", checkAnswer);
		items[j].style.background="#1D2228";
	
	}
	
	if(this.innerHTML.substring(0,1)==odpoved){
		this.style.background="#008000"; // spravna odpoved - zelena
		// console.log(this.className+"=zelena");
	 dobre++;
	}else{
		this.style.background="#800000"; // nesparavna odpoved - cervena
		// console.log(this.className+"=cervena");
		console.log("o: "+odpoved);
		zle++;
		
	/*
	 * switch(odpoved){ case "a" :items[0].style.background="#FF9900"; case "b"
	 * :items[1].style.background="#99CCFF"; case "c"
	 * :items[2].style.background="#FF00FF"; }
	 */
	}
	
	
	document.getElementById("dobreZle").innerHTML="dobre : "+dobre+" zle: "+zle;
	
}

function nextq(){
	console.log("tOtazky.length: "+tOtazky.length)
	let rnd=Math.floor(Math.random() * tOtazky.length);
	
	getOneQuestion(tOtazky[rnd]);
	tOtazky.splice(rnd,1);
	if(tOtazky.length==0) document.getElementById("data").innerHTML="dosli otazky :(";
	
}



