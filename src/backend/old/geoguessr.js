let minimap;
let pano;
let lineBetween;
let mapCoords;
let markerCoords;
let coords = [];
//About map sizes:
//small - small village/town
//normal - city
//big - country
//huge - continent/huge country (e.g. USA)
let ogMapSize = "normal";
var avatar = "images/default-avatar.png";

window.gameEnded = false;
window.endedByTime = false;
window.markerPlaced = false;
document.getElementById("next-button").style.display = "none";
document.getElementById("submit-button").style.display = "block";

if (window.markerPlaced == false) {
    document.getElementById("submit-button").style.backgroundColor = "#fff";
    document.getElementById("submit-button").style.color = "#000";
    document.getElementById("submit-button").disabled = true;
}

window.points = sessionStorage.getItem("points");
if (window.points == null) {
    window.points = 0;
} else {
    window.points = parseInt(window.points);
}

window.rounds = sessionStorage.getItem("rounds");
if (window.rounds == null) {
    window.rounds = 0;
} else if (window.rounds != null && parseInt(window.rounds) != 5) {
    window.rounds = parseInt(window.rounds);
} else {
    window.rounds = 0;
    window.points = 0;
}

if (window.rounds == 5) {
    sessionStorage.setItem("rounds", 0);
    sessionStorage.setItem("points", 0);
    window.rounds = 0;
    window.points = 0;
}

if (window.rounds != 5) {
    let allPoints = window.points;
    let currentRound = window.rounds + 1;
    document.getElementById("score-value").innerHTML = allPoints;
    document.getElementById("round-value").innerHTML = currentRound;
} else {
    document.getElementById("score-value").innerHTML = "0";
    document.getElementById("round-value").innerHTML = "1";
}

const nowydwor = [
    {lat: 54.2208, lng: 19.1177},
    {lat: 54.2134, lng: 19.1313},
    {lat: 54.2077, lng: 19.1297},
    {lat: 54.2036, lng: 19.1232},
    {lat: 54.2009, lng: 19.1163},
    {lat: 54.2020, lng: 19.1145},
    {lat: 54.2038, lng: 19.1155},
    {lat: 54.2073, lng: 19.1160},
    {lat: 54.2092, lng: 19.1107},
    {lat: 54.2101, lng: 19.1045},
    {lat: 54.2137, lng: 19.0982},
    {lat: 54.2186, lng: 19.1059},
    {lat: 54.2208, lng: 19.1177}
];

var selectedMap = sessionStorage.getItem("selectedMap");

if (sessionStorage.getItem("lastMap") == null) {
    sessionStorage.setItem("lastMap", selectedMap);
}

if (sessionStorage.getItem("lastMap") != sessionStorage.getItem("selectedMap")) {
    sessionStorage.setItem("rounds", 0);
    sessionStorage.setItem("points", 0);
    window.rounds = 0;
    window.points = 0;
    sessionStorage.setItem("lastMap", selectedMap);
    location.reload();
}

