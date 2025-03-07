import { CURRENT_CONFIG } from './config';

const EVideoPublishType = {
  VideoOnDemand: 'video-on-demand',
  VideoByManual: 'video-by-manual',
  VideoDemandAuxManual: 'video-demand-aux-manual'
}

const ELocalStorageKey = {
  Username: 'username',
  WorkspaceId: 'workspace_id',
  Token: 'x-auth-token',
  PlatformName: 'platforEComponentNamem_name',
  WorkspaceName: 'workspace_name',
  WorkspaceDesc: 'workspace_desc',
  Flag: 'flag',
  UserId: 'user_id',
  Device: 'device',
  GatewayOnline: 'gateway_online',
}

const AppState = {
  workspace_id: null,
  device_sn: null,
  token: null,
  userId: null,
  username: null,
  flag: null,
};

const RTMPparam = {
  type: 2,
  videoPublishType: "video-demand-aux-manual",
  statusCallback: "liveStreamCallback",
  params: {
    url:  CURRENT_CONFIG.rtmpURL
  }
}

const LiveStreamStatus = {
  audioBitRate: -1,
  dropRate: -1,
  fps: -1,
  jitter: -1,
  quality: -1,
  rtt: -1,
  status: -1,
  type: -1,
  videoBitRate: -1
}

const ELiveTypeValue = {
  Unknown: "Unknown",
  Agora: "Agora",
  RTMP: "RTMP",
  RTSP: "RTSP",
  GB28181: "GB28181",
};

const ELiveTypeName = {
  Unknown : 'Unknown',
  Agora : 'Agora',
  RTMP : 'RTMP',
  RTSP : 'RTSP',
  GB28181 : 'GB28181'
}


const LiveTypeList = [
  {
    value: ELiveTypeValue.Agora,
    label: ELiveTypeName.Agora
  },
  {
    value: ELiveTypeValue.RTMP,
    label: ELiveTypeName.RTMP
  },
  {
    value: ELiveTypeValue.RTSP,
    label: ELiveTypeName.RTSP
  },
  {
    value: ELiveTypeValue.GB28181,
    label: ELiveTypeName.GB28181
  }
]

const PilotState = {
  workspace_id: null,
  device_sn: null,
  token: null,
  userId: null,
  username: null,
  flag: null,
}

const EUserType = {
  Web: 1,
  Pilot: 2,
}

const EStatusValue = {
  CONNECTED: 'Connected',
  DISCONNECT: 'Disconnect',
  LIVING: 'Living'
}

const ELiveStatusValue = {
  DISCONNECT: "Disconnect",
  CONNECTED: "Connected",
  LIVING: "Living"
}

const DOMAIN = {
  DRONE: '0', // 飞行器
  PAYLOAD:  '1', // 负载
  RC: '2', // 遥控
  DOCK: '3', // 机场
}

const EComponentName = {
  Thing: 'thing',
  Liveshare: 'liveshare',
  Api: 'api',
  Ws: 'ws',
  Map: 'map',
  Tsa: 'tsa',
  Media: 'media',
  Mission: 'mission'
}

const EPhotoType = {
  Original: 0,
  Preview: 1,
  Unknown: -1
}

const ERouterName = {
  ELEMENT: 'element',
  PROJECT: 'project',
  HOME: 'home',
  TSA: 'tsa',
  LAYER: 'layer',
  MEDIA: 'media',
  WAYLINE: 'wayline',
  LIVESTREAM: 'livestream',
  LIVING: 'living',
  WORKSPACE: 'workspace',
  MEMBERS: 'members',
  DEVICES: 'devices',
  TASK: 'task',
  CREATE_PLAN: 'create-plan',
  SELECT_PLAN: 'select-plan',

  PILOT: 'pilot-login',
  PILOT_HOME: 'pilot-home',
  PILOT_MEDIA: 'pilot-media',
  PILOT_LIVESHARE: 'pilot-liveshare',
  PILOT_BIND: 'pilot-bind'
}

const EBizCode = {
  GatewayOsd :'gateway_osd',
  DeviceOsd :'device_osd',
  DockOsd :'dock_osd',
  MapElementCreate :'map_element_create',
  MapElementUpdate :'map_element_update',
  MapElementDelete :'map_element_delete',
  DeviceOnline :'device_online',
  DeviceOffline :'device_offline',
  FlightTaskProgress :'flighttask_progress', // 机场任务执行进度
  DeviceHms :'device_hms',

  // 设备指令
  DeviceReboot :'device_reboot', // 机场重启
  DroneOpen :'drone_open', // 飞行器开机
  DroneClose :'drone_close', // 飞行器关机
  DeviceFormat :'device_format', // 机场数据格式化
  DroneFormat :'drone_format', // 飞行器数据格式化
  CoverOpen :'cover_open', // 打开舱盖
  CoverClose :'cover_close', // 关闭舱盖
  PutterOpen :'putter_open', // 推杆展开
  PutterClose :'putter_close', // 推杆闭合
  ChargeOpen :'charge_open', // 打开充电
  ChargeClose :'charge_close', // 关闭充电

  // 设备升级
  DeviceUpgrade :'ota_progress', // 设备升级

  // 设备日志
  DeviceLogUploadProgress :'fileupload_progress' // 设备日志上传上传
}

const EDownloadOwner = {
  Mine: 0,
  Others: 1,
  Unknown: -1
}

export {
  EComponentName,
  EPhotoType,
  EVideoPublishType,
  ERouterName,
  ELocalStorageKey,
  EUserType,
  EStatusValue,
  ELiveStatusValue,
  DOMAIN,
  EBizCode,
  EDownloadOwner,
  AppState,
  PilotState,
  RTMPparam,
  LiveTypeList,
  LiveStreamStatus,
  ELiveTypeValue

}