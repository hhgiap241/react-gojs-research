export function init(payload?: any) {
  return {
    type: "INIT",
    payload
  }
}

export function changeControl(payload?: any) {
  return {
    type: "CHANGE_CONTROL",
    payload
  }
}
