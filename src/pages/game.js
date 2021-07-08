import React, { useState, useEffect } from 'react'
import { Map, Marker, TileLayer, Tooltip } from 'react-leaflet'
import data from "../data/capitalCities.json"
import { useLocalStorage, distance } from "../utils"
import { Button, Container, Row, Col, Alert, Badge, Navbar } from 'react-bootstrap'
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
  const [showCorrectAlert, setShowCorrectAlert] = useState(false);

  const [highScore,setHighScore] = useLocalStorage('highscore' , 0);

  useEffect(() => {
      if(index < data.capitalCities.length){
          setCity(data.capitalCities[index].capitalCity);
      }
  },[index, city]);

  const OnMapClick = (e) => {
      const position = [e.latlng.lat, e.latlng.lng];
      setPosition(position);
      setMarkers([position]);
      setShowCorrectAlert(false);
  }

  const OnPlaceButtonClick = () =>{
      const lat = parseFloat(data.capitalCities[index].lat);
      const long = parseFloat(data.capitalCities[index].long);
      const currentPosition = [lat, long];

      const kilometer = distance(lat, long, position[0], position[1]);
      setShowCorrectAlert(false);

      if(kilometer <= diffKilometer){
        setShowCorrectAlert(true);
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
              if(placed > highScore){
                  setHighScore(placed);
              }
          }
      }

      setTimeout(() => {
          OnNext();
      }, 3000);
  }

  const OnNext = () =>{
      setShowCorrectAlert(false);
      setMarkers([]);
      setIndex(index + 1);

      if(index >= data.capitalCities.length){
          setFinished(true);
          if(placed > highScore){
              setHighScore(placed);
          }
      }
  }

  return(
    <Container fluid className="vh-100 d-flex flex-column">
        <Row>
            <Col md={{ span: 4, offset: 4 }}>
                <div className='p-1 mt-4 border border-secondary bg-light text-center'>
                    {placed} cities placed / High Score: {highScore}
                </div>
                <div className='p-1 border border-secondary bg-light text-center'>
                    {kilometers} kilometers left
                </div>
                <div className='text-center m-2'>
                    {!finished ? <span>Select the location of <br/> "{city}"</span> : "Game Over!"}
                </div>
                <Alert show={showCorrectAlert} variant="success">Correct!</Alert>
            </Col>
        </Row>
    <Row className="h-100">
        <Col>
        <div className="d-flex flex-column h-100">
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
        </div>
        </Col>
    </Row>
    <Row>
        <Col className="d-flex align-items-end flex-column">
            <div className="ml-auto py-2">
                <Button variant="primary" disabled={finished} onClick={OnPlaceButtonClick}>Place</Button>
                {/* <Button variant="secondary" onClick={OnNext}>Next</Button> */}
            </div>
        </Col>
    </Row>
  </Container>

  )
};

export default Game;


//leaftlet Basemaps:

//http://{s}.tile.osm.org/{z}/{x}/{y}.png
//https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png
//https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png
//https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png
