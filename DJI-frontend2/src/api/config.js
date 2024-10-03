const IP_ADDRESS = '192.168.240.5:6789'

const CURRENT_CONFIG = {
  // Office - 10.5.3.82
  // license
  appId: process.env.REACT_APP_APP_ID, // You need to go to the development website to apply.
  appKey: process.env.REACT_APP_APP_KEY, // You need to go to the development website to apply.
  appLicense: process.env.REACT_APP_APP_LICENSE, // You need to go to the development website to apply.

  // http
  baseURL: `http://${IP_ADDRESS}/`, // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  websocketURL: `ws://${IP_ADDRESS}/api/v1/ws`,  // Example: 'ws://192.168.1.1:6789/api/v1/ws'

  // livestreaming
  // RTMP  Note: This IP is the address of the streaming server. If you want to see livestream on web page, you need to convert the RTMP stream to WebRTC stream.
  rtmpURL: `rtmp://192.168.240.5/live/`,  // Example: 'rtmp://192.168.1.1/live/' 
  // GB28181 Note:If you don't know what these parameters mean, you can go to Pilot2 and select the GB28181 page in the cloud platform. Where the parameters same as these parameters.

}


const HTTP_PREFIX = `http://${IP_ADDRESS}/manage/api/v1`
const DRC_API_PREFIX = `http://${IP_ADDRESS}/control/api/v1`


export {
  HTTP_PREFIX,
  CURRENT_CONFIG,
  DRC_API_PREFIX
}