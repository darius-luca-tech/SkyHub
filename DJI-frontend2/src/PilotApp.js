import './App.css';
import { useEffect, useState } from 'react';
import { createBinding, checkToken, verifyLicense, apiPilot, connectCallback, wsConnectCallback, messageHandler, liveStreamCallback } from './api/pilot';
import { bindDevice } from './api/manage';
import VConsole from 'vconsole';
import { EComponentName, EStatusValue, AppState, RTMPparam, ELiveTypeValue } from './api/enums';
import { getBindingDevices } from './api/manage';
import { Flex } from '@chakra-ui/react';
import ModuleCard from './components/pilot/module_card';
import { useWebsocket } from './hooks/use-websocket';
import { CURRENT_CONFIG } from './api/config';

const components = apiPilot.init();

function PilotApp() {
  const [licenseVerified, setLicenseVerfied] = useState(false);
  const [loggedIn, setLogedIn] = useState(false);
  const [bound, setBind] = useState(false);

  const [isApiLoaded, setApiLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Api));
  const [isMapLoaded, setMapLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Map));
  const [isWsLoaded, setWsLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Ws));
  const [isThingLoaded, setThingLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Thing));
  const [isTsaLoaded, setTsaLoaded] = useState(apiPilot.isComponentLoaded(EComponentName.Tsa));


  const [isWsConnected, setWsConnected] = useState(false); // Track WebSocket connection status
  const [tokenReady, setTokenReady] = useState(false); // Track if the token is ready

  // Directly pass the token to useWebsocket, and it will handle when to connect
  useWebsocket(AppState.token, messageHandler, () => setWsConnected(true)); // Set WebSocket connected state to true on successful connection

  const verify = async () => {
    const isVerified = await verifyLicense();
    setLicenseVerfied(isVerified);
    console.log("License verified:", isVerified);
  };

  const setup = async () => {
    if (licenseVerified) {
      const successfulSignIn = await checkToken();
      setLogedIn(successfulSignIn);

      if (!successfulSignIn) {
        console.error("Login failed, stopping setup.");
        return;
      }

      const workspaceId = AppState.workspace_id;
      apiPilot.setWorkspaceId(workspaceId);
      apiPilot.setToken(AppState.token);

      const userId = AppState.userId;
      const sn = apiPilot.getAircraftSN();
      AppState.device_sn = sn;

      if (sn === undefined || userId === undefined || workspaceId === undefined) {
        console.error("Missing required data (serial number, userId, workspaceId).");
        return;
      }  

      const bindParam = {
        device_sn: sn,
        user_id: userId,
        workspace_id: workspaceId,
        nickname: "M300",
        domain: 0,
        parent_sn: apiPilot.getRemoteControllerSN(),
      };

      console.log("[ Pilot-INFO ] Will bind device: ", sn, userId, workspaceId);
      const bindRes = await bindDevice(bindParam);
      console.log("Bind Result: ", bindRes.code);
      if (bindRes.code !== 0) {
        console.error('Bind failed');
        setBind(false);
        return;
      }

      const devices = await getBindingDevices(workspaceId, 1, 10, '0');
      console.log("Devices: ", devices);

      setBind(true);
      
      window.djiBridge.platformLoadComponent(EComponentName.Liveshare, JSON.stringify(RTMPparam))
      window.djiBridge.liveshareSetConfig(2, JSON.stringify(RTMPparam.params))
      console.log("LiveShare config: " + apiPilot.getLiveshareConfig())
      console.log("Status: " + window.djiBridge.liveshareGetStatus())

      const statusLS = window.djiBridge.liveshareStartLive()

      if (statusLS) {
        console.log("LiveShare started");
      }
      console.log("Status: " + window.djiBridge.liveshareGetStatus())

    }
  };

  useEffect(() => {
    setApiLoaded(apiPilot.isComponentLoaded(EComponentName.Api));
    setMapLoaded(apiPilot.isComponentLoaded(EComponentName.Map));
    setWsLoaded(apiPilot.isComponentLoaded(EComponentName.Ws));
    setThingLoaded(apiPilot.isComponentLoaded(EComponentName.Thing));
    setTsaLoaded(apiPilot.isComponentLoaded(EComponentName.Tsa));
  }, []);


  useEffect(() => {
    const checkTokenReady = async () => {
      // Wait until the token is available
      while (!AppState.token) {
        console.log("Waiting for token...");
        await new Promise(resolve => setTimeout(resolve, 500)); // Polling every 500ms
      }
      setTokenReady(true); // Set token as ready once it's available
      console.log("Token ready:", AppState.token);
    };

    checkTokenReady();
  }, []);

  useEffect(() => {
    const vConsole = new VConsole();
    verify();

    return () => {
      vConsole.destroy();
    };
  }, []);

  useEffect(() => {
    setup();
  }, [licenseVerified]);


  useEffect(() => {
    window.wsConnectCallback = (arg) => {
      wsConnectCallback(arg);
    };

    window.connectCallback = (arg) => {
      connectCallback(arg);
    };

    window.liveStreamCallback = arg => {
      liveStreamCallback(arg)
    }

    const gatewaySn = apiPilot.getRemoteControllerSN();
    console.log("[ Pilot-INFO ] Serial Number(RC): ", gatewaySn);
    if (gatewaySn === EStatusValue.DISCONNECT.toString()) {
      console.warn('Data is not available, please restart the remote control.');
      return;
    }

    AppState.token = apiPilot.getToken()

    const wsParam = {
      host: CURRENT_CONFIG.websocketURL,
      token: AppState.token,
      connectCallback: 'wsConnectCallback'
    }

    components.set(EComponentName.Ws, wsParam);
    apiPilot.wsConnect(wsParam.host, wsParam.token, wsParam.connectCallback)
    apiPilot.loadComponent(EComponentName.Ws, components.get(EComponentName.Ws));

    AppState.username = "pilot"
    const thingParam = {
      host: "tcp://192.168.240.5:1883",
      username: "pilot",
      password: "pilot123",
      connectCallback: 'connectCallback',
    };


    console.log("WTF0: ", window.djiBridge.platformUnloadComponent(EComponentName.Thing))
    components.set(EComponentName.Thing, thingParam);
    console.log("WTF:", apiPilot.thingGetConfigs())
    // apiPilot.loadComponent(EComponentName.Thing, thingParam)
    console.log("WTF2:", window.djiBridge.platformLoadComponent(EComponentName.Thing, JSON.stringify(thingParam)))
    // apiPilot.thingConnect(thingParam.username, thingParam.password, thingParam.connectCallback)
    console.log("WTF3: ", window.djiBridge.thingConnect(thingParam.username, thingParam.password, thingParam.connectCallback))
    console.log("status:" + window.djiBridge.thingGetConnectState())

  }, [])

