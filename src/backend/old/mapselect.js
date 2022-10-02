  /*
function setMapPL() {
    var selectedMap = "pl";
    sessionStorage.setItem("selectedMap", selectedMap);
    //document.getElementById("btn_start").classList.remove("disabled");
    startGame();
}

function setMapTR() {
    var selectedMap = "tr";
    sessionStorage.setItem("selectedMap", selectedMap);
    //document.getElementById("btn_start").classList.remove("disabled");
    startGame();
}

function setMapCZ() {
    var selectedMap = "cz";
    sessionStorage.setItem("selectedMap", selectedMap);
    //document.getElementById("btn_start").classList.remove("disabled");
    startGame();
}

function setMapWWA() {
    var selectedMap = "wwa";
    sessionStorage.setItem("selectedMap", selectedMap);
    //document.getElementById("btn_start").classList.remove("disabled");
    startGame();
}

function setMapFKL() {
    var selectedMap = "fkl";
    sessionStorage.setItem("selectedMap", selectedMap);
    //document.getElementById("btn_start").classList.remove("disabled");
    startGame();
}

function setMapNDG() {
    var selectedMap = "ndg";
    sessionStorage.setItem("selectedMap", selectedMap);
    //document.getElementById("btn_start").classList.remove("disabled");
    startGame();
}

function setMapEU() {
    var selectedMap = "eu";
    sessionStorage.setItem("selectedMap", selectedMap);
    //document.getElementById("btn_start").classList.remove("disabled");
    startGame();
}

*/
sessionStorage.clear();

function handleFileSelect(evt) {
    let files = evt.target.files; // FileList object

    // use the 1st file from the list
    let f = files[0];
    
    let reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
          //document.getElementById("mapdata-text").innerHTML = e.target.result;
          sessionStorage.setItem("custom_mapData", e.target.result);
        };
      })(f);
      // Read in the image file as a data URL.
      var readerData = reader.readAsText(f);
      console.log(files);
      startGame();
  }

  document.getElementById('upload').addEventListener('change', handleFileSelect, false);
  
  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

async function loadMap(mapCode) {
    $.get(`https://kamelowy.xyz/maps/${mapCode}.ogmap`, function(responseText) {
        sessionStorage.setItem(`${mapCode}_mapData`, responseText);
        delay(2000);
        startGame();
    });
}

async function showSettingsMenu() {
    document.getElementById("popup-black").style.display = "block";
    document.getElementById("popup-settings").style.display = "flex";
    psettingscard.style.display = "flex";
}

async function startGameWithSettings() {
    sessionStorage.setItem("czas", czas_value);
    sessionStorage.setItem("tryb", tryb_value);
}

async function setMap(mapCode) {
    let selectedMap = mapCode;
    sessionStorage.setItem("selectedMap", selectedMap);
    showSettingsMenu();
}

async function startGameSettings() {
    startGameWithSettings();
    var mapCode = sessionStorage.getItem("selectedMap");
    if (mapCode == 'custom') {
        document.getElementById('upload').click();
    } else if (mapCode != 'fkl') {
        loadMap(mapCode);
    } else {
        startGame();
    }
}

