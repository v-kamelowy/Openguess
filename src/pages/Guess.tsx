import './Guess.css';
import DefaultAvatar from '../auth/images/default-avatar.png';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import axios from 'axios';
import TWEEN from '@tweenjs/tween.js';
import { Timer, Time, TimerOptions } from 'timer-node';
import { FiLayers, FiCompass, FiHome, FiMapPin } from "react-icons/fi";
import useLocalStorage from '../hooks/useLocalStorage';
import * as AES from "crypto-js/aes";
import { enc } from 'crypto-js';

import MaximizeIcon from './svgs/MaximizeIcon.svg';
import MinimizeIcon from './svgs/MinimizeIcon.svg';
import CompassNeddle from './svgs/CompassNeddle.svg';

import UIButton from '../components/OGUIButton';

const ApiDomain: string = 'https://api.openguess.pl';

let selectedMapKey: string;
let selectedGameSettings: string;
let SELECTED_MAP: string = `${ApiDomain}/api/v1/openguess?apiKey=${process.env.REACT_APP_OPENGUESS_API_KEY}&mapId=''`;

const STARTING_POSITION = {
    lat: 0,
    lng: 0,
}

let minimap: google.maps.Map;
let pano: google.maps.StreetViewPanorama;
let player_marker: google.maps.Marker;
let polyline: google.maps.Polyline;

let loadType: string;
let map_data: google.maps.MVCArray<google.maps.LatLng>;

let openg_map_location: google.maps.LatLng;
let openg_marker_location: google.maps.LatLng;

let panoramaOptions: google.maps.StreetViewPanoramaOptions;
panoramaOptions = {
    pov: {
        heading: 0,
        pitch: 0
    },
    disableDefaultUI: true,
    showRoadLabels: false,
    linksControl: true,
    zoom: -1,
}

const MINI_MAP_ID = 'map';
let MINI_MAP_ZOOM = 2;
let MINI_MAP_LAT = 0;
let MINI_MAP_LNG = 0;
const STREET_VIEW_PANORAMA_ID = 'pano';
const STREET_VIEW_PANORAMA_ZOOM = 0;
const PLAYER_MARKER_ID = 'player_marker';
const POLY_LINE_ID = 'polyline';

let place = {lat: 0, lng: 0};

let openg_map_type = "normal";

export default function Guess() {
    function LoadingScreen() {
        useEffect(() => {
            document.title = 'Openguess - Loading';
        }, []);
        return (
            <div className='Openguess--LoadingScreen'>
                <div className='Openguess--LoadingScreen--Text'>Loading...</div>
            </div>
        );
    }
    const render = (status: any) => {
        switch (status) {
          case Status.LOADING:
            return <div><LoadingScreen /></div>
          case Status.FAILURE:
            return <div>Error</div>
          case Status.SUCCESS:
            return <GoogleMapsWrapper />
        }
    };

    const MAP_LANGUAGE = 'pl';
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    return(
        <div className='Openguess'>
            <Wrapper apiKey={API_KEY} language={MAP_LANGUAGE} libraries={['geometry']} render={render}>
            </Wrapper>
        </div>
    )
}