function initMap() {
    async function getMap(mapCode) {
        var encMapData = sessionStorage.getItem(`${mapCode}_mapData`);
        var mapData = CryptoJS.AES.decrypt(encMapData, "954xtftmZjBCdgTPgFPFy5efJCfvdrbGkc4fjrQmgjBzuFjXs29TbRWrxr3v").toString(CryptoJS.enc.Utf8);
        if (mapData != null && mapData.match(/^\d/)) {
            var dataArray = mapData.split(",");
            var finalDataArray = [];

            dataArray.forEach(element => {
                var splitted = element.split(":");
                finalDataArray.push(splitted);
            });

            var latlngArray = new google.maps.MVCArray();
            finalDataArray.forEach(element => {
                latlngArray.push(new google.maps.LatLng(parseFloat(element[0]),parseFloat(element[1])));
            });

            const mapPolygon = new google.maps.Polygon({
                paths: latlngArray,
                strokeColor: "#222222",
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: "#ffffff",
                fillOpacity: 0.35,
                editable: false,
            });

            // calculate the bounds of the polygon
            var bounds = new google.maps.LatLngBounds();

            for (var i=0; i < mapPolygon.getPath().getLength(); i++) {
                bounds.extend(mapPolygon.getPath().getAt(i));
            }

            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();

            // Guess 100 random points inside the bounds, 
            // put a marker at the first one contained by the polygon and break out of the loop
            for (var i = 0; i < 100; i++) {
                var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
                var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
                var point = new google.maps.LatLng(ptLat,ptLng);
                
                if (google.maps.geometry.poly.containsLocation(point,mapPolygon)) {
                    window.x = ptLat;
                    window.y = ptLng;
                break;
                }
            }
        } else {
            window.location.href = "index.html";
        }
    }
        switch (selectedMap) {
            case "usa":
                ogMapSize = "huge";
                getMap('usa');
                break;
            case "europe":
                ogMapSize = "huge";
                getMap('europe');
                break;
            case "poland":
                ogMapSize = "big";
                getMap('poland');
                break;
            case "warsaw":
                ogMapSize = "normal";
                getMap('warsaw');
                break;
            case "czestochowa":
                ogMapSize = "normal";
                getMap('czestochowa');
                break;
            case "trojmiasto":
                ogMapSize = "normal";
                getMap('trojmiasto');
                break;
            case "custom":
                ogMapSize = "big";
                getMap('custom');
                break;
            case "fkl":
                ogMapSize = "normal";
                let fkl_r = Math.round(Math.random()*10);
            switch (fkl_r) {
                case 0:
                    //Halinów
                    window.x = 52.224 + Math.random() * 0.009;
                    window.y = 21.35 + Math.random() * 0.013;
                    break;
                case 1:
                    //Mińsk Mazowiecki
                    window.x = 52.176 + Math.random() * 0.007;
                    window.y = 21.564 + Math.random() * 0.012;
                    break;
                case 2:
                    //Bochnia
                    window.x = 49.955 + Math.random() * 0.033;
                    window.y = 20.414 + Math.random() * 0.029;
                    break;
                case 3:
                    //Nowy Wiśnicz
                    window.x = 49.909 + Math.random() * 0.009;
                    window.y = 20.455 + Math.random() * 0.014;
                    break;
                case 4:
                    //Częstochowa
                    window.x = 50.8 + Math.random() * 0.023;
                    window.y = 19.098 + Math.random() * 0.039;
                    break;
                case 5:
                    //Krosno Odrzańskie
                    window.x = 52.042 + Math.random() * 0.015;
                    window.y = 15.094 + Math.random() * 0.016;
                    break;
                case 6:
                    //Radom
                    window.x = 51.375 + Math.random() * 0.042;
                    window.y = 21.125 + Math.random() * 0.051;
                    break;
                case 7:
                    //Kielce
                    window.x = 50.866 + Math.random() * 0.027;
                    window.y = 20.612 + Math.random() * 0.041;
                    break;
                case 8:
                    //Miechów
                    window.x = 50.352 + Math.random() * 0.011;
                    window.y = 20.019 + Math.random() * 0.017;
                    break;
                case 9:
                    //Tychowo
                    window.x = 53.925 + Math.random() * 0.009;
                    window.y = 16.253 + Math.random() * 0.017;
                    break;
                case 10:
                    //Gdynia
                    window.x = 54.479 + Math.random() * 0.068;
                    window.y = 18.525 + Math.random() * 0.024;
                    break;
                default:
                    //Gdynia
                    window.x = 54.479 + Math.random() * 0.068;
                    window.y = 18.525 + Math.random() * 0.024;
                    break;
                }
                break;
            default:
                window.location.href("./index.html");
                break;
        }
    async function getStreetView(position) {
        var metr = (Math.floor(Math.random()*11)*100+1000)+5000,
        location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        svs = new google.maps.StreetViewService();
        svs.getPanorama({location: location, preference: google.maps.StreetViewPreference.NEAREST, radius: metr, source: google.maps.StreetViewSource.OUTDOOR}, showPosition);
    }
    async function showPosition(svData, svStatus) {
        if (svStatus == 'OK') {
            window.map_position_x = parseFloat(svData.location.latLng.lat());
            coords.push(svData.location.latLng);
            window.map_position_y = parseFloat(svData.location.latLng.lng());
            window.map_position_latLng = svData.location.latLng;
            var panoramaOptions = {
                position: svData.location.latLng,
                pov: {
                    heading: 0,
                    pitch: 0
                    },
                zoom: -1,
                disableDefaultUI: true,
                showRoadLabels: false,
            };
            pano = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
            if (sessionStorage.getItem("tryb") == "No Move"){
                pano.setOptions({
                    clickToGo: false,
                });
            }
            google.maps.event.addListener(pano, 'pov_changed', function() {
            var heading_degrees = pano.getPov().heading.toFixed(1);
            document.getElementById("compass_neddle").style.transform = "rotate(" + heading_degrees + "deg)";
            var compassDisc = document.getElementById("hor-compassDiscImg");
            var offset = 0;
            var totalDir = -(heading_degrees + offset);
            compassDisc.style.left =  (totalDir) - 135 +"px";
            });
        } else {
            getStreetView({coords: {latitude: window.x-=0.005, longitude: window.y-=0.005}});
        }
    }
    getStreetView({coords: {latitude: window.x, longitude: window.y}});

    minimap = new google.maps.Map(document.getElementById("minimap"), {
    //center: { lat: 52.05, lng: 19.48 },
    center: {lat: 35.0, lng: -39.5},
    disableDefaultUI: true,
    clickableIcons: false,
    zoom: 1,
    styles: [
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#dddddd" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#aaaaaa" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
      ],  
  });

  window.map_position_latLng = new google.maps.LatLng(window.x, window.y);

  window.userMarker = new google.maps.Marker({
    position: { lat: 0.0, lng: 0.0 },
    map: minimap,
    zIndex: 100,
    icon: {
        url: avatar,
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 16),
    },
    title: "Wybrane miejsce",
    visible: false,
  });

    google.maps.event.addListener(userMarker, 'mouseover', function() {
        userMarker.setIcon({
            url: avatar,
            scaledSize: new google.maps.Size(34, 34),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 17),
        });
    });

    google.maps.event.addListener(userMarker, 'mouseout', function() {
        userMarker.setIcon({
            url: avatar,
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16),
        });
    });
    
  window.goalMarker = new google.maps.Marker({
    position: { lat: 0.0, lng: 0.0 },
    map: minimap,
    zIndex: 50,
    icon: {
        /*
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#ffffff',
        fillOpacity: 1,
        strokeColor: '#ff4242',
        strokeWeight: 2,
        outlineColor: '#ff4242',
        outlineWeight: 2,
        */
        url: "./img/open_pin.png",
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 16),
    },
    title: "Miejsca docelowe",
    visible: false,
    });

    window.lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 0,
        strokeWeight: 2,
        scale: 4,
    };

    window.visibleLineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        strokeWeight: 2,
        scale: 4,
    };

    google.maps.event.addListener(goalMarker, 'mouseover', function() {
        goalMarker.setIcon({
            url: "./img/open_pin.png",
            scaledSize: new google.maps.Size(34, 34),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 17),
        });
    });

    google.maps.event.addListener(goalMarker, 'mouseout', function() {
        goalMarker.setIcon({
            url: "./img/open_pin.png",
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16),
        });
    });

    window.line = new google.maps.Polyline({
        path: [
            { lat: 0.0, lng: 0.0 },
            { lat: 0.0, lng: 0.0 },
        ],
        strokeColor: "#222222",
        strokeOpacity: 0.0,
        icons: [
            {
              icon: window.lineSymbol,
              offset: "0px",
              repeat: "15px",
            },
          ],      
        map: minimap,
        visible: true,
    });

    google.maps.event.addListener(minimap, 'click', function (event) {
        displayCoordinates(event.latLng);
        });

        function displayCoordinates(pnt) {
            if (window.gameEnded == false) {
                window.marker_position_x = pnt.lat();
                window.marker_position_y = pnt.lng();
                window.userMarker.setPosition(pnt);
                window.markerPlaced = true;
            } else {
                console.log("Gra już zakończona");
            }
            if (window.markerPlaced == true) {
                document.getElementById("submit-button").disabled = false;
                document.getElementById("submit-button").style.backgroundColor = "#ff4242";
                document.getElementById("submit-button").style.color = "#fff";
                document.getElementById("submit-button").innerText = "ZATWIERDŹ";
            }
        window.userMarker.visible = true;
        window.map_pos = new google.maps.LatLng(window.map_position_x, window.map_position_y);
        window.marker_pos = new google.maps.LatLng(window.marker_position_x, window.marker_position_y);
    }
}