function startGame() {
    window.location.href = "geo.html";
}
/*
function buttonSelected() {
    var selectedMapButtonName = sessionStorage.getItem("selectedMap");

    if (selectedMapButtonName == "pl") {
        document.getElementById("btn_pl").style.border = "2px solid #fa3a45";
        document.getElementById("btn_pl").style.borderRadius = "10px";
        document.getElementById("btn_pl").style.paddingTop = "20px";
        document.getElementById("btn_pl").style.paddingBottom = "14px";
        document.getElementById("btn_pl").style.fontSize = "28px";
        document.getElementById("btn_pl").style.opacity = "1";
    } else {
        document.getElementById("btn_pl").style.border = "none";
        document.getElementById("btn_pl").style.borderRadius = "10px";
        document.getElementById("btn_pl").style.paddingTop = "16px";
        document.getElementById("btn_pl").style.paddingBottom = "10px";
        document.getElementById("btn_pl").style.fontSize = "24px";
        document.getElementById("btn_pl").style.opacity = "0.5";
    }
    if (selectedMapButtonName == "tr") {
        document.getElementById("btn_tr").style.border = "2px solid #fa3a45";
        document.getElementById("btn_tr").style.borderRadius = "10px";
        document.getElementById("btn_tr").style.paddingTop = "20px";
        document.getElementById("btn_tr").style.paddingBottom = "14px";
        document.getElementById("btn_tr").style.fontSize = "28px";
        document.getElementById("btn_tr").style.opacity = "1";
    } else {
        document.getElementById("btn_tr").style.border = "none";
        document.getElementById("btn_tr").style.borderRadius = "10px";
        document.getElementById("btn_tr").style.paddingTop = "16px";
        document.getElementById("btn_tr").style.paddingBottom = "10px";
        document.getElementById("btn_tr").style.fontSize = "24px";
        document.getElementById("btn_tr").style.opacity = "0.5";
    }

    if (selectedMapButtonName == "cz") {
        document.getElementById("btn_cz").style.border = "2px solid #fa3a45";
        document.getElementById("btn_cz").style.borderRadius = "10px";
        document.getElementById("btn_cz").style.paddingTop = "20px";
        document.getElementById("btn_cz").style.paddingBottom = "14px";
        document.getElementById("btn_cz").style.fontSize = "28px";
        document.getElementById("btn_cz").style.opacity = "1";
    } else {
        document.getElementById("btn_cz").style.border = "none";
        document.getElementById("btn_cz").style.borderRadius = "10px";
        document.getElementById("btn_cz").style.paddingTop = "16px";
        document.getElementById("btn_cz").style.paddingBottom = "10px";
        document.getElementById("btn_cz").style.fontSize = "24px";
        document.getElementById("btn_cz").style.opacity = "0.5";
    }

    if (selectedMapButtonName == "wwa") {
        document.getElementById("btn_wwa").style.border = "2px solid #fa3a45";
        document.getElementById("btn_wwa").style.borderRadius = "10px";
        document.getElementById("btn_wwa").style.paddingTop = "20px";
        document.getElementById("btn_wwa").style.paddingBottom = "14px";
        document.getElementById("btn_wwa").style.fontSize = "28px";
        document.getElementById("btn_wwa").style.opacity = "1";
    } else {
        document.getElementById("btn_wwa").style.border = "none";
        document.getElementById("btn_wwa").style.borderRadius = "10px";
        document.getElementById("btn_wwa").style.paddingTop = "16px";
        document.getElementById("btn_wwa").style.paddingBottom = "10px";
        document.getElementById("btn_wwa").style.fontSize = "24px";
        document.getElementById("btn_wwa").style.opacity = "0.5";
    }

    if (selectedMapButtonName == "fkl") {
        document.getElementById("btn_fkl").style.border = "2px solid #fa3a45";
        document.getElementById("btn_fkl").style.borderRadius = "10px";
        document.getElementById("btn_fkl").style.paddingTop = "20px";
        document.getElementById("btn_fkl").style.paddingBottom = "14px";
        document.getElementById("btn_fkl").style.fontSize = "28px";
        document.getElementById("btn_fkl").style.opacity = "1";
    } else {
        document.getElementById("btn_fkl").style.border = "none";
        document.getElementById("btn_fkl").style.borderRadius = "10px";
        document.getElementById("btn_fkl").style.paddingTop = "16px";
        document.getElementById("btn_fkl").style.paddingBottom = "10px";
        document.getElementById("btn_fkl").style.fontSize = "24px";
        document.getElementById("btn_fkl").style.opacity = "0.5";
    }

    if (selectedMapButtonName == "ndg") {
        document.getElementById("btn_ndg").style.border = "2px solid #fa3a45";
        document.getElementById("btn_ndg").style.borderRadius = "10px";
        document.getElementById("btn_ndg").style.paddingTop = "20px";
        document.getElementById("btn_ndg").style.paddingBottom = "14px";
        document.getElementById("btn_ndg").style.fontSize = "28px";
        document.getElementById("btn_ndg").style.opacity = "1";
    } else {
        document.getElementById("btn_ndg").style.border = "none";
        document.getElementById("btn_ndg").style.borderRadius = "10px";
        document.getElementById("btn_ndg").style.paddingTop = "16px";
        document.getElementById("btn_ndg").style.paddingBottom = "10px";
        document.getElementById("btn_ndg").style.fontSize = "24px";
        document.getElementById("btn_ndg").style.opacity = "0.5";
    }

    if (selectedMapButtonName == "eu") {
        document.getElementById("btn_eu").style.border = "2px solid #fa3a45";
        document.getElementById("btn_eu").style.borderRadius = "10px";
        document.getElementById("btn_eu").style.paddingTop = "20px";
        document.getElementById("btn_eu").style.paddingBottom = "14px";
        document.getElementById("btn_eu").style.fontSize = "28px";
        document.getElementById("btn_eu").style.opacity = "1";
    } else {
        document.getElementById("btn_eu").style.border = "none";
        document.getElementById("btn_eu").style.borderRadius = "10px";
        document.getElementById("btn_eu").style.paddingTop = "16px";
        document.getElementById("btn_eu").style.paddingBottom = "10px";
        document.getElementById("btn_eu").style.fontSize = "24px";
        document.getElementById("btn_eu").style.opacity = "0.5";
    }

    if (selectedMapButtonName == "usa") {
        document.getElementById("btn_usa").style.border = "2px solid #fa3a45";
        document.getElementById("btn_usa").style.borderRadius = "10px";
        document.getElementById("btn_usa").style.paddingTop = "20px";
        document.getElementById("btn_usa").style.paddingBottom = "14px";
        document.getElementById("btn_usa").style.fontSize = "28px";
        document.getElementById("btn_usa").style.opacity = "1";
    } else {
        document.getElementById("btn_usa").style.border = "none";
        document.getElementById("btn_usa").style.borderRadius = "10px";
        document.getElementById("btn_usa").style.paddingTop = "16px";
        document.getElementById("btn_usa").style.paddingBottom = "10px";
        document.getElementById("btn_usa").style.fontSize = "24px";
        document.getElementById("btn_usa").style.opacity = "0.5";
    }

    if (selectedMapButtonName == "custom") {
        document.getElementById("btn_custom").style.border = "2px solid #ffffff";
        document.getElementById("btn_custom").style.borderRadius = "10px";
        document.getElementById("btn_custom").style.paddingTop = "20px";
        document.getElementById("btn_custom").style.paddingBottom = "14px";
        document.getElementById("btn_custom").style.fontSize = "28px";
        document.getElementById("btn_custom").style.opacity = "1";
        document.getElementById("btn_custom").style.backgroundColor = "#cf4646";
    } else {
        document.getElementById("btn_custom").style.border = "none";
        document.getElementById("btn_custom").style.borderRadius = "10px";
        document.getElementById("btn_custom").style.paddingTop = "16px";
        document.getElementById("btn_custom").style.paddingBottom = "10px";
        document.getElementById("btn_custom").style.fontSize = "24px";
        document.getElementById("btn_custom").style.opacity = "0.5";
        document.getElementById("btn_custom").style.backgroundColor = "#222222";
    }
    
}
*/