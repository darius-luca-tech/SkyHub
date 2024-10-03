import { CURRENT_CONFIG } from "../api/config"
import { AppState } from "../api/enums"
import { createBinding, checkToken, verifyLicense, apiPilot, connectCallback, wsConnectCallback, getDeviceInfo, messageHandler } from '../api/pilot';


export function getWebsocketUrl (token) {
  // const token = apiPilot.getToken()
  console.log("Initializing WebSocket with Token:", AppState.token);


  const url = CURRENT_CONFIG.websocketURL + '?x-auth-token=' + encodeURI(token)
  return url
}