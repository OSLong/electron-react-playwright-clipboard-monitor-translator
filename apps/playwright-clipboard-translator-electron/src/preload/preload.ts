import  { contextBridge, ipcRenderer } from 'electron'
import { EVENT_TRANSLATE_RESULT_RESPONSE, EVENT_TRANSLATE_ADDED } from  '@src/constants'
import { IpcRendererEvent } from 'electron'

type IpcRendererListener =  ( event: IpcRendererEvent,  ...args: any[]) => void



const electron_ipc_handler_expose = {
    test_add_translate: (text: string) => ipcRenderer.send('test-add', text),

    handle_text_for_translate_add: (callback: IpcRendererListener) => ipcRenderer.on(EVENT_TRANSLATE_ADDED, callback),

    off_handle_text_for_translate_added: () => ipcRenderer.removeAllListeners(EVENT_TRANSLATE_ADDED),

    handle_translate_response: (callback: IpcRendererListener) => ipcRenderer.on(EVENT_TRANSLATE_RESULT_RESPONSE, callback),

    off_translate_response: () => ipcRenderer.removeAllListeners(EVENT_TRANSLATE_RESULT_RESPONSE)
     
    // removeAllListener: () => ipcRenderer.removeAllListeners
}

export type ElectronIPCRendererExpose =  typeof electron_ipc_handler_expose

contextBridge.exposeInMainWorld('electron_ipc', electron_ipc_handler_expose)

