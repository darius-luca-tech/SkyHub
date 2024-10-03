import './App.css';
import { useEffect, useState, useMemo } from 'react';
import { AppState, EUserType } from './api/enums';
import { getBindingDevices, getUserInfo, getDeviceTopo, updateDevice, login, getDeviceBySn } from './api/manage';
import { Button, Flex, Text } from '@chakra-ui/react';
import DeviceCard from './components/project/device_card';
import { useWebsocket } from './hooks/use-websocket';

import { TbDrone } from 'react-icons/tb';
import { Map, Marker } from 'react-map-gl';
import { getUnreadDeviceHms } from './api/project';
import { apiPilot, messageHandler} from './api/pilot';

function App() {
  const [devices, setDevices] = useState([])

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setAppToken] = useState(null);  // Token state
  const [workspaceId, setWorkspaceId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({ longitude: 21.18, latitude: 45.78 });
  const [viewport, setViewport] = useState({
    longitude: 21.18,
    latitude: 45.78,
    zoom: 9,
  });


  const payload = useWebsocket(AppState.token, messageHandler)


  // Attempt login on mount
  useEffect(() => {
    const attemptLogin = async () => {
      const response = await login("adminPC", "adminPC", EUserType.Web);
      console.log(response)
      if (response.code === 0) {
        const { access_token, workspace_id, username, user_id } = response.data;
        AppState.token = access_token;
        AppState.workspace_id = workspace_id;
        AppState.username = username;
        AppState.userId = user_id;

        console.log("[ Admin-INFO ] Admin logged in!");
        console.log("[ Admin-INFO ] Token: ", AppState.token);
        console.log("[ Admin-INFO ] WorkspaceID: ", AppState.workspace_id);
        console.log("[ Admin-INFO ] UserId: ", AppState.userId);

        setAppToken(access_token);  // Set token to state
        setWorkspaceId(workspace_id);
        setLoggedIn(true); // Set logged-in status
      } else {
        console.error(response.message);
      }
    };
    attemptLogin();
  }, []);

  // Call useWebsocket conditionally, only after token is available
  const fetchDevices = async () => {
    if (!AppState.workspace_id) return;

    setIsLoading(true);  // Start loading
    try {
      const devicesResponse = await getBindingDevices(AppState.workspace_id, 1, 10, '0');
      if (devicesResponse.data.list && devicesResponse.data.list.length > 0) {
        setDevices(devicesResponse.data.list || []);
        console.log("Devices: ", devicesResponse.data.list[0].device_sn);

        const topo = await getDeviceBySn(workspaceId, devicesResponse.data.list[0].device_sn);
        console.log("Topo: ", topo)
          
        devicesResponse.data.list.map(async device => {
          console.log('hms', await getUnreadDeviceHms(workspaceId, device.device_sn))
        })
        
      } else {
        console.warn("No devices found");
      }

    } catch (error) {
      console.error("Error fetching devices: ", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Fetch devices after login and WebSocket is initialized
  useEffect(() => {
    if (loggedIn) {    
      fetchDevices();
    }
  }, [loggedIn]); // Fetch devices only after the user is logged in

  const updateMarker = (device) => {
    setSelectedDevice(device.device_sn);
    console.log("device.device_sn: ", payload[device.data] )

    const deviceLocation = payload[device.data];
    console.log("deviceLoc: ", payload)
    if (deviceLocation && device.status) {
      setMarkerPosition({
        longitude: deviceLocation.longitude,
        latitude: deviceLocation.latitude,
      });
      setViewport((prevViewport) => ({
        ...prevViewport,
        longitude: deviceLocation.longitude,
        latitude: deviceLocation.latitude,
      }));
    }
  };

  const RenderedMap = useMemo(() => (
    <Map
      initialViewState={viewport}
      {...viewport}
      onMove={(evt) => setViewport(evt.viewState)}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
    >
      <Marker
        longitude={markerPosition.longitude}
        latitude={markerPosition.latitude}
        key={selectedDevice}
      >
        <TbDrone size={50} color="blue" />
      </Marker>
    </Map>
  ), [viewport, markerPosition, selectedDevice]);

  return (
    <Flex width="100%" height="100vh">
      <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
      <script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>

      <Flex flexDir="column" width="400px" height="100%" p={2} bg="gray.50">
        <Button onClick={fetchDevices} mb={4} isLoading={isLoading}>Refresh</Button>
        {!isLoading && devices.length > 0 ? (
          devices.map((device) => (
            <DeviceCard
              device={device}
              key={device.device_sn}
              onClick={() => updateMarker(device)}
              isSelected={selectedDevice === device.device_sn}
            />
          ))
        ) : (
          <Text>No devices found</Text>
        )}
      </Flex>

      <Flex
        style={{
          borderLeftWidth: '1px',
          borderLeftColor: "gray.300",
          borderLeftStyle: "solid",
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {selectedDevice ? (
          RenderedMap
        ) : (
          <Text fontSize="xl" color="gray.500">Select a device to view its location</Text>
        )}
      </Flex>
    </Flex>
  );
}

export default App;