// "{\"version\":\"1.0\",\"timestamp\":1727951678329,\"data\":{\"host\":{\"attitude_head\":-55.4,\"attitude_pitch\":0.4,\"attitude_roll\":-1.7000000000000002,\"elevation\":0.0,\"battery\":{\"batteries\":[{\"firmware_version\":\"01.02.05.44\",\"index\":0,\"loop_times\":91,\"capacity_percent\":42,\"sn\":\"1Z6PK1FFA300JQ\",\"sub_type\":0,\"temperature\":24.6,\"type\":0,\"voltage\":45768},{\"firmware_version\":\"01.02.05.44\",\"index\":1,\"loop_times\":92,\"capacity_percent\":42,\"sn\":\"1Z6PK1DFA300DC\",\"sub_type\":0,\"temperature\":24.2,\"type\":0,\"voltage\":45768}],\"capacity_percent\":42,\"landing_power\":5,\"remain_flight_time\":0,\"return_home_power\":0},\"firmware_version\":\"09.00.0503\",\"gear\":1,\"height\":102.961716,\"home_distance\":0.0,\"horizontal_speed\":0.0,\"latitude\":0.0,\"longitude\":0.0,\"mode_code\":0,\"total_flight_distance\":0.0,\"total_flight_time\":0.0,\"vertical_speed\":0.0,\"wind_direction\":0,\"wind_speed\":0.0,\"position_state\":{\"gps_number\":0,\"is_fixed\":0,\"quality\":0,\"rtk_number\":0},\"storage\":{\"total\":0,\"used\":0},\"height_limit\":0,\"distance_limit_status\":{\"state\":0,\"distance_limit\":0},\"track_id\":\"\",\"payload\":[]},\"sn\":\"1ZNBJ9K00C00E4\"},\"biz_code\":\"device_osd\"}"
// "{\"version\":\"1.0\",\"timestamp\":1727951858450,\"data\":{\"host\":{\"attitude_head\":-55.7,\"attitude_pitch\":0.4,\"attitude_roll\":-1.7000000000000002,\"elevation\":0.0,\"battery\":{\"batteries\":[{\"firmware_version\":\"01.02.05.44\",\"index\":0,\"loop_times\":91,\"capacity_percent\":42,\"sn\":\"1Z6PK1FFA300JQ\",\"sub_type\":0,\"temperature\":24.8,\"type\":0,\"voltage\":45744},{\"firmware_version\":\"01.02.05.44\",\"index\":1,\"loop_times\":92,\"capacity_percent\":42,\"sn\":\"1Z6PK1DFA300DC\",\"sub_type\":0,\"temperature\":24.5,\"type\":0,\"voltage\":45768}],\"capacity_percent\":42,\"landing_power\":5,\"remain_flight_time\":0,\"return_home_power\":0},\"firmware_version\":\"09.00.0503\",\"gear\":1,\"height\":102.96147,\"home_distance\":0.0,\"horizontal_speed\":0.0,\"latitude\":0.0,\"longitude\":0.0,\"mode_code\":0,\"total_flight_distance\":0.0,\"total_flight_time\":0.0,\"vertical_speed\":0.0,\"wind_direction\":0,\"wind_speed\":0.0,\"position_state\":{\"gps_number\":0,\"is_fixed\":0,\"quality\":0,\"rtk_number\":0},\"storage\":{\"total\":0,\"used\":0},\"height_limit\":0,\"distance_limit_status\":{\"state\":0,\"distance_limit\":0},\"track_id\":\"\",\"payload\":[]},\"sn\":\"1ZNBJ9K00C00E4\"},\"biz_code\":\"device_osd\"}"


  return (
    <Flex flexDir={'column'} p={4}>
      <ModuleCard text={"License Verified"} loaded={licenseVerified} />
      <ModuleCard text={"Signed In"} loaded={loggedIn} />
      <ModuleCard text={"Aircraft Bound"} loaded={bound} />
      <ModuleCard text={"API"} loaded={isApiLoaded} />
      <ModuleCard text={"Map"} loaded={isMapLoaded} />
      <ModuleCard text={"WS"} loaded={isWsLoaded} />
      <ModuleCard text={"Cloud"} loaded={isThingLoaded} />
      <ModuleCard text={"TSA"} loaded={isTsaLoaded} />
    </Flex>
  );
}

export default PilotApp;
