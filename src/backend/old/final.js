let dane = document.getElementById("dane");
let przycisk = document.getElementById("button");
var avatar = "images/default-avatar.png";

window.levelScore = sessionStorage.getItem("level_score");
window.lastMapPosition = sessionStorage.getItem("last_map_pos");
window.lastMarkerPosition = sessionStorage.getItem("last_marker_pos");

window.firstMapPosition = sessionStorage.getItem("FirstMapPos");
window.firstMarkerPosition = sessionStorage.getItem("FirstMarkerPos");
window.secondMapPosition = sessionStorage.getItem("SecondMapPos");
window.secondMarkerPosition = sessionStorage.getItem("SecondMarkerPos");
window.thirdMapPosition = sessionStorage.getItem("ThirdMapPos");
window.thirdMarkerPosition = sessionStorage.getItem("ThirdMarkerPos");
window.fourthMapPosition = sessionStorage.getItem("FourthMapPos");
window.fourthMarkerPosition = sessionStorage.getItem("FourthMarkerPos");
window.fifthMapPosition = sessionStorage.getItem("FifthMapPos");
window.fifthMarkerPosition = sessionStorage.getItem("FifthMarkerPos");

let firstScore = sessionStorage.getItem("FirstScore");
let secondScore = sessionStorage.getItem("SecondScore");
let thirdScore = sessionStorage.getItem("ThirdScore");
let fourthScore = sessionStorage.getItem("FourthScore");
let fifthScore = sessionStorage.getItem("FifthScore");
let FinalScore = Number(firstScore) + Number(secondScore) + Number(thirdScore) + Number(fourthScore) + Number(fifthScore);
console.log(FinalScore);

let x = "x";
let y = "y";
let def_anchor_x = 16;
let def_anchor_y = 16;
let usr_anchor_x = 16;
let usr_anchor_y = 16;
let def_icon_path = "./img/open_pin.png"
let first_icon_path = "./img/open_first.png";
let second_icon_path = "./img/open_second.png";
let third_icon_path = "./img/open_third.png";
let fourth_icon_path = "./img/open_fourth.png";
let fifth_icon_path = "./img/open_fifth.png";
let user_icon_path = avatar;

function getMapPos(mapPosition, coord) {
    let map_pos = mapPosition.slice(1, -1).split(",");
    map_pos_x = Number(map_pos[0]);
    map_pos_y = Number(map_pos[1].replace(/\s/g, ""));
    if (coord == "x") {
        return map_pos_x;
    } else if (coord == "y") {
        return map_pos_y;
    }
}

document.getElementById("score-value").innerHTML = FinalScore;
let progress = document.getElementById("progress_bar");

let progress_percent = (FinalScore/25000)*100;

progress.style.width = progress_percent + "%";

let minimap;
function initMap() {
    minimap = new google.maps.Map(document.getElementById("minimap"), {
        center: {lat: 0.0, lng: 0.0},
        zoom: 15,
        disableDefaultUI: true,
        clickableIcons: false,
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

        function addMarker(position, icon, anchor_x, anchor_y, index) {
            var markerpos = new google.maps.LatLng(Number(getMapPos(position, x)), Number(getMapPos(position, y)));

            var ico = ({
                url: icon,
                scaledSize: new google.maps.Size(32, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(anchor_x, anchor_y),
            });

            return new google.maps.Marker({
                position: markerpos,
                map: minimap,
                icon: ico,
                zIndex: index,
            });
        }

        function addPath(mapPosition, userPosition) {
            var mapPos = new google.maps.LatLng(Number(getMapPos(mapPosition, x)), Number(getMapPos(mapPosition, y)));
            var userPos = new google.maps.LatLng(Number(getMapPos(userPosition, x)), Number(getMapPos(userPosition, y)));

            var LineSymbol = {
                path: "M 0,-1 0,1",
                strokeOpacity: 1,
                strokeWeight: 2,
                scale: 4,
            };
        
            return new google.maps.Polyline({
                path: [
                    mapPos,
                    userPos
                ],
                strokeColor: "#222222",
                strokeOpacity: 0.0,
                icons: [
                    {
                      icon: LineSymbol,
                      offset: "0px",
                      repeat: "15px",
                    },
                  ],      
                map: minimap,
                visible: true,
            });
        }
    addMarker(window.firstMapPosition, first_icon_path, def_anchor_x, def_anchor_y, 10);
    addMarker(window.firstMarkerPosition, user_icon_path, usr_anchor_x, usr_anchor_y, 0);
    var firstLine = addPath(window.firstMapPosition, window.firstMarkerPosition);
    addMarker(window.secondMapPosition, second_icon_path, def_anchor_x, def_anchor_y, 10);
    addMarker(window.secondMarkerPosition, user_icon_path, usr_anchor_x, usr_anchor_y);
    var secondLine = addPath(window.secondMapPosition, window.secondMarkerPosition);
    addMarker(window.thirdMapPosition, third_icon_path, def_anchor_x, def_anchor_y, 10);
    addMarker(window.thirdMarkerPosition, user_icon_path, usr_anchor_x, usr_anchor_y, 0);
    var thirdLine = addPath(window.thirdMapPosition, window.thirdMarkerPosition);
    addMarker(window.fourthMapPosition, fourth_icon_path, def_anchor_x, def_anchor_y, 10);
    addMarker(window.fourthMarkerPosition, user_icon_path, usr_anchor_x, usr_anchor_y, 0);
    var fourthLine = addPath(window.fourthMapPosition, window.fourthMarkerPosition);
    addMarker(window.fifthMapPosition, fifth_icon_path, def_anchor_x, def_anchor_y, 10);
    addMarker(window.fifthMarkerPosition, user_icon_path, usr_anchor_x, usr_anchor_y, 0);
    var fifthLine = addPath(window.fifthMapPosition, window.fifthMarkerPosition);

    let lineBounds = new google.maps.LatLngBounds();
    lineBounds.extend(firstLine.getPath().getAt(0));
    lineBounds.extend(firstLine.getPath().getAt(1));
    lineBounds.extend(secondLine.getPath().getAt(0));
    lineBounds.extend(secondLine.getPath().getAt(1));
    lineBounds.extend(thirdLine.getPath().getAt(0));
    lineBounds.extend(thirdLine.getPath().getAt(1));
    lineBounds.extend(fourthLine.getPath().getAt(0));
    lineBounds.extend(fourthLine.getPath().getAt(1));
    lineBounds.extend(fifthLine.getPath().getAt(0));
    lineBounds.extend(fifthLine.getPath().getAt(1));
    minimap.fitBounds(lineBounds);

    let lineCenter = lineBounds.getCenter();
    minimap.center = lineCenter;
}
