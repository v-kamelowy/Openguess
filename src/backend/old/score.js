let dane = document.getElementById("dane");
let przycisk = document.getElementById("button");
var avatar = "images/default-avatar.png";

window.levelScore = sessionStorage.getItem("level_score");
window.lastMapPosition = sessionStorage.getItem("last_map_pos");
window.lastMarkerPosition = sessionStorage.getItem("last_marker_pos");
let map_pos = lastMapPosition.slice(1, -1).split(",");
console.log(map_pos);
window.map_pos_x = Number(map_pos[0]);
window.map_pos_y = Number(map_pos[1].replace(/\s/g, ""));

let marker_pos = lastMarkerPosition.slice(1, -1).split(",");
console.log(marker_pos);
window.marker_pos_x = Number(marker_pos[0]);
window.marker_pos_y = Number(marker_pos[1].replace(/\s/g, ""));


document.getElementById("score-value").innerHTML = window.levelScore;
document.getElementById("round-value").innerHTML = window.rounds;
let progress = document.getElementById("progress_bar");

let progress_percent = (window.levelScore/5000)*100;

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
    
    window.userMarker = new google.maps.Marker({
        position: {lat: Number(window.marker_pos_x), lng: Number(window.marker_pos_y)},
        map: minimap,
        zIndex: 100,
        icon: {
            url: avatar,
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(16, 16),
        },
        title: "Wybrane miejsce",
        visible: true,
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
        position: {lat: Number(window.map_pos_x), lng: Number(window.map_pos_y)},
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
        visible: true,
        });

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


    window.lineMapPos = new google.maps.LatLng(Number(window.map_pos_x), Number(window.map_pos_y));
    window.lineMarkerPos = new google.maps.LatLng(Number(window.marker_pos_x), Number(window.marker_pos_y));
    window.line.setPath([
        window.lineMapPos,
        window.lineMarkerPos,
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
    let lineBounds = new google.maps.LatLngBounds();
    lineBounds.extend(window.lineMapPos);
    lineBounds.extend(window.lineMarkerPos);
    let lineCenter = lineBounds.getCenter();
    minimap.center = lineCenter;
    
    let meters = google.maps.geometry.spherical.computeLength(window.line.getPath())
    console.log(meters);
    let metersDiv = document.getElementById("meters");
    if (meters < 1000) {
        metersDiv.innerHTML = meters.toFixed(0) + "m od miejsca docelowego";
    } else {
        metersDiv.innerHTML = (meters/1000).toFixed(0) + "km od miejsca docelowego";
    }

    minimap.fitBounds(lineBounds);
}