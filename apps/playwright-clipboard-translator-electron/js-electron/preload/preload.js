'use strict';

var electron = require('electron');

const EVENT_TRANSLATE_ADDED = 'event-translate-added';
const EVENT_TRANSLATE_RESULT_RESPONSE = 'event-translate-result-response';

const electron_ipc_handler_expose = {
    test_add_translate: (text) => electron.ipcRenderer.send('test-add', text),
    handle_text_for_translate_add: (callback) => electron.ipcRenderer.on(EVENT_TRANSLATE_ADDED, callback),
    off_handle_text_for_translate_added: () => electron.ipcRenderer.removeAllListeners(EVENT_TRANSLATE_ADDED),
    handle_translate_response: (callback) => electron.ipcRenderer.on(EVENT_TRANSLATE_RESULT_RESPONSE, callback),
    off_translate_response: () => electron.ipcRenderer.removeAllListeners(EVENT_TRANSLATE_RESULT_RESPONSE)
    // removeAllListener: () => ipcRenderer.removeAllListeners
};
electron.contextBridge.exposeInMainWorld('electron_ipc', electron_ipc_handler_expose);
