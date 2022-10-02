import React, { useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Navbar from '../components/Navbar';
import './Edit.css';

const MAP_ZOOM = 3;
const MAP_ID = 'map';
let map: google.maps.Map;
let polygons: Array<google.maps.Polygon> = [];

export default function Guess() {
  const render = (status: any) => {
      switch (status) {
        case Status.LOADING:
          return <div>Loading...</div>
        case Status.FAILURE:
          return <div>Error</div>
        case Status.SUCCESS:
          return <Edit />
      }
  };

  const MAP_LANGUAGE = 'pl';
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return(
      <div className='Openguess'>
          <Wrapper apiKey={API_KEY} language={MAP_LANGUAGE} libraries={['geometry']} render={render}>
            <Edit />
          </Wrapper>
      </div>
  )
}

function Edit() {
    const { setCurrentMap, setCurrentRound, setCurrentScore, setMaps, setScores, setCurrentPlayerLocation, setPlayerLocations } = useGame();
    
    useEffect(() => {
        setCurrentMap('');
        setCurrentPlayerLocation('');
        setCurrentRound(0);
        setCurrentScore(0);
        setMaps([]);
        setScores([]);
        setPlayerLocations([]);
        console.log("Cleaned");
      }, []);

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
            MapEditor();
        }, []);
        
        return <div className='MapEditor--Map--Wrapper'><div ref={MapRef} id={MAP_ID} className={`MapEditor--Map`}></div></div>
    }
    
    /*
    useEffect(() => {
      document.addEventListener("keydown", (event) => {
        event.preventDefault();
        if (event.ctrlKey && event.key === "z") {
          console.log("Undo!");
          polygons.pop();
        }
        return () => document.removeEventListener("keydown", (event) => {
          event.preventDefault();
          if (event.ctrlKey && event.key === "z") {
            console.log("Undo!");
            polygons.pop();
          }
        });
      });
    }, []);
    */

    function makeNewPolygon(click_location: google.maps.LatLng) {
      let click_location_lat = click_location.lat();
      console.log(click_location_lat);
      let click_location_lng = click_location.lng();
      console.log(click_location_lng);
      const clc_lat = 0.01
      const clc_lng = 0.025
      let polygon_path = [
        {lat: click_location_lat - clc_lat, lng: click_location_lng + clc_lng},
        {lat: click_location_lat + clc_lat, lng: click_location_lng + clc_lng},
        {lat: click_location_lat + clc_lat, lng: click_location_lng - clc_lng},
        {lat: click_location_lat - clc_lat, lng: click_location_lng - clc_lng},
      ];
      let polygon = new google.maps.Polygon({
        strokeColor: '#FF4242',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF4242',
        fillOpacity: 0.35,
        editable: true,
        draggable: true,
        visible: true,
        geodesic: false,
        map: map,
        paths: [polygon_path],
      });
      polygons.push(polygon);
      console.log(polygons);
    }

    function MapEditor() {
      google.maps.event.addListener(map, 'click', function (event) {
        console.log("clicked");
        makeNewPolygon(event.latLng);
      });
    }

    function saveMap() {
      var filename = Date.now();
      let map_data: Array<Array <google.maps.LatLng>> = [];
      polygons.forEach((polygon) => {
        let polygon_data: Array<google.maps.LatLng> = [];
        polygon.getPath().getArray().map((point: google.maps.LatLng) => {
          //@ts-ignore
          polygon_data.push({lat: point.lat(), lng: point.lng()});
        });
          polygon_data.flat();
          map_data.push(polygon_data);
        console.log(map_data);
      });
      let export_map_data = {
        settings: {
          map_name: "Debug",
          map_type: "city",
          starting_point: {lat: 0, lng: 0},
          minimap_zoom: 3,
        },
        map_structure: map_data
      }
      let jsonContent = 'data:text/json;charset=utf-8,' + JSON.stringify(export_map_data);
      var encodedUri = encodeURI(jsonContent);
      var link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `openg-${filename}.json`);
      document.body.appendChild(link);
      link.click();
    }

  return (
    <div>
        <Navbar />
        <Map center={{lat: 35, lng: 15}} zoom={MAP_ZOOM} />
        <button className='Debug--Button' onClick={() => saveMap()}>Save</button>
    </div>
  )
}
