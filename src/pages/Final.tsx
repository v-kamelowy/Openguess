import React, { useEffect, useRef } from 'react'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import DefaultAvatar from '../auth/images/default-avatar.png';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import Navbar from '../components/Navbar';
import './Final.css';
import OpenPin from './images/open_pin.png';
import { Progress } from '@mantine/core';

import MapPinFirst from './images/open_first.png';
import MapPinSecond from './images/open_second.png';
import MapPinThird from './images/open_third.png';
import MapPinFourth from './images/open_fourth.png';
import MapPinFifth from './images/open_fifth.png';

let map: google.maps.Map;
let userMarker: google.maps.Marker;
let goalMarker: google.maps.Marker;

let selectedMapKey: string;
let selectedGameSettings: string;

export default function Final() {
    const render = (status: any) => {
        switch (status) {
          case Status.LOADING:
            return <div>Loading...</div>
          case Status.FAILURE:
            return <div>Error</div>
          case Status.SUCCESS:
            return <GoogleMapsWrapper />
        }
    };

    const MAP_LANGUAGE = 'pl';
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    return (
        <div className='Openguess'>
            <Wrapper apiKey={API_KEY} language={MAP_LANGUAGE} libraries={['geometry']} render={render}>
            </Wrapper>
        </div>
    )
}

