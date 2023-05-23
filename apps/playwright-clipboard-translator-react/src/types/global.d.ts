import { ElectronIPCRendererExpose } from 'playwright-clipboard-translator-electron/dist/preload/preload'


// type ElectronIPC = {
//     test_add_translate: (text: string) => void 

//     handle_translate_response: (callback: HandleTranslateCallback) => void

//     off_translate_response: (callback: HandleTranslateCallback) =>  void
// }

declare global {
  
    interface Window {
        // electron_ipc:  {
        //     test_add_translate: (text: string) => void 
        
        //     handle_translate_response: (callback: HandleTranslateCallback) => void
        
        //     off_translate_response: (callback: HandleTranslateCallback) =>  void
        // }
        electron_ipc: ElectronIPCRendererExpose
    }
}

export { }
