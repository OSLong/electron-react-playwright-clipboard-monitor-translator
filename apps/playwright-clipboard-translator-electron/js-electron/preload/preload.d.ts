import { IpcRendererEvent } from 'electron';
type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void;
declare const electron_ipc_handler_expose: {
    test_add_translate: (text: string) => void;
    handle_text_for_translate_add: (callback: IpcRendererListener) => Electron.IpcRenderer;
    off_handle_text_for_translate_added: () => Electron.IpcRenderer;
    handle_translate_response: (callback: IpcRendererListener) => Electron.IpcRenderer;
    off_translate_response: () => Electron.IpcRenderer;
    on_init_finish: (callback: IpcRendererListener) => void;
};
export type ElectronIPCRendererExpose = typeof electron_ipc_handler_expose;
export {};