window.initMap = initMap;

function submitGuess() {
    isMinimapBigger = true;
    document.getElementById("upsize_button").style.display = "none";
    document.getElementById("downsize_button").style.display = "block";
    var selectedMap = sessionStorage.getItem("selectedMap");
    if (selectedMap == "poland") {
        selectedMapName = "Polska";
    } else if (selectedMap == "czestochowa") {
        selectedMapName = "Częstochowa";
    } else if (selectedMap == "trojmiasto") {
        selectedMapName = "Trójmiasto";
    } else if (selectedMap == "warsaw") {
        selectedMapName = "Warszawa";
    } else if (selectedMap == "fkl") {
        selectedMapName = "Fanatycy Klocków Lego";
    } else if (selectedMap == "ndg") {
        selectedMapName = "Nowy Dwór Gdański";
    } else if (selectedMap == "europe") {
        selectedMapName = "Europa";
    } else if (selectedMap == "custom") {
        selectedMapName = "Własna mapa";
    } else if (selectedMap == "usa") {
        selectedMapName = "USA";
    } else {
        selectedMapName = "Brak danych";
    }

    if (window.markerPlaced == false && window.endedByTime == true) {
        window.userMarker.visible = true;
        window.map_pos = new google.maps.LatLng(window.map_position_x, window.map_position_y);
        window.marker_pos = new google.maps.LatLng(0, 0);
    }

    window.gameEnded = true;
    window.line.setPath([
        window.map_pos,
        window.marker_pos,
    ]);
    window.line.setOptions({
        icons: [
            {
                icon: window.visibleLineSymbol,
                offset: "0px",
                repeat: "15px",
            },
        ],
    });
    let meters = google.maps.geometry.spherical.computeLength(window.line.getPath())
    let kilo = meters / 1000;
    let score = document.getElementById("score");
    let final_score = 5000;
    let a = 4999.55;
    let b = 0.998;
    console.log(ogMapSize);
    if (ogMapSize == "small") {
        b = 0.475;
    } else if (ogMapSize == "normal") {
        b = 0.735;
    } else if (ogMapSize == "big") {
        b = 0.981;
    } else if (ogMapSize == "huge") {
        b = 0.9987;
    }
    if (meters <= 10) {
        final_score = final_score.toFixed(0);
    } else {
        console.log(meters);
        final_score = (a*Math.pow(b, kilo)).toFixed(0);
    }
    if (final_score < 0) {
        final_score = 0;
    }
    if (isNaN(final_score) || isNaN(meters) && (window.rounds != 5)) {
        final_score = 0;
        score.style.display = "block";
        score.innerHTML = "Wystąpił błąd!<br>Skontaktuj się z administratorem!<br>Discord: kamelowy#2307";
    } else {
        if (window.rounds == 0) {
            sessionStorage.setItem("FirstScore", final_score);
            sessionStorage.setItem("FirstMapPos", window.map_pos);
            sessionStorage.setItem("FirstMarkerPos", window.marker_pos);
        } else if (window.rounds == 1) {
            sessionStorage.setItem("SecondScore", final_score);
            sessionStorage.setItem("SecondMapPos", window.map_pos);
            sessionStorage.setItem("SecondMarkerPos", window.marker_pos);
        } else if (window.rounds == 2) {
            sessionStorage.setItem("ThirdScore", final_score);
            sessionStorage.setItem("ThirdMapPos", window.map_pos);
            sessionStorage.setItem("ThirdMarkerPos", window.marker_pos);
        } else if (window.rounds == 3) {
            sessionStorage.setItem("FourthScore", final_score);
            sessionStorage.setItem("FourthMapPos", window.map_pos);
            sessionStorage.setItem("FourthMarkerPos", window.marker_pos);
        } else if (window.rounds == 4) {
            sessionStorage.setItem("FifthScore", final_score);
            sessionStorage.setItem("FifthMapPos", window.map_pos);
            sessionStorage.setItem("FifthMarkerPos", window.marker_pos);
        }
        sessionStorage.setItem("level_score", final_score);
        sessionStorage.setItem("last_map_pos", window.map_pos);
        sessionStorage.setItem("last_marker_pos", window.marker_pos);
        window.location.href = "./score.html";
    }

    sessionStorage.setItem("points", window.points += parseInt(final_score));
    sessionStorage.setItem("rounds", window.rounds += parseInt(1));
    if (window.rounds != 6) {
        let allPoints = window.points;
        document.getElementById("score-value").innerHTML = allPoints;
    }

    window.goalMarker.setPosition({ lat: window.map_position_x, lng: window.map_position_y });
    window.goalMarker.visible = true;
    document.getElementById("next-button").style.display = "block";
    document.getElementById("submit-button").style.display = "none";
}

