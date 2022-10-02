document.getElementById('save-button').disabled = true;

function initMap() {
    mapUploadArray = new google.maps.MVCArray();
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: -40.6892,
        lng: 74.0445,
    },
    zoom: 8,
    disableDefaultUI: true,
    clickableIcons: false,
    zoom: 4,
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

    var polyOptions = {
    strokeWeight: 0,
    fillOpacity: 0.45,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    };

    var jQueryScript = document.createElement('script');
    jQueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js');
    document.head.appendChild(jQueryScript);

    // loads databased saved coordinates
    var propertyCoords = '';
    if (sessionStorage.getItem("mapData") != null) {
        var mapData = sessionStorage.getItem("mapData");
        if (mapData != null && mapData.match(/^\d/)) {
            var dataArray = mapData.split(",");
            console.log(dataArray);
            var finalDataArray = [];

            dataArray.forEach(element => {
                var splitted = element.split(":");
                finalDataArray.push(splitted);
            });
            console.log(finalDataArray);

            var latlngArray = new google.maps.MVCArray();
            finalDataArray.forEach(element => {
                latlngArray.push(new google.maps.LatLng(parseFloat(element[0]),parseFloat(element[1])));
            });
            console.log(latlngArray);
            var points = latlngArray;
        }
    } else {
        var points = [
            {lat: 52.73, lng: 15.237},
            {lat: 52.4, lng: 16.919},
            {lat: 51.943, lng: 15.504},
        ];
    }
    var existingPolygon = null;

    var drawingManager = null;

    if (typeof points !== 'undefined') {
    if (!google.maps.Polygon.prototype.getBounds) {
        google.maps.Polygon.prototype.getBounds = function () {
        var bounds = new google.maps.LatLngBounds();
        this.getPath().forEach(function (element, _) {
            bounds.extend(element);
        });
        return bounds;
        };
    }

    /**
     * used for tracking polygon bounds changes within the drawing manager
     */
    google.maps.Polygon.prototype.enableCoordinatesChangedEvent =
        function () {
        var me = this,
            isBeingDragged = false,
            triggerCoordinatesChanged = function () {
            //broadcast normalized event
            google.maps.event.trigger(me, 'coordinates_changed');
            };

        //if  the overlay is being dragged, set_at gets called repeatedly, so either we can debounce that or igore while dragging, ignoring is more efficient
        google.maps.event.addListener(me, 'dragstart', function () {
            isBeingDragged = true;
        });

        //if the overlay is dragged
        google.maps.event.addListener(me, 'dragend', function () {
            triggerCoordinatesChanged();
            isBeingDragged = false;
        });

        //or vertices are added to any of the possible paths, or deleted
        var paths = me.getPaths();
        paths.forEach(function (path, i) {
            google.maps.event.addListener(path, 'insert_at', function () {
            triggerCoordinatesChanged();
            });
            google.maps.event.addListener(path, 'set_at', function () {
            if (!isBeingDragged) {
                triggerCoordinatesChanged();
            }
            });
            google.maps.event.addListener(path, 'remove_at', function () {
            triggerCoordinatesChanged();
            });
        });
        };

    function extractPolygonPoints(data) {
        var MVCarray = data.getPath().getArray();

        var to_return = MVCarray.map(function (point) {
        return `${point.lat().toFixed(3)}:${point.lng().toFixed(3)}`;
        });
        // first and last must be same
        return to_return.concat(to_return[0]).join(',');
    }

    
    existingPolygon = new google.maps.Polygon({
        paths: points,
        editable: true,
        draggable: false,
        map: map,
        ...polyOptions,
    });
    map.fitBounds(existingPolygon.getBounds());

    existingPolygon.enableCoordinatesChangedEvent();

    google.maps.event.addListener(
        existingPolygon,
        'coordinates_changed',
        function () {
        window.polygonBounds = extractPolygonPoints(existingPolygon);
        document.getElementById('save-button').disabled = false;
        document.getElementById('save-button').classList.add('opacity-100');
        document.getElementById('save-button').classList.remove('opacity-50');
        }
    );
    // My guess is to use a conditional statement to check if the map has any coordinates saved?
    } else {
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon'],
        },
        polylineOptions: {
        editable: true,
        draggable: false,
        },
        rectangleOptions: polyOptions,
        circleOptions: polyOptions,
        polygonOptions: polyOptions,
        map: map,
    });

    google.maps.event.addListener(
        drawingManager,
        'overlaycomplete',
        function (e) {
        if (e.type !== google.maps.drawing.OverlayType.MARKER) {
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);
            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
            var newShape = e.overlay;
            newShape.type = e.type;
            google.maps.event.addListener(newShape, 'click', function (e) {
            if (e.vertex !== undefined) {
                if (
                newShape.type === google.maps.drawing.OverlayType.POLYGON
                ) {
                var path = newShape.getPaths().getAt(e.path);
                path.removeAt(e.vertex);
                if (path.length < 3) {
                    newShape.setMap(null);
                }
                }
            }
            setSelection(newShape);
            });
        }
        var coords = e.overlay.getPath().getArray();
        document.getElementById('propertyCoordinates').value = coords;
        }
    );
    }
}

function saveMap() {
        var filename = Date.now();
        let csvContent = 'data:text/csv;charset=utf-8,';
        var bounds = window.polygonBounds;
        var encBounds = CryptoJS.AES.encrypt(bounds, "954xtftmZjBCdgTPgFPFy5efJCfvdrbGkc4fjrQmgjBzuFjXs29TbRWrxr3v").toString();
        csvContent += encBounds;
        if (window.polygonBounds = undefined || window.polygonBounds == '' || window.polygonBounds == null || csvContent == "false") {
            alert("Wystąpił błąd podczas generowania mapy!");
        } else {
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `openguessr-map-${filename}.ogmap`);
        document.body.appendChild(link); // Required for FF
        link.click(); // This will download the data file named "my_data.csv".
    }
}

window.handleFileSelect = function(evt) {
    let files = evt.target.files; // FileList object

    // use the 1st file from the list
    let f = files[0];
    
    let reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
        //document.getElementById("mapdata-text").innerHTML = e.target.result;
        let decrypted = CryptoJS.AES.decrypt(e.target.result, "954xtftmZjBCdgTPgFPFy5efJCfvdrbGkc4fjrQmgjBzuFjXs29TbRWrxr3v").toString(CryptoJS.enc.Utf8);
        sessionStorage.setItem("mapData", decrypted);
        };
    })(f);
    // Read in the image file as a data URL.
    var readerData = reader.readAsText(f);
    console.log(files);
    location.reload();
}

document.getElementById('upload').addEventListener('change', window.handleFileSelect, false);