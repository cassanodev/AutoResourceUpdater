export const openExternal = (url: string) => {
  window.electronAPI.openExternal(url);
};