function GoogleMapsWrapper() {
    const { currentMap, setCurrentMap, currentRound, setCurrentRound, currentScore, setCurrentScore, maps, setMaps, scores, setScores, currentPlayerLocation, setCurrentPlayerLocation, playerLocations, setPlayerLocations } = useGame();
    const [ timestamp, setTimestamp ] = useLocalStorage('timestamp', null);
    const [ roundEnded, setRoundEnded ] = useState(false);
    const [ streetViewLoaded, setStreetViewLoaded ] = useState(false);
    const { session } = useAuth();
    
    useEffect(() => {
        function toMMSS(miliseconds: number) {
            //@ts-ignore
            var sec_num = parseInt(miliseconds/1000, 10); // don't forget the second param
            var minutes = Math.floor(sec_num / 60);
            var seconds = sec_num - (minutes * 60);
            //@ts-ignore
            if (minutes < 10) {minutes = "0"+minutes;}
            //@ts-ignore
            if (seconds < 10) {seconds = "0"+seconds;}
            return minutes+':'+seconds;
        }
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let settings = urlParams.get('settings');
        selectedGameSettings = encodeURIComponent(settings);
        settings = decodeURIComponent(settings);
        let gameSettingsString = AES.decrypt(settings, 'openguessisgreat').toString(enc.Utf8);
        let gameSettings = JSON.parse(gameSettingsString);
        const { TimeLimit } = gameSettings;
        console.log(TimeLimit);
        document.title = 'Openguess - Game';
        if (TimeLimit === 0) {
            document.getElementById('timer-value')!.innerText = "--:--";
        } else if (TimeLimit > 0) {
            let timerTime = Date.now();
            if (timestamp === null) {
                setTimestamp(timerTime);
            } else {
                timerTime = timestamp;
            }
            let timer = new Timer({
                label: 'openguess-timer',
                startTimestamp: timerTime,
            })
            timer.start();

            let time = TimeLimit;
            let fullTime = time;
            if (time !== 0) {
                setInterval(countdown, 1000);
                async function countdown() {
                    fullTime = time - timer.ms();
                    document.getElementById('timer-value')!.innerText = toMMSS(fullTime);
                    if (fullTime <= 500) {
                        console.log("Round ended");
                        if (openg_marker_location === undefined) {
                            let loseCoords = new google.maps.LatLng(0, 0);
                            displayCoordinates(loseCoords);
                        }
                        getScore();
                    }
                }
            }
        }
    }, []);

    let score_sum = scores.reduce((partialSum: any, a: any) => partialSum + a, 0);
    
    useEffect(() => {
        if (currentRound >= 5) {
            setCurrentMap('');
            setCurrentPlayerLocation('');
            setCurrentRound(0);
            setCurrentScore(0);
            setMaps([]);
            setScores([]);
            setPlayerLocations([]);
            setTimestamp(null);
        }
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const game = urlParams.get('game');
        selectedMapKey = game;
        SELECTED_MAP = `${ApiDomain}/api/v1/openguess?apiKey=${process.env.REACT_APP_OPENGUESS_API_KEY}&mapId=${selectedMapKey}`;
    }, []);

    useEffect(() => {
        if (roundEnded) {
            setTimestamp(null);
            setCurrentRound(parseInt(currentRound) + 1);
        }
    }, [roundEnded]);

    useEffect(() => {
        async function getMapData() {
            await axios.get(SELECTED_MAP)
            .then(res => {
                console.log('%cGetting map data from ' + SELECTED_MAP, 'color: cyan');
                console.log(`%c[${res.status}] Got data from Openguess API`, 'color: pink');
                console.log(res)
                let random = Math.floor(Math.random() * res.data.map_structure.length);
                map_data = res.data.map_structure[random];
                MINI_MAP_LAT = res.data.settings.minimap_initial_point.lat;
                MINI_MAP_LNG = res.data.settings.minimap_initial_point.lng;
                MINI_MAP_ZOOM = res.data.settings.minimap_initial_zoom;
                minimap.setCenter({lat: MINI_MAP_LAT, lng: MINI_MAP_LNG});
                minimap.setZoom(MINI_MAP_ZOOM);
                //let map_loc = new google.maps.LatLng(map_location.lat, map_location.lng);
                getStreetView(map_data);
            }).catch(err => {
                console.log(err);
                //document.location.href = '/';
            });
        }
        getMapData();
    }, []);

    function GuessUI() {
        return (
            <>
                <div className='Openguess--GuessUI--ScoreBoard'><h5>Current score:</h5> {score_sum} <a>/</a> 25000</div>
                <div className='Openguess--GuessUI--Rounds'><a>Round </a> {currentRound+1} <a>out of</a> 5</div>
                <div className='Openguess--GuessUI--Timer--Wrapper'>
                    <div className='Openguess--GuessUI--Timer'>
                        <div className='Openguess--GuessUI--Timer--Values'>
                            <h5>Time left:</h5> <div id="timer-value">--:--</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function minimapResize() {
        document.getElementById(MINI_MAP_ID).classList.toggle('Openguess--MiniMap--Bigger');
        document.getElementsByClassName("Openguess--MiniMap--Submit")[0].classList.toggle('Openguess--MiniMap--Submit--Bigger');
    }

    async function getReverseGeocode() {
        let res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${openg_map_location.lat()}&lon=${openg_map_location.lng()}&format=json&accept-language=en-us&zoom=3&email=kamelowy.kontakt@gmail.com`);
        console.log('%cCountry: %c' + res.data.address.country, "color: #ff5252", "color: #aaa");
        console.log('%cCountry code: %c' + (res.data.address.country_code).toUpperCase(), "color: #ff5252", "color: #aaa");
    }
    
    function nextMap() {
        setRoundEnded(true);
        if (currentRound < 4) {
            document.location.href = ('./score?game=' + selectedMapKey + '&settings=' + selectedGameSettings);
        } else {
            document.location.href = ('./final?game=' + selectedMapKey + '&settings=' + selectedGameSettings);
        }
    }
    
    function getScore() {
        if (openg_marker_location !== undefined || null) {
            polyline.setPath([openg_map_location, openg_marker_location]);
            let distance = google.maps.geometry.spherical.computeDistanceBetween(openg_map_location, openg_marker_location);
            let final_score = 5000;
            let a = 4999.55;
            let b = 0.998;
            console.log("%cCurrent map size: %c" + openg_map_type, "color: #00ff00;", "color: #aaa;");
            if (openg_map_type == "small") {
                b = 0.775;
            } else if (openg_map_type == "normal") {
                b = 0.835;
            } else if (openg_map_type == "big") {
                b = 0.981;
            } else if (openg_map_type == "huge") {
                b = 0.9987;
            }
    
            let meters = Number(distance.toFixed(0));
            let kilometers = meters / 1000;
    
            if (meters <= 25) {
                final_score = Number(final_score.toFixed(0));
            } else {
                final_score = Number((a*Math.pow(b, kilometers)).toFixed(0));
            }
            if (final_score < 0) {
                final_score = 0;
            }
            
            let add_score = JSON.parse(localStorage.getItem('scores'));
            let add_map = JSON.parse(localStorage.getItem('maps'));
            let add_player_location = JSON.parse(localStorage.getItem('playerLocations'));
            console.log(add_score);
            console.log(add_map)
            console.log(add_player_location)
            add_score.push(final_score);
            add_map.push(openg_map_location);
            add_player_location.push(openg_marker_location);
            setScores(add_score);
            setMaps(add_map);
            setPlayerLocations(add_player_location);
            setCurrentPlayerLocation(openg_marker_location);
            setCurrentScore(final_score);
            console.log("%cMeters from destination: %c" + meters, "color: #0066ff;", "color: #aaa;");
            
            console.log("%cScore: %c" + final_score, "color: #ff5252;", "color: #fff;");
            nextMap();
        } else {
            console.log("%cPlayer marker is not on the map", "color: #ff5252;");
        }
    }
    
    function UserTab() {
        if (session) {
            let player_avatar = session.user.user_metadata.avatar_url;
            return (
                <div className='Openguess--UserTab'>
                    <div className='Openguess--UserTab--Container'>
                        <div className='Openguess--UserTab--Nickname'>
                            {session.user.user_metadata.name}
                        </div>
                        <div className='Openguess--UserTab--VertLine'>&nbsp;</div>
                        <img className='Openguess--UserTab--Avatar' src={player_avatar}/>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='Openguess--UserTab'>
                    <div className='Openguess--UserTab--Container'>
                        <div className='Openguess--UserTab--Nickname'>
                            Guest
                        </div>
                        <div className='Openguess--UserTab--VertLine'>&nbsp;</div>
                        <img className='Openguess--UserTab--Avatar' src={DefaultAvatar}/>
                    </div>
                </div>
            )
        }
    }
    
    function Line({
        path,
        }: {
        path: google.maps.LatLngLiteral[];
        }) {
            useEffect(() => {
                polyline = new window.google.maps.Polyline({
                    path,
                    geodesic: false,
                });
            },[]);
            
        return <div id={POLY_LINE_ID} className={`Openguess--Polyline`}></div>
    }
    
    function Compass() {
        useEffect(() => {
            google.maps.event.addListener(pano, 'pov_changed', function() {
                var heading_degrees = pano.getPov().heading.toFixed(1);
                document.getElementById("Openguess--Compass--Neddle").style.transform = "rotate(" + -heading_degrees + "deg)";
            });
        }, []);
        return (
            <a onClick={() => centerCompass()} className='Openguess--Compass'><img src={CompassNeddle} id="Openguess--Compass--Neddle"/></a>
        )
    }

    async function toggleMapLayer() {
        if (minimap.getMapTypeId() == 'satellite') {
            minimap.setOptions({ mapTypeId: google.maps.MapTypeId.ROADMAP });
        } else {
            minimap.setOptions({ mapTypeId: google.maps.MapTypeId.SATELLITE });
        }
    }

    async function backToStart() {
        pano.setPosition(openg_map_location);
    }

    async function centerCompass() {
        function animate(time: number) {
            requestAnimationFrame(animate)
            TWEEN.update(time)
        }
        requestAnimationFrame(animate)
        let currentCoords = {x: pano.getPov().heading, y: pano.getPov().pitch};
        let coords = currentCoords;
        let destinationCoords = { x: 0, y: 0}
        if (currentCoords.x >= 180) {
            destinationCoords.x = 360;
        } else {
            destinationCoords.x = 0;
        }
        const tween = new TWEEN.Tween(coords)
            .to( destinationCoords, 250)
            .easing(TWEEN.Easing.Quartic.Out)
            .onUpdate(() => {
                pano.setPov({heading: Number(coords.x.toFixed(5)), pitch: Number(coords.y.toFixed(5))});
            })
            .start()
        document.getElementById("Openguess--Compass--Neddle").style.transform = "rotate(0deg)";
    }
    
    function PlayerMarker() {
        let player_avatar = DefaultAvatar;
        if (session) {
            player_avatar = session.user.user_metadata.avatar_url;
        }
    
        const PlayerMarkerRef = useRef();
        useEffect(() => {
            let overlay = new google.maps.OverlayView();
            overlay.draw = function () { 
                this.getPanes().markerLayer.id='player_marker'; 
            };
    
            overlay.setMap(minimap);
    
            player_marker = new google.maps.Marker({
                position: STARTING_POSITION,
                map: minimap,
                zIndex: 100,
                icon: {
                    url: player_avatar,
                    scaledSize: new google.maps.Size(36, 36),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(18, 18),
                },
                title: "Chosen location",
                visible: false,
            });
        }, []);
    
        return <div ref={PlayerMarkerRef} id={PLAYER_MARKER_ID} className='Openguess--PlayerMarker' />
    }
    
    function Minimap({
        center,
        zoom,
      }: {
        center: google.maps.LatLngLiteral;
        zoom: number;
      }) {
        const MinimapRef = useRef();
     
        useEffect(() => {
            minimap = new window.google.maps.Map(MinimapRef.current, {
                center,
                zoom,
                disableDefaultUI: true,
                clickableIcons: false,
                disableDoubleClickZoom: true,
            },);
            function ResizeButton() {
                let RESIZE_BUTTON = document.createElement('div');
                let RESIZE_ICON = document.createElement('div');
                let RESIZE_STATE = false;
                RESIZE_ICON.className = 'Openguess--MiniMap--ResizeIcon';
                RESIZE_ICON.innerHTML = `<img src=${MaximizeIcon} alt='Maximize' />`;
                RESIZE_BUTTON.classList.add('Openguess--MiniMap--ResizeButton');
                RESIZE_BUTTON.appendChild(RESIZE_ICON);
                RESIZE_BUTTON.addEventListener('click', () => {
                    minimapResize();
                    RESIZE_STATE = !RESIZE_STATE;
                    if (!RESIZE_STATE) {
                        RESIZE_ICON.innerHTML = `<img src=${MaximizeIcon} alt='Maximize' />`;
                    } else {
                        RESIZE_ICON.innerHTML = `<img src=${MinimizeIcon} alt='Minimize' />`;
                    }
                }
            );
            minimap.controls[google.maps.ControlPosition.TOP_LEFT].push(RESIZE_BUTTON);
            }
            function DisplayPlayerMarker() {
                google.maps.event.addListener(minimap, 'click', function (event) {
                    displayCoordinates(event.latLng);
                });
            }
            ResizeButton();
            DisplayPlayerMarker();
        }, []);
        
        return <div className='Openguess--MiniMap--Wrapper'><div ref={MinimapRef} id={MINI_MAP_ID} className={`Openguess--MiniMap`}></div></div>
    }

    function displayCoordinates(pnt: google.maps.LatLng) {
        player_marker.setPosition(pnt);
        player_marker.setVisible(true);
        openg_marker_location = player_marker.getPosition();
        console.log("%cPlayer: %c" + openg_marker_location, "color: #00ff00", "color: #fff");
        console.log("%cDestination: %c" + openg_map_location, "color: #00ffff", "color: #fff");
        document.getElementsByClassName('Openguess--MiniMap--Submit')[0].innerHTML = "Submit";
        document.getElementsByClassName('Openguess--MiniMap--Submit')[0].classList.remove('Openguess--MiniMap--Submit--Disabled');
    }
    
    function StreetViewPanorama() {
        const StreetViewRef = useRef();
        useEffect(() => {
            pano = new window.google.maps.StreetViewPanorama(StreetViewRef.current, panoramaOptions);
            console.log("pano loaded")
        }, []);
        
        return <div ref={StreetViewRef} id={STREET_VIEW_PANORAMA_ID} className='Openguess--StreetView' />
    }

    async function getLoadType() {
        if (window.performance) {
            const entries = performance.getEntriesByType("navigation");
            // @ts-ignore
            const entry = entries.map( nav => nav.type )
            loadType = entry[0];
        }
    };

    async function getStreetView(map_data_array: google.maps.MVCArray<any>) {
        getLoadType();

        let indexOfCurrentMap = (currentRound - 1);
        let enemyOfCurrentMap = 'never';
        let objectOfCurrentMap = 'true';

        if (currentRound > 0) {
            enemyOfCurrentMap = maps[indexOfCurrentMap].lat
            objectOfCurrentMap = JSON.parse(currentMap).lat;
        }

        if (loadType === 'reload' && currentMap !== '' && enemyOfCurrentMap !== objectOfCurrentMap) {
            console.log("%cReloading street view", "color: #ff5252;");
            const saved_data = JSON.parse(currentMap);
            place.lat = saved_data.lat;
            place.lng = saved_data.lng;
            console.log(place);
            pano.setPosition({lat: saved_data.lat, lng: saved_data.lng});
            openg_map_location = new google.maps.LatLng(saved_data.lat, saved_data.lng);
        } else {
            const mapPolygon = new google.maps.Polygon({
                paths: map_data_array,
                /*
                strokeColor: "#222222",
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: "#ffffff",
                fillOpacity: 0.35,
                */
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
            for (var obama = 0; obama < 100; obama++) {
                var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
                var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
                var point = new google.maps.LatLng(ptLat,ptLng);
                
                if (google.maps.geometry.poly.containsLocation(point, mapPolygon)) {
                    const StreetViewService = new google.maps.StreetViewService();
                    console.log("%cGetting street view", "color: #0066ff;");
                    await StreetViewService.getPanorama({
                        location: point,
                        preference: google.maps.StreetViewPreference.NEAREST,
                        radius: 5000,
                        source: window.google.maps.StreetViewSource.OUTDOOR,
                    }, getPlace);
                break;
                }
            }
        }
    }
    
    async function getPlace(data: any, status: string) {
        async function checkStreetView() {
            switch (status) {
                case google.maps.StreetViewStatus.OK:
                    console.log("Found street view panorama for this location.");
                    panoramaOptions = {
                        position: data.location.latLng,
                        pov: {
                            heading: 0,
                            pitch: 0
                            },
                        zoom: -1,
                        disableDefaultUI: true,
                        showRoadLabels: false,
                        linksControl: true,
                    };
                    setStreetViewLoaded(true);
                    place.lat = data.location.latLng.lat();
                    place.lng = data.location.latLng.lng();
                    console.log(place);
                    openg_map_location = new google.maps.LatLng(place.lat, place.lng);
                    await setCurrentMap(JSON.stringify(data.location.latLng));
                    console.log("%cSaved street view", "color: #00ff00;");
                    break;
                case google.maps.StreetViewStatus.ZERO_RESULTS:
                    console.error("Sorry, this location has no street view.");
                    getStreetView(map_data);
                    break;
                case google.maps.StreetViewStatus.UNKNOWN_ERROR:
                    console.error("Sorry, there was an unknown error.");
                    break;
            }
        }
        if (!streetViewLoaded) {
            checkStreetView();
        }
    }

    return (
        <div>
            <Minimap center={{lat: MINI_MAP_LAT, lng: MINI_MAP_LNG}} zoom={MINI_MAP_ZOOM} />
            <StreetViewPanorama />
            <PlayerMarker />
            <Line path={[STARTING_POSITION, STARTING_POSITION]} />
            <Compass />
            <UserTab />
            <GuessUI />
            <div className='Openguess--UI--ButtonList'>
                <UIButton onClicked={() => backToStart()} icon={ <FiMapPin /> }/>
                <UIButton onClicked={() => toggleMapLayer()} icon={ <FiLayers /> }/>
                <UIButton onClicked={() => centerCompass()} icon={ <FiCompass /> }/>
                <UIButton onClicked={() => document.location.href = "/"} icon={ <FiHome /> }/>
            </div>
            <button id="submit_btn" className="Openguess--MiniMap--Submit Openguess--MiniMap--Submit--Disabled" onClick={() => {getScore()}}>Choose location</button>
            {/*<button className="Debug--GetReverse" onClick={() => {getReverseGeocode()}}>Get Reverse</button>*/}
        </div>
    )
}