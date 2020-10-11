import React, { useState, useEffect } from 'react'
import { Map, Marker, TileLayer, Tooltip } from 'react-leaflet'
import data from "../data/capitalCities.json"
import { useLocalStorage, distance } from "../utils"
//import { icon } from "../components/icon";
 
const Game = () => {

  const zoom = 5;  
  const diffKilometer = 50;
  const maxKilometer = 1500;  

  const [position, setPosition] = useState([52.374647, 9.738464]); //kröpcke hannover as start location of map :)
  const [placed, setPlaced] = useState(0);
  const [kilometers, setKilometers] = useState(maxKilometer);  
  const [index, setIndex] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [city, setCity] = useState(null);

  const [highscore,setHighscore] = useLocalStorage('highscore' , 0);

  useEffect(() => {
      if(index < data.capitalCities.length){
          setCity(data.capitalCities[index].capitalCity);          
      }               
  },[index, city]);   

  const OnMapClick = (e) => {    
      const position = [e.latlng.lat, e.latlng.lng];
      setPosition(position);  
      setMarkers([position]);
  }  

  const OnPlaceButtonClick = () =>{
      const lat = parseFloat(data.capitalCities[index].lat);
      const long = parseFloat(data.capitalCities[index].long);
      const currentPosition = [lat, long];  
    
      const kilometer = distance(lat, long, position[0], position[1]);  

      if(kilometer <= diffKilometer){
        alert('correct!')
        if(!finished){
            setPlaced(placed + 1);
        }        
      }  
      else{
          setKilometers(kilometers - kilometer);
          setMarkers([position, currentPosition]);
          
          if((kilometers - kilometer) <= 0){
              setKilometers(0);
              setFinished(true);
              if(placed > highscore){
                  setHighscore(placed);
              }
          }
      }      
  }

  const OnNextButtonClick = () =>{
      setMarkers([]);
      setIndex(index + 1);

      if(index >= data.capitalCities.length){
          setFinished(true);
          if(placed > highscore){
              setHighscore(placed);
          }        
      }
  }

  return(
    <>
        <div className='text-center'>
            {placed} cities placed / High Score: {highscore}
        </div>
        <div className='text-center'>
            {kilometers} kilometers left
        </div>
        <div className='text-center'>Select the location of {<span className='badge badge-danger'>{city}</span>}</div>
            
        <Map center={position} zoom={zoom} onclick={OnMapClick}>    {/* zoomControl={false} scrollWheelZoom={false} doubleClickZoom={false} */}         
            <TileLayer
              url='https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />    
              {markers.map((element, index) => (
              <Marker
                  key={index}
                  marker_index={index}
                  position={element}                
                  //icon={icon}               
              >             
                {index !== 0 ? <Tooltip permanent={true}>{city} is here!</Tooltip> : null}
              </Marker>
              ))}     
        </Map>
        <div className='fixed-bottom'>        
            <button onClick={OnPlaceButtonClick} className='btn btn-lg btn-primary float-right mr-2 mb-2'>Place</button>
            <button disabled={finished} onClick={OnNextButtonClick} className='btn btn-lg btn-primary float-right mr-2 mb-2'>Next</button>
        </div>      
      </>
  )  
};
 
export default Game;


//leaftlet Basemaps:

//http://{s}.tile.osm.org/{z}/{x}/{y}.png
//https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png
//https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png
//https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png
