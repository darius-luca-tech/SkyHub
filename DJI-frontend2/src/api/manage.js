import { HTTP_PREFIX, DRC_API_PREFIX } from "./config"
import { AppState } from "./enums"

const defaultHeaders = () => {
  return {
    "x-auth-token": AppState.token,
    "Content-Type": "application/json"
  }
}

const login = async (username, password, flag) => {
  const url = `${HTTP_PREFIX}/login`
  const result = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password,
      flag: flag,
    })
  })

  return await result.json()

}

const refreshToken = async () => {
  const url = `${HTTP_PREFIX}/token/refresh`
  const result = await fetch(url, {
    method: "POST",
    headers: defaultHeaders()
  })
  return await result.json()
}

/**
 * Bind Device
 * @param {{device_sn: string, user_id: string, workspace_id: string}} body 
 * @returns 
 */
const bindDevice = async function (body) {
  const url = `${HTTP_PREFIX}/devices/${body.device_sn}/binding`
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: defaultHeaders()
  })
  return await result.json()
}

// Get Platform Info
const getPlatformInfo = async function () {
  const url = `${HTTP_PREFIX}/workspaces/current`
  const result = await fetch(url, {
    headers: defaultHeaders()
  })
  return await result.json()
}

const getBindingDevices = async function (workspace_id, page, page_size, domain) {
  console.log("gettingBoundDevices", workspace_id)
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/bound?page=${page}&page_size=${page_size}&domain=${domain}`
  const result = await fetch(url, {
    method: "GET",
    headers: defaultHeaders()
  })

  return await result.json()
}

const getDeviceBySn = async function (workspace_id, device_sn) {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/${device_sn}`
  const result = await fetch(url, {
    method: "GET",
    headers: defaultHeaders()
  })

  return await result.json()
}

const getUserInfo = async function () {
  const url = `${HTTP_PREFIX}/users/current`
  console.log("Token: ", defaultHeaders())
  const result = await fetch(url, { headers: defaultHeaders() })
  return await result.json()
}

const getDeviceTopo = async function (workspace_id) {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices`
  console.log("JWT debug" + url)
  const result = await fetch(url, { headers: defaultHeaders() })
  return await result.json()
}

const updateDevice = async function(body) {
  const url = `${HTTP_PREFIX}/devices/${body.workspace_id}/devices/${body.device_sn}`
  const result = await fetch(url, {
      method: "PUT",
      headers: defaultHeaders(),
      body: JSON.stringify(body)
  })

  return await result.json()
}

const getDeviceStatus = async function(workspace_id) {
  const url = `http://192.168.75.5:6789/map/api/v1/workspaces/${workspace_id}/device-status`
  const result = await fetch(url, {
    headers: defaultHeaders()
  })
}

const postDrc = async function(body, workspaceId) {
  const url = `${DRC_API_PREFIX}/workspaces/${workspaceId}/drc/connect`
  const result = await fetch(url, {
    method: "POST",
    headers: defaultHeaders(),
    body: JSON.stringify(body)
  })

  return await result.json()
}


export {
  login,
  refreshToken,
  bindDevice,
  getBindingDevices,
  getPlatformInfo,
  getUserInfo,
  getDeviceBySn,
  getDeviceTopo,
  updateDevice,
  getDeviceStatus,
  postDrc
}