var elem = document.documentElement;

function toggleFullScreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

var isMinimapBigger = false;
document.getElementById("upsize_button").style.display = "block";
document.getElementById("downsize_button").style.display = "none";

function resizeMinimap() {
    if (isMinimapBigger == false) {
        document.getElementById("upsize_button").style.display = "none";
        document.getElementById("downsize_button").style.display = "block";
        document.getElementById("minimap").style.width = "720px";
        document.getElementById("minimap").style.height = "480px";
        document.getElementById("submit-button").style.width = "720px";
        document.getElementById("next-button").style.width = "720px";
        isMinimapBigger = true;
    } else if (isMinimapBigger == true) {
        document.getElementById("upsize_button").style.display = "block";
        document.getElementById("downsize_button").style.display = "none";
        document.getElementById("minimap").style.width = "480px";
        document.getElementById("minimap").style.height = "360px";
        document.getElementById("submit-button").style.width = "480px";
        document.getElementById("next-button").style.width = "480px";
        isMinimapBigger = false;
    }
}   
// Minimap Resize
var minimapObject = document.getElementById("minimap");
minimapObject.addEventListener('mouseover',function(){
    minimapObject.style.opacity = "1";
    if (isMinimapBigger == false) {
    document.getElementById("submit-button").style.width = "480px";
    document.getElementById("next-button").style.width = "480px";
    minimapObject.style.width = "480px";
    minimapObject.style.height = "360px";
    } else if (isMinimapBigger == true) {
    document.getElementById("submit-button").style.width = "720px";
    document.getElementById("next-button").style.width = "720px";
    minimapObject.style.width = "720px";
    minimapObject.style.height = "480px";
    }
});
minimapObject.addEventListener('mouseleave',function(){
    minimapObject.style.opacity = "0.75";
    document.getElementById("submit-button").style.width = "380px";
    document.getElementById("next-button").style.width = "380px";
    minimapObject.style.width = "380px";
    minimapObject.style.height = "260px";
});
// Upsize Button
var upsizeButton = document.getElementById("upsize_button");
upsizeButton.addEventListener('mouseover',function(){
    minimapObject.style.opacity = "1";
    if (isMinimapBigger == false) {
    document.getElementById("submit-button").style.width = "480px";
    document.getElementById("next-button").style.width = "480px";
    minimapObject.style.width = "480px";
    minimapObject.style.height = "360px";
    } else if (isMinimapBigger == true) {
    document.getElementById("submit-button").style.width = "720px";
    document.getElementById("next-button").style.width = "720px";
    minimapObject.style.width = "720px";
    minimapObject.style.height = "480px";
    }
});
upsizeButton.addEventListener('mouseleave',function(){
    minimapObject.style.opacity = "0.75";
    document.getElementById("submit-button").style.width = "380px";
    document.getElementById("next-button").style.width = "380px";
    minimapObject.style.width = "380px";
    minimapObject.style.height = "260px";
});
// Downsize Button
var downsizeButton = document.getElementById("downsize_button");
downsizeButton.addEventListener('mouseover',function(){
    minimapObject.style.opacity = "1";
    if (isMinimapBigger == false) {
    document.getElementById("submit-button").style.width = "480px";
    document.getElementById("next-button").style.width = "480px";
    minimapObject.style.width = "480px";
    minimapObject.style.height = "360px";
    } else if (isMinimapBigger == true) {
    document.getElementById("submit-button").style.width = "720px";
    document.getElementById("next-button").style.width = "720px";
    minimapObject.style.width = "720px";
    minimapObject.style.height = "480px";
    }
});

