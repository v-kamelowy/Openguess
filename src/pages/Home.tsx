import './Home.css';
import { useState, useEffect, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import axios from 'axios';

import HomepageNavbar from '../components/HomepageNavbar';
import Hero from '../components/Hero';
import HeaderFlow from '../components/HeaderFlow';
import SecondHeaderFlow from '../components/SecondHeaderFlow';
import LeftBlock from '../components/LeftBlock';
import LeftBlockFlow from '../components/LeftBlockFlow';
import RightBlockFlow from '../components/RightBlockFlow';
import FeaturedMap from '../components/FeaturedMap';
import MapCard from '../components/MapCard';
import ImageOpenguessUI from '../components/images/openguess-UI.svg';
import ImageOpenguessUI2 from '../components/images/openguess-UI-2.svg';
import Footer from '../components/Footer';
import { PuffLoader } from 'react-spinners';

/* Map images */
//import MapPlaceholder from '../components/images/maps/Placeholder.png';
/*
import MapEurope from '../components/images/maps/Europe.jpg';
import MapFrance from '../components/images/maps/France.jpg';
import MapPoland from '../components/images/maps/Poland.jpg';
import MapSpain from '../components/images/maps/Spain.jpg';
import MapUSA from '../components/images/maps/USA.jpg';
import MapSwitzerland from '../components/images/maps/Switzerland.jpg';
import MapKrosnoOdrz from '../components/images/maps/KrosnoOdrz.jpg';
import MapTrojmiasto from '../components/images/maps/Trojmiasto.jpg';
import MapCzestochowa from '../components/images/maps/Czestochowa.jpg';
*/

/* Featured map images */
//import FeaturedMapWorld from '../components/images/maps/FeaturedWorld.jpg';
import RightBlock from '../components/RightBlock';

let MapComponents;
let MappedMapComponents: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal;
const ApiUrl = "https://api.openguess.pl";
const ApiKey = process.env.REACT_APP_OPENGUESS_API_KEY;
const ApiPath = "/api/v1/maps";
const ApiLink = `${ApiUrl}${ApiPath}?apiKey=${ApiKey}`;
console.log(ApiLink);

/*
const mapKeyWorld = "world";
const mapKeyEurope = "europe";
const mapKeyFrance = "france";
const mapKeyPoland = "poland";
const mapKeySpain = "spain";
const mapKeyUSA = "usa";
const mapKeySwitzerland = "switzerland";
const mapKeyKrosnoOdrz = "krosno-odrz";
const mapKeyTrojmiasto = "trojmiasto";
const mapKeyCzestochowa = "czestochowa";
*/

export default function Home() {
  const { session } = useAuth();
  const { setCurrentMap, setCurrentRound, setCurrentScore, setMaps, setScores, setCurrentPlayerLocation, setPlayerLocations } = useGame();
  const [ isAccountChecked, setIsAccountChecked ] = useLocalStorage('acc_check', false);
  const [ mapCards, setMapCards ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    setCurrentMap('');
    setCurrentPlayerLocation('');
    setCurrentRound(0);
    setCurrentScore(0);
    setMaps([]);
    setScores([]);
    setPlayerLocations([]);
    localStorage.setItem('timestamp', null);
    console.log("Cleaned")
    document.title = 'Openguess - Homepage';
    axios.get(ApiLink).then((response) => {
      setMapCards(response.data.available_maps);
      setIsLoading(false);
    });
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event == 'SIGNED_OUT') setIsAccountChecked(false);
    })

    async function getUserProfile(fullUsername: string) {
      /*
      let { data: profile_data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', fullUsername);

      
      if (profile_data[0] == undefined) {
        console.log('User not found');
      } else {
        console.log('User found');
      }
      */
    }
    if (!isAccountChecked) {
      if (session) {
        getUserProfile(session.user.user_metadata.name);
        async function updateUsername(newUsername: string) {
          const { data, error } = await supabase
          .from('profiles')
          .update({ username: newUsername
          })
          .eq('uuid', session.user.id)
  
          if (error) {
            console.error(error);
          }
        }

        async function updateAvatar(newAvatar: string) {
          const { data, error } = await supabase
          .from('profiles')
          .update({ avatar_url: newAvatar
          })
          .eq('uuid', session.user.id)
  
          if (error) {
            console.error(error);
          }
        }

        async function checkForUpdates() {
          let { data: profile, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('uuid', session.user.id)
    
          if (profile[0].username !== session.user.user_metadata.name) {
            //console.log("%cUsername has changed.", "color: #ff6262;");
            updateUsername(session.user.user_metadata.name);
          } else {
            //console.log("%cUsername has not changed.", "color: #62ff62;");
          }
    
          if (profile[0].avatar_url !== session.user.user_metadata.avatar_url) {
            //console.log("%cAvatar has changed.", "color: #ff6262;");
            updateAvatar(session.user.user_metadata.avatar_url);
          } else {
            //console.log("%cAvatar has not changed.", "color: #62ff62;");
          }
          setIsAccountChecked(true);
        }
        checkForUpdates();
      }
    }
  }, [session]);

  if (!session) {
    return (
      <div>
        <div className={`LoaderWrapper ${isLoading ? null : "Disappear"}`}>
          <PuffLoader size={"8rem"} color={"#ff4242"} />
        </div>
        <HomepageNavbar />
        <Hero />
        <HeaderFlow color="#e0e0e0" />
        <LeftBlock title='Find yourself.' subtitleLine1="Use the minimap, find your location." subtitleLine2="Submit, and get the score. It's really that simple!" image={ImageOpenguessUI} />
        <LeftBlockFlow />
        <RightBlock title="Test your skills!" subtitleLine1="Test your geo skills with predefined maps." subtitleLine2="You can also make your own with our Map Editor!" image={ImageOpenguessUI2} />
        <SecondHeaderFlow color="#e0e0e0" />
        <div className='MapCards' id="Maps">
          <div className='FeaturedCard'>
            {
              mapCards.map((map: any, index: Number) => {
                if (map.featured) {
                  return (
                    <FeaturedMap key={index} title={map.name} description={map.description} image={map.thumbnail} mapKey={map.key}/>
                  )
                }
            })}
          </div>
          <div className='Cards'>
            {
              mapCards.map((map: any, index: Number) => {
                if (!map.featured){
                  return (
                    <MapCard key={index} title={map.name} description={map.description} image={map.thumbnail} mapKey={map.key}/>
                  )
                }
            })}
          </div>
        </div>
        <Footer />
      </div>
    )
  } else {
    return (
      <div>
        <div className={`LoaderWrapper ${isLoading ? null : "Disappear"}`}>
          <PuffLoader size={"8rem"} color={"#ff4242"} />
        </div>
        <HomepageNavbar />
        <Hero />
        <HeaderFlow color="#e0e0e0" />
        <div className='MapCards' id="Maps">
          <div className='FeaturedCard'>
            {
              mapCards.map((map: any, index: Number) => {
                if (map.featured) {
                  return (
                    <FeaturedMap key={index} title={map.name} description={map.description} image={map.thumbnail} mapKey={map.key}/>
                  )
                }
            })}
          </div>
          <div className='Cards'>
            {
              mapCards.map((map: any, index: Number) => {
                if (!map.featured){
                  return (
                    <MapCard key={index} title={map.name} description={map.description} image={map.thumbnail} mapKey={map.key}/>
                  )
                }
            })}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