function GoogleMapsWrapper() {
    const { currentMap, setCurrentMap, currentRound, setCurrentRound, currentScore, setCurrentScore, maps, setMaps, scores, setScores, currentPlayerLocation, setCurrentPlayerLocation, playerLocations, setPlayerLocations } = useGame();
    const navigate = useNavigate();
    const { session } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            if (parseInt(currentRound) === 0) {
                document.location.href = '/';
            }
        }, 1000);
    }, []);

    useEffect(() => {
        InitScore();
    } , [map]);

    const PLAYER_LOCATION = JSON.parse(localStorage.getItem('currentPlayerLocation'))
    const MAP_LOCATION = JSON.parse(JSON.parse(localStorage.getItem('currentMap')))
    const SCORE = JSON.parse(localStorage.getItem('currentScore'))
    let SCORE_PERCENTAGE = (SCORE/5000)*100
    console.log(MAP_LOCATION);
    const maps_array = JSON.parse(localStorage.getItem('maps'));
    const player_locations_array = JSON.parse(localStorage.getItem('playerLocations'));
    console.log('%c maps_array', 'color: #6fa; font-weight: bold;', maps_array);
    console.log('%c player_locations_array', 'color: #f6a; font-weight: bold;', player_locations_array);
    /*
    maps_array.forEach((map: { lat: any; lng: any; }, index: any) => {
        let roundNumber = index + 1;
        console.log("Round " + roundNumber + " - lat: " + map.lat);
        console.log("Round " + roundNumber + " - lng: " + map.lng);
    });
    */

    function Map({
        center,
        zoom,
      }: {
        center: google.maps.LatLngLiteral;
        zoom: number;
      }) {
        const MapRef = useRef();

        useEffect(() => {
            map = new google.maps.Map(MapRef.current, {
                center,
                zoom,
                disableDefaultUI: true,
                clickableIcons: false,
                disableDoubleClickZoom: true,
            });
        }, []);
        
        return <div className='Final--ScoreMap--Map--Wrapper'><div ref={MapRef} id={'ScoreMap'} className={`Final--ScoreMap--Map`}>&nbsp;</div></div>
    }

    function InitScore() {
        localStorage.setItem('timestamp', null);
        let player_avatar = DefaultAvatar
        if (session) {
            player_avatar = session.user.user_metadata.avatar_url;
        }

        document.title = 'Openguess - Final Score';
        let mapLocations = maps;
        let markerLocations = playerLocations;

        function addMarker(position: google.maps.LatLng, icon: any, size: any, anchor: any, index:any) {
            var markerpos = new google.maps.LatLng(Number(position.lat), Number(position.lng));

            var ico = ({
                url: icon,
                scaledSize: new google.maps.Size(size, size),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(anchor, anchor),
            });

            return new google.maps.Marker({
                position: markerpos,
                map: map,
                icon: ico,
                zIndex: index,
            });
        }

        function addPath(mapPosition: google.maps.LatLng, userPosition: google.maps.LatLng) {
            var mapPos = new google.maps.LatLng(Number(mapPosition.lat), Number(mapPosition.lng));
            var userPos = new google.maps.LatLng(Number(userPosition.lat), Number(userPosition.lng));

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
                strokeColor: "#000",
                strokeOpacity: 0.25,
                strokeWeight: 4,
                /*
                icons: [
                    {
                      icon: LineSymbol,
                      offset: "0px",
                      repeat: "15px",
                    },
                  ],
                  */
                map: map,
                visible: true,
            });
        }

        let firstMapLoc = mapLocations[0]
        let firstMarkerLoc = markerLocations[0]
        let secondMapLoc = mapLocations[1]
        let secondMarkerLoc = markerLocations[1]
        let thirdMapLoc = mapLocations[2]
        let thirdMarkerLoc = markerLocations[2]
        let fourthMapLoc = mapLocations[3]
        let fourthMarkerLoc = markerLocations[3]
        let fifthMapLoc = mapLocations[4]
        let fifthMarkerLoc = markerLocations[4]

        addMarker(firstMapLoc, MapPinFirst, 36, 18, 1);
        addMarker(firstMarkerLoc, player_avatar, 36, 18, 2);
        let firstPath = addPath(firstMapLoc, firstMarkerLoc);
        addMarker(secondMapLoc, MapPinSecond, 36, 18, 1);
        addMarker(secondMarkerLoc, player_avatar, 36, 18, 2);
        let secondPath = addPath(secondMapLoc, secondMarkerLoc);
        addMarker(thirdMapLoc, MapPinThird, 36, 18, 1);
        addMarker(thirdMarkerLoc, player_avatar, 36, 18, 2);
        let thirdPath = addPath(thirdMapLoc, thirdMarkerLoc);
        addMarker(fourthMapLoc, MapPinFourth, 36, 18, 1);
        addMarker(fourthMarkerLoc, player_avatar, 36, 18, 2);
        let fourthPath = addPath(fourthMapLoc, fourthMarkerLoc);
        addMarker(fifthMapLoc, MapPinFifth, 36, 18, 1);
        addMarker(fifthMarkerLoc, player_avatar, 36, 18, 2);
        let fifthPath = addPath(fifthMapLoc, fifthMarkerLoc);

        let lineBounds = new google.maps.LatLngBounds();
        lineBounds.extend(firstPath.getPath().getAt(0));
        lineBounds.extend(firstPath.getPath().getAt(1));
        lineBounds.extend(secondPath.getPath().getAt(0));
        lineBounds.extend(secondPath.getPath().getAt(1));
        lineBounds.extend(thirdPath.getPath().getAt(0));
        lineBounds.extend(thirdPath.getPath().getAt(1));
        lineBounds.extend(fourthPath.getPath().getAt(0));
        lineBounds.extend(fourthPath.getPath().getAt(1));
        lineBounds.extend(fifthPath.getPath().getAt(0));
        lineBounds.extend(fifthPath.getPath().getAt(1));
        map.fitBounds(lineBounds, 100);

        let lineCenter = lineBounds.getCenter();
        map.setCenter(lineCenter);

        console.log('%c firstMapLoc', 'color: #6fa; font-weight: bold;', firstMapLoc);
        console.log('%c firstMarkerLoc', 'color: #f6a; font-weight: bold;', firstMarkerLoc);
        console.log('%c secondMapLoc', 'color: #6fa; font-weight: bold;', secondMapLoc);
        console.log('%c secondMarkerLoc', 'color: #f6a; font-weight: bold;', secondMarkerLoc);
        console.log('%c thirdMapLoc', 'color: #6fa; font-weight: bold;', thirdMapLoc);
        console.log('%c thirdMarkerLoc', 'color: #f6a; font-weight: bold;', thirdMarkerLoc);
        console.log('%c fourthMapLoc', 'color: #6fa; font-weight: bold;', fourthMapLoc);
        console.log('%c fourthMarkerLoc', 'color: #f6a; font-weight: bold;', fourthMarkerLoc);
        console.log('%c fifthMapLoc', 'color: #6fa; font-weight: bold;', fifthMapLoc);
        console.log('%c fifthMarkerLoc', 'color: #f6a; font-weight: bold;', fifthMarkerLoc);

        const queryString = window.location.search;
        console.log(queryString);
        const urlParams = new URLSearchParams(queryString);
        const game = urlParams.get('game');
        const settings = urlParams.get('settings');
        console.log(game);
        selectedMapKey = game;
        selectedGameSettings = encodeURIComponent(settings);

        let overlay = new google.maps.OverlayView();
        overlay.draw = function () { 
            this.getPanes().markerLayer.id='player_marker'; 
        };

        overlay.setMap(map);
    }

    return (
        <div className='Final--Score--Container'>
            <Map center={{lat: 0, lng: 0}} zoom={5}/>
            <div className='Final--ScoreBoard--Container'>
                <div>Final Score</div>
                {/*<div id="final-meters">&nbsp;</div>*/}
                <button onClick={() => document.location.href = '/'}>Home</button>
            </div>
        </div>
    )
}