'use strict';

var electron = require('electron');
var path = require('path');
var rxjs = require('rxjs');
var playwrightTranslator = require('playwright-translator');
var Playwright = require('playwright');
var url = require('url');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const ClipboardBehaviorSubject = new rxjs.BehaviorSubject('');
let subscription$ = undefined;
const startListening = () => {
    subscription$ = rxjs.interval(500)
        .pipe(rxjs.switchMap((value) => {
        const previousValue = ClipboardBehaviorSubject.getValue();
        const currentClipboardText = electron.clipboard.readText('clipboard');
        const isChanged = previousValue !== currentClipboardText;
        if (isChanged) {
            console.log("Pipp ee : ", currentClipboardText);
            return rxjs.from([currentClipboardText]);
        }
        return rxjs.from([]);
    }))
        .subscribe((clipboardText) => {
        ClipboardBehaviorSubject.next(clipboardText);
    });
};
const stopListening = () => {
    subscription$ === null || subscription$ === void 0 ? void 0 : subscription$.unsubscribe();
};
const ClipboardListenerObservable = ClipboardBehaviorSubject.asObservable();

const EVENT_TRANSLATE_ADDED = 'event-translate-added';
const EVENT_TRANSLATE_RESULT_RESPONSE = 'event-translate-result-response';
const EVENT_INIT_FINISH = "event-init-finish";

let playwrightBrowser = undefined;
let playwrightServices = [];
function setupEvents(win) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield Playwright.chromium.launch({ headless: true, devtools: false });
        const translateServices = [
            new playwrightTranslator.PlaywrightGoogleTranslator(browser),
            new playwrightTranslator.PlaywrightYoudaoTranslator(browser),
            new playwrightTranslator.PlaywrightDeepLTranslator(browser),
            new playwrightTranslator.PlaywrightBaiduTranslator(browser),
        ];
        yield Promise.all(translateServices.map((translator) => {
            return translator.init().catch((error) => {
                console.error("Init Transaltor Error : ", error);
            });
        }));
        playwrightServices = translateServices;
        playwrightBrowser = browser;
        console.log("Clipboard Listening ........ ");
        startListening();
        ClipboardListenerObservable
            .pipe(rxjs.switchMap((text) => {
            win.webContents.send(EVENT_TRANSLATE_ADDED, text);
            console.log("Run Clip baord ", text);
            const builders = translateServices.map((translator) => (({ translator, text })));
            return rxjs.from(builders);
        }), rxjs.map((builder) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let result = "";
            try {
                result = yield ((_a = builder.translator) === null || _a === void 0 ? void 0 : _a.translate(builder.text));
            }
            catch (e) {
                result = 'Error : ' + e;
                yield ((_b = builder.translator) === null || _b === void 0 ? void 0 : _b.reloadPage());
                // throw e
                // builder.translator?.init().catch(error => console.error("Error Init : ", error))
            }
            builder.result = result;
            return builder;
        })), rxjs.concatMap((builder) => {
            return builder;
        }))
            .subscribe((builder) => {
            win.webContents.send(EVENT_TRANSLATE_RESULT_RESPONSE, builder.result);
        });
        win.webContents.send(EVENT_INIT_FINISH);
    });
}
function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, "../public/index.html"),
        protocol: "file",
        slashes: true,
    });
    const window = new electron.BrowserWindow({
        width: 800,
        height: 500,
        // frame: false,
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload/preload.js')
        }
    });
    // window.webContents.toggleDevTools()
    window.loadURL(startUrl);
    // window.loadURL('http://localhost:3000')
    return window;
}
let window = undefined;
electron.app.whenReady().then(() => __awaiter(void 0, void 0, void 0, function* () {
    window = createWindow();
    window.show();
    console.log("Show Finish ..");
    yield setupEvents(window);
    electron.app.on('window-all-closed', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Run Before Quit ...");
        // })
        // window.on('close', async () => {
        window = undefined;
        console.log("Stop Listening Clipboard ... ");
        stopListening();
        console.log("Service Page Closing....");
        yield Promise.all(playwrightServices.map((service) => {
            return service.close();
        }));
        console.log("Service Page Closed");
        console.log("Playwright Quiting ... ");
        yield (playwrightBrowser === null || playwrightBrowser === void 0 ? void 0 : playwrightBrowser.close());
        console.log("App Quiting ...");
        electron.app.quit();
        if (process.platform !== 'darwin') {
            console.log('if you see this message - all windows was closed');
            electron.app.quit();
        }
        console.log("App Closed");
    }));
}));
// app.on('window-all-closed',async () => {
//     console.log("Run Window All Close...")
//     // On macOS it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== 'darwin') {
//       console.log('if you see this message - all windows was closed')
//       app.quit()
//     } 
//   })
