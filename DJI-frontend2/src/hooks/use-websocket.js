import { useEffect, useState } from "react";
import ReconnectingWebSocket from 'reconnecting-websocket';
import { EBizCode } from "../api/enums";
import { getWebsocketUrl } from "../utils/websocket";

export const useWebsocket = (token) => {
  const [payload, setPayload] = useState({});

  useEffect(() => {
    if (!token) return; // Only create WebSocket if token is available

    const webSocket = new ReconnectingWebSocket(getWebsocketUrl(token), [], {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      maxRetries: 5,
    });

    const onOpen = () => {
      console.log('WebSocket Connection Opened');
    };

    const onClose = () => {
      console.log('WebSocket Connection Closed');
    };

    const onError = (error) => {
      console.error('WebSocket Error:', error);
    };

    const onMessage = (msg) => {
      // console.log("WE ARE RECEIVING SOMETHING:", msg)
      const data = JSON.parse(msg.data);

      if (!data) {
        return;
      }

      switch (data.biz_code) {
        case EBizCode.DeviceOnline:
          const deviceOnline = {
            ...payload,
            [data.data.sn]: data.data,
          };
          setPayload(deviceOnline);
          break;
        
        case EBizCode.DeviceOsd:
          console.log("Device " + data.data)
          const DeviceOsd = {
            ...payload,
            [data.data.sn]: data.data,
          };
          setPayload(DeviceOsd);

        default:
          break;
      }
    };

    webSocket.addEventListener('open', onOpen);
    webSocket.addEventListener('close', onClose);
    webSocket.addEventListener('error', onError);
    webSocket.addEventListener('message', onMessage);


  }, [token]); // Only run effect when token changes

  return payload;
};