downsizeButton.addEventListener('mouseleave',function(){
    minimapObject.style.opacity = "0.75";
    document.getElementById("submit-button").style.width = "380px";
    document.getElementById("next-button").style.width = "380px";
    minimapObject.style.width = "380px";
    minimapObject.style.height = "260px";
});

var submitButton = document.getElementById("submit-button");
submitButton.addEventListener('mouseover',function(){
    minimapObject.style.opacity = "1";
    if (isMinimapBigger == false) {
    document.getElementById("submit-button").style.width = "480px";
    document.getElementById("next-button").style.width = "480px";
    minimapObject.style.width = "480px";
    minimapObject.style.height = "360px";
    } else if (isMinimapBigger == true) {
    document.getElementById("submit-button").style.width = "720px";
    document.getElementById("next-button").style.width = "720px";
    minimapObject.style.width = "720px";
    minimapObject.style.height = "480px";
    }
});

submitButton.addEventListener('mouseleave',function(){
    minimapObject.style.opacity = "0.75";
    document.getElementById("submit-button").style.width = "380px";
    document.getElementById("next-button").style.width = "380px";
    minimapObject.style.width = "380px";
    minimapObject.style.height = "260px";
});

var nextButton = document.getElementById("next-button");
nextButton.addEventListener('mouseover',function(){
    minimapObject.style.opacity = "1";
    if (isMinimapBigger == false) {
    document.getElementById("submit-button").style.width = "480px";
    document.getElementById("next-button").style.width = "480px";
    minimapObject.style.width = "480px";
    minimapObject.style.height = "360px";
    } else if (isMinimapBigger == true) {
    document.getElementById("submit-button").style.width = "720px";
    document.getElementById("next-button").style.width = "720px";
    minimapObject.style.width = "720px";
    minimapObject.style.height = "480px";
    }
});

