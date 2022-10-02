import React from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../contexts/AuthContext';
import './Tests.css';
import axios from 'axios';
import MapCard from '../components/MapCard';
let MapComponents;
let MappedMapComponents: any;
const ApiUrl = "http://localhost:3030";
const ApiKey = process.env.REACT_APP_OPENGUESS_API_KEY;
const ApiPath = "/api/v1/maps";
const ApiLink = `${ApiUrl}${ApiPath}?apiKey=${ApiKey}`;
console.log(ApiLink);


export default function FirestoreTest() {

  //const { session } = useAuth();
  const session = {
    user: {
      id: "1",
      user_metadata: {
        name: "test",
        avatar_url: "test"
      }
    }
  }
  const user = session.user;
  
  async function getAllData() {
    console.log(user);
  }

  async function getMyStructureData() {
    let { id } = user;
    let { name, avatar_url } = user.user_metadata;
    let openg_user = {
      id,
      name,
      avatar_url,
    }
    openg_user.id = id;
    openg_user.name = name
    openg_user.avatar_url = avatar_url
    console.log(openg_user);
  }
/*
  async function removeMapFromFavourites(fav_maps: Array<string>, map_id: string) {
    for( var i = 0; i < fav_maps.length; i++){ 
      if ( fav_maps[i] === map_id) { 
          fav_maps.splice(i, 1); 
          i--; 
      }
    }
  }
*/
  async function getDataFromDB(isAddSwitzerland: boolean) {
    let { data: profiles, error } = await supabase
      .from('profiles')
      .select('favorite_maps')
      .eq('uuid', user.id)
    
    if (error) {
      console.log(error);
    } else {
      let { favorite_maps } = profiles[0];
      if (!isAddSwitzerland) {
        console.log("%cFavorite maps in Database:", "color: #ff6262;");
        console.log(favorite_maps);
      }
      if (isAddSwitzerland) {
        if (!favorite_maps.includes('SWITZERLAND')) {
          favorite_maps.push('SWITZERLAND');
          console.log("%cAdded SWITZERLAND to favorite maps array.", "color: #62ff62;");
          updateDataInDB(favorite_maps);
        }
      }
    }
  }

  async function updateDataInDB(maps: Array<string>) {
    const { data, error } = await supabase
    .from('profiles')
    .update({ favorite_maps: maps })
    .eq('uuid', user.id)

    if (error) {
      console.log(error);
    } else {
      let { favorite_maps } = data[0];
      console.log("%cFavorite maps in Database:", "color: #ff6262;");
      console.log(favorite_maps);
    }
  }

  async function getMapsDataFromDB() {
    axios.get(ApiLink).then((response) => {
      MapComponents = response.data.available_maps;
      MappedMapComponents = MapComponents.map((map: any) => {
        console.log(map);
        return (
          <MapCard title={map.name} description={map.description} image={map.thumbnail} mapKey={map.key}/>
        )
      })
    }).catch((error) => {
      console.log(error);
    });
  }

  const map_reset = ["USA", "WORLD", "POLAND"]
  return (
    <div className='TestEnvironment'>
      <div className='TestButtonWrapper'><button className='TestButton' onClick={() => getAllData()}>Get all user data</button><div className='TestButtonBottom'>&nbsp;</div></div>
      <br></br>
      <div className='TestButtonWrapper'><button className='TestButton' onClick={() => getMyStructureData()}>Get structured user data</button><div className='TestButtonBottom'>&nbsp;</div></div>
      <br></br>
      <div className='TestButtonWrapper'><button className='TestButton' onClick={() => getDataFromDB(false)}>Get current user data from Database</button><div className='TestButtonBottom'>&nbsp;</div></div>
      <br></br>
      <div className='TestButtonWrapper'><button className='TestButton' onClick={() => getDataFromDB(true)}>Add Switzerland to Database</button><div className='TestButtonBottom'>&nbsp;</div></div>
      <br></br>
      <div className='TestButtonWrapper'><button className='TestButton' onClick={() => updateDataInDB(map_reset)}>Return default values in Database</button><div className='TestButtonBottom'>&nbsp;</div></div>
      <br></br>
      <div className='TestButtonWrapper'><button className='TestButton' onClick={() => console.log(session.user.user_metadata)}>Console Log User Metadata</button><div className='TestButtonBottom'>&nbsp;</div></div>
      <br></br>
      <div className='TestButtonWrapper'><button className='TestButton' onClick={() => getMapsDataFromDB()}>Get Maps Data Object</button><div className='TestButtonBottom'>&nbsp;</div></div>
      <MapCard title="123" description="123" image="123" mapKey="123"/>
    </div>
  )
}

