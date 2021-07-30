import React, { useEffect, useState } from "react";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { Loader } from "@googlemaps/js-api-loader";

import "./Map.css";

const locations = [
  { lat: 30.56391, lng: 75.154312, id: 1 },
  { lat: 30.718234, lng: 75.363181, id: 2 },
  { lat: 30.727111, lng: 75.371124, id: 3 },
  { lat: 30.848588, lng: 75.209834, id: 4 },
  { lat: 30.851702, lng: 75.216968, id: 5 },
  { lat: 30.671264, lng: 75.863657, id: 6 },
  { lat: 30.304724, lng: 75.662905, id: 7 },
  { lat: 30.817685, lng: 75.699196, id: 8 },
  { lat: 30.828611, lng: 75.790222, id: 9 },
  { lat: 30.75, lng: 75.116667, id: 10 },
  { lat: 30.759859, lng: 75.128708, id: 11 },
  { lat: 30.765015, lng: 75.133858, id: 12 },
  { lat: 30.770104, lng: 75.75299, id: 13 },
  { lat: 30.7737, lng: 75.75187, id: 14 },
  { lat: 30.774785, lng: 75.137978, id: 15 },
  { lat: 30.819616, lng: 75.968119, id: 16 },
  { lat: 30.330766, lng: 75.695692, id: 17 },
  { lat: 30.927193, lng: 75.053218, id: 18 },
  { lat: 30.330162, lng: 75.865694, id: 19 },
];

const PopUp = ({ markerData }) => {
  const {
    pixels: { clientX, clientY },
  } = markerData;
  const xPos = clientX - 60 + "px";
  const yPos = clientY - 126 + "px";
  return (
    <div
      style={{
        position: "absolute",
        left: xPos,
        top: yPos,
        backgroundColor: "white",
      }}
    >
      <div>
        <h3>Station Name</h3>
      </div>
      <div>
        <span>Address</span>
      </div>
      <div>
        <span>BSS code</span>
      </div>
      <div>
        <button>View Details</button>
      </div>
    </div>
  );
};

const Maps = () => {
  let map = null;

  const [markerData, setMarkerdata] = useState({});
  const [isShowPopUp, setIsShowPopUp] = useState(false);

  const initMap = () => {
    const loader = new Loader({
      apiKey: "YOUR MAPS API KEY",
    });

    const zoom = 10;
    const size = 40;

    loader.load().then(() => {
      // eslint-disable-next-line no-undef
      const markerImage = new google.maps.MarkerImage(
        "https://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png",
        // eslint-disable-next-line no-undef
        new google.maps.Size(24, 32)
      );

      // eslint-disable-next-line no-undef
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 30.858899, lng: 75.868087 },
        zoom: 10,
        mapTypeId: "roadmap",
        mapTypeControl: false,
      });

      // eslint-disable-next-line no-undef
      var transitLayer = new google.maps.TransitLayer();
      transitLayer.setMap(map);

      const markers = locations.map((location, i) => {
        const { lat, lng } = location;

        // eslint-disable-next-line no-undef
        const marker = new google.maps.Marker({
          position: { lat, lng },
          icon: markerImage,
        });

        // eslint-disable-next-line no-undef
        // const infowindow = new google.maps.InfoWindow({
        //   content: contentString,
        // });

        map.addListener("click", () => {
          setIsShowPopUp(false);
        });

        marker.addListener("click", (event) => {
          const {
            domEvent: { clientX, clientY },
          } = event;
          setMarkerdata({ location, pixels: { clientX, clientY } });
          setIsShowPopUp(true);
          // infowindow.open({
          //   anchor: marker,
          //   map,
          //   shouldFocus: false,
          // });
        });

        return marker;
      });

      new MarkerClusterer(map, markers, {
        maxZoom: zoom,
        gridSize: size,
        styles: [
          {
            width: 30,
            height: 30,
          },
          {
            width: 40,
            height: 40,
          },
          {
            width: 50,
            height: 50,
          },
        ],
        clusterClass: "custom-clustericon",
        title: "Click to zoom",
      });
    });
  };

  useEffect(() => {
    initMap();
  }, []);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
        },
        () => {
          alert("Please allow location access");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  return (
    <div>
      <div style={{ position: "absolute", left: "1%", top: "1%", zIndex: 1 }}>
        <div>
          <input />
        </div>
        <div>
          <button>Number of active stations</button>
          <button>Number of active stations</button>
          <button>Number of active stations</button>
          <button>Number of active stations</button>
        </div>
      </div>
      <div id="map" style={{ height: "100vh", width: "100vw" }} />
      {isShowPopUp && <PopUp markerData={markerData} />}
      <button
        style={{
          position: "absolute",
          right: "1%",
          bottom: "20%",
        }}
        onClick={handleCurrentLocation}
      >
        location
      </button>
    </div>
  );
};

export default Maps;