nextButton.addEventListener('mouseleave',function(){
    minimapObject.style.opacity = "0.75";
    document.getElementById("submit-button").style.width = "380px";
    document.getElementById("next-button").style.width = "380px";
    minimapObject.style.width = "380px";
    minimapObject.style.height = "260px";
});

async function backToStart() {
    pano.setPosition ({ lat: window.map_position_x, lng: window.map_position_y });
}

async function closeScore() {
    document.getElementById("score").style.display = "none";
}

async function centerPano(){
    document.getElementById("compass_neddle").style.transform = "rotate(0deg)";
    document.getElementById("hor-compassDiscImg").style.left = -135 +"px";
    pano.setPov().heading = 0;
}

async function roundTimer(){
    let czas = "0";
    let isTimerON = true;
    czas = sessionStorage.getItem("czas");
    switch (czas) {
    case "0":
        isTimerON = false;
        break;
    case "1":
        czas = 15;
        break;
    case "2":
        czas = 30;
        break;
    case "3":
        czas = 60;
        break;
    case "4":
        czas = 180;
        break;
    case "5":
        czas = 300;
        break;
    case "6":
        czas = 600;
        break;
    default:
        isTimerON = false;
        break;
    }

    String.prototype.toMMSS = function () {
        var sec_num = parseInt(this, 10); // don't forget the second param
        var minutes = Math.floor(sec_num / 60);
        var seconds = sec_num - (minutes * 60);
    
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes+':'+seconds;
    }

    if (isTimerON == true) {
    let timeLeft = czas;
    window.timerSeconds = timeLeft;
    window.timerMinutes = Math.floor(window.timerSeconds / 60);
    let timerValue = document.getElementById('time-value');
    let timerId = setInterval(countdown, 1000);
        document.getElementById("score-img").src = "./img/score_board_timer.svg";
        document.getElementById("time-text").style.display = "block";
        function countdown() {
            if (timeLeft == -1) {
            clearTimeout(timerId);
            window.endedByTime = true;
            submitGuess();
            } else {
            timerValue.innerHTML = String(window.timerSeconds).toMMSS();
            timeLeft--;
            window.timerSeconds = timeLeft;
            }
        }
    }
}
roundTimer();

export {};