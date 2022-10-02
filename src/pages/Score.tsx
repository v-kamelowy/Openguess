import React, { useEffect, useRef } from 'react'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import DefaultAvatar from '../auth/images/default-avatar.png';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import Navbar from '../components/Navbar';
import './Score.css';
import OpenPin from './images/open_pin.png';
import { Progress } from '@mantine/core';

let map: google.maps.Map;
let userMarker: google.maps.Marker;
let goalMarker: google.maps.Marker;

let selectedMapKey: string;
let selectedGameSettings: string;

export default function Score() {
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
        
        return <div className='ScoreMap--Map--Wrapper'><div ref={MapRef} id={'ScoreMap'} className={`ScoreMap--Map`}>&nbsp;</div></div>
    }

    function InitScore() {
        localStorage.setItem('timestamp', null);
        let player_avatar = DefaultAvatar
        if (session) {
            player_avatar = session.user.user_metadata.avatar_url;
        }
        document.title = 'Openguess - Score';
        const queryString = window.location.search;
        console.log(queryString);
        const urlParams = new URLSearchParams(queryString);
        const game = urlParams.get('game');
        const settings = urlParams.get('settings');
        console.log(game);
        selectedMapKey = game;
        selectedGameSettings = encodeURIComponent(settings);
        /*
        if (maps_array.length === 5) {
            document.location.href = '/final?game=' + selectedMapKey + '&settings=' + selectedGameSettings;
        }
        */
        let overlay = new google.maps.OverlayView();
        overlay.draw = function () { 
            this.getPanes().markerLayer.id='player_marker'; 
        };

        overlay.setMap(map);

        userMarker = new google.maps.Marker({
            position: {lat: Number(PLAYER_LOCATION.lat), lng: Number(PLAYER_LOCATION.lng)},
            map: map,
            zIndex: 100,
            icon: {
                url: player_avatar,
                scaledSize: new google.maps.Size(42, 42),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(21, 21),
            },
            title: "Picked place",
            visible: true,
          });
            
          goalMarker = new google.maps.Marker({
            position: {lat: Number(MAP_LOCATION.lat), lng: Number(MAP_LOCATION.lng)},
            map: map,
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
                url: OpenPin,
                scaledSize: new google.maps.Size(42, 42),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(21, 21),
            },
            title: "Miejsca docelowe",
            visible: true,
            });
    
        let lineSymbol = {
            path: "M 0,-1 0,1",
            strokeOpacity: 0,
            strokeWeight: 2,
            scale: 4,
        };
    
        let visibleLineSymbol = {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            strokeWeight: 2,
            scale: 4,
        };
    
        let line: google.maps.Polyline = new google.maps.Polyline({
            path: [
                { lat: 0.0, lng: 0.0 },
                { lat: 0.0, lng: 0.0 },
            ],
            strokeColor: "#222222",
            strokeOpacity: 0.0,
            icons: [
                {
                  icon: lineSymbol,
                  offset: "0px",
                  repeat: "15px",
                },
              ],      
            map: map,
            visible: true,
        });
    
    
        let lineMapPos: google.maps.LatLng = new google.maps.LatLng(Number(MAP_LOCATION.lat), Number(MAP_LOCATION.lng));
        let lineMarkerPos: google.maps.LatLng = new google.maps.LatLng(Number(PLAYER_LOCATION.lat), Number(PLAYER_LOCATION.lng));
        line.setPath([
            lineMapPos,
            lineMarkerPos,
        ]);
    
        line.setOptions({
            icons: [
                {
                    icon: visibleLineSymbol,
                    offset: "0px",
                    repeat: "15px",
                },
            ],
        });
        let lineBounds = new google.maps.LatLngBounds();
        lineBounds.extend(lineMapPos);
        lineBounds.extend(lineMarkerPos);
        let lineCenter = lineBounds.getCenter();
        map.setCenter(lineCenter);
        
        let meters = google.maps.geometry.spherical.computeLength(line.getPath())
        console.log(meters);
        let metersDiv = document.getElementById("meters");
        if (meters < 1000) {
            metersDiv.innerHTML = meters.toFixed(0) + "m from destination point.";
        } else {
            metersDiv.innerHTML = (meters/1000).toFixed(0) + " km from destination point.";
        }
    
        map.fitBounds(lineBounds, 100);
    }

    
    return (
        <div className='Score--Container'>
            <Map center={{lat: 0, lng: 0}} zoom={5}/>
            <div className='ScoreBoard--Container'>
                <div id="meters">&nbsp;</div>
                <Progress radius='xl' size='xl' 
                sections={[
                    { value: SCORE_PERCENTAGE, color: 'red' },
                ]}
                />
                <button className="ScoreBoard--NextRound" onClick={() => document.location.href = '/guess?game=' + selectedMapKey + '&settings=' + selectedGameSettings}>Next Round</button>
                <div id="score_text">{SCORE} <a>/</a> 5000</div>
            </div>
        </div>
    )
}