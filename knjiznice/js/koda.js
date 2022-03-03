var baza = 'dr4xand0';
var baseUrl = 'https://teaching.lavbic.net/api/OIS/baza/' + baza + '/podatki/';


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function priporocenoCepivo(rojstniDan, boloval) {
  var datum = rojstniDan.split("/");
  var starostSpodnjaMeja = new Date(Number(datum[2]) + 18, Number(datum[0]), Number(datum[1]));
  var starostZgornjaMeja = new Date(Number(datum[2]) + 65, Number(datum[0]), Number(datum[1]));
  var systemTime = new Date();
  var cepivo = document.getElementById("cepivoField");
  if (systemTime >= starostZgornjaMeja) {
    cepivo.innerHTML = "Po priporočilu NIJZ-a prejeti cepivo Pfizer/BioNTech. ";
  }
  else if (systemTime < starostSpodnjaMeja) {
    cepivo.innerHTML = "Po priporočilu NIJZ-a osebe mlajše od 18 prejeti cepivo Pfizer/BioNTech. ";
    console.log("Mladji od 18");
  }
  else {
    cepivo.innerHTML = "Po priporočilu NIJZ-a prejeti cepivo AstraZeneca. ";
  }
  if (boloval == 'Da') {
    cepivo.innerHTML += "Priporočeno prejeti le en odmerek saj je oseba že bolovala.";
  }
  else {
    cepivo.innerHTML += "Oseba mora prejeti 2 odmerka saj ni nikoli bolovala.";
  }

}
function generirajPodatkePacienta() {
  console.log(generirajID());
  var dropDown = document.getElementById("preberiObstojeciEHR");
  var selectedItem = dropDown.options[dropDown.selectedIndex].text;
  console.log(selectedItem);
  var imePriimek = selectedItem.split(" ");
  console.log(imePriimek);
  var ajax = new XMLHttpRequest();
  ajax.overrideMimeType("application/json");
  ajax.open('GET', "https://teaching.lavbic.net/api/OIS/baza/dr4xand0/podatki/vrni/pacienti", false);
  console.log(ajax);
  ajax.onreadystatechange = function () {
    if(ajax.readyState == 4 && ajax.status == "200") {
      var pacienti = JSON.parse(this.responseText);
      pacienti.pacienti.forEach(function (pacient) {
        if(pacient.ime == imePriimek[0] && pacient.priimek == imePriimek[1]) {
          var rojstniDatum = document.getElementById("datumRojstvaPacientaField");
          var spol = document.getElementById("spolPacienta");
          var drzava = document.getElementById("drzavaPacienta");
          var tezina = document.getElementById("tezinaPacienta");
          var alergije = document.getElementById("alergijaField");
          var visina = document.getElementById("visinaField");
          var bolezen = document.getElementById("bolezenField");
          var boloval = document.getElementById("bolovalField");
          var imeInPriimek = document.getElementById("imePacientaField");
          imeInPriimek.innerHTML = pacient.ime + " " + pacient.priimek;
          rojstniDatum.innerHTML = pacient.rojstniDatum;
          spol.innerHTML = pacient.spol;
          drzava.innerHTML = pacient.drzava;
          tezina.innerHTML = pacient.tezina;
          alergije.innerHTML = pacient.alergije;
          visina.innerHTML = pacient.visina;
          bolezen.innerHTML = pacient.bolezen;
          boloval.innerHTML = pacient.boloval;
          priporocenoCepivo(pacient.rojstniDatum, pacient.boloval);

        }
      });
    }

  };
  ajax.send();
}

function showID() {
  var ehrIDTextBox = document.getElementById("preberiEHRid");
  ehrIDTextBox.value = generirajID();
}
function popolniDropDown(pacienti) {
  var dropDown = document.getElementById("preberiObstojeciEHR");
  var parse = JSON.stringify(pacienti);
  console.log(pacienti[0].ime);
  console.log( parse + "test");
  pacienti.forEach(function (pacient) {
    var izbranoIme = document.createElement("option");
    izbranoIme.text = pacient.ime + ' ' + pacient.priimek;
    dropDown.options.add(izbranoIme);
  });
}
function generirajPodatke(stPacienta) {
  console.log("helloWorld");
  ehrID = generirajID;
  var ajax = new XMLHttpRequest();
  ajax.overrideMimeType("application/json");
  ajax.open('GET', "https://teaching.lavbic.net/api/OIS/baza/dr4xand0/podatki/vrni/pacienti", false);
  console.log(ajax);
  ajax.onreadystatechange = function () {
    if(ajax.readyState == 4 && ajax.status == "200") {
      var pacienti = JSON.parse(this.responseText);
      console.log(pacienti);
      popolniDropDown(pacienti.pacienti);
    }
  // TODO: Potrebno implementirati

  };
  ajax.send();
  return ehrID;
}
function generirajID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
