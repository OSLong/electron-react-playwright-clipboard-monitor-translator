import { BrowserWindow, IpcMainEvent, app, ipcMain , clipboard , protocol  } from 'electron'
import { join } from 'path'
import { concatMap, from, interval, map, of, retry, Subject, switchMap } from 'rxjs'
import * as RxClipboardListener from './clipboard-listener'
import { BaseTranslator ,EmptyTranslator,PlaywrightGoogleTranslator, PlaywrightBaiduTranslator, PlaywrightYoudaoTranslator, PlaywrightDeepLTranslator } from 'playwright-translator'
import Playwright, { Browser, errors } from 'playwright'
import { EVENT_INIT_FINISH, EVENT_TRANSLATE_ADDED, EVENT_TRANSLATE_RESULT_RESPONSE } from './constants'
import url from 'url'
import path from 'path'

interface TranslatorBuilder {
    translator?: BaseTranslator
    text?: string 
    result?: string
}

let playwrightBrowser: Browser | undefined = undefined
let playwrightServices : Array<BaseTranslator> = [] 

async function setupEvents(win: BrowserWindow) {
    
    const browser = await Playwright.chromium.launch({ headless: true, devtools: false})

    const translateServices: Array<BaseTranslator> = [
        new PlaywrightGoogleTranslator(browser),
        new PlaywrightYoudaoTranslator(browser),
        new PlaywrightDeepLTranslator(browser),
        new PlaywrightBaiduTranslator(browser),
    ]
    await Promise.all(translateServices.map( (translator) => {
        return translator.init().catch((error)=> {
            console.error("Init Transaltor Error : ", error)
        })
    }))

    playwrightServices = translateServices
    playwrightBrowser = browser
    
    console.log("Clipboard Listening ........ ")

    RxClipboardListener.startListening()
    RxClipboardListener
        .ClipboardListenerObservable
        .pipe(
            switchMap((text) => {
                win.webContents.send(EVENT_TRANSLATE_ADDED, text)
                console.log("Run Clip baord ", text)
                const builders : TranslatorBuilder[] = translateServices.map((translator) => (({translator, text}))) 
                return from(builders)
                
            }),
            map( async  (builder) => {
                let result = ""
                try {
             
                    result = await builder.translator?.translate(builder.text!)!
                } catch (e) {
                    result = 'Error : ' + e
                    await builder.translator?.reloadPage()
                    // throw e
                    // builder.translator?.init().catch(error => console.error("Error Init : ", error))
                }
           
                builder.result = result
                return builder
            }),

            concatMap((builder) => {
                return builder
            })
        )
        .subscribe((builder) => {
            win.webContents.send(EVENT_TRANSLATE_RESULT_RESPONSE, builder.result)
        })

    win.webContents.send(EVENT_INIT_FINISH)



}

function createWindow (): BrowserWindow {

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, "../public/index.html"),
        protocol: "file",
        slashes: true,
      })
    const window = new BrowserWindow({
        width: 800,

        height: 500,
        // frame: false,
        alwaysOnTop: true,
        transparent: true, 
        webPreferences: {
            preload: join(__dirname, 'preload/preload.js' )
        }
    })

    // window.webContents.toggleDevTools()
    
    window.loadURL(startUrl )
    // window.loadURL('http://localhost:3000')

    return window 
}

let window : BrowserWindow | undefined = undefined

app.whenReady().then(async () => {
    
    window = createWindow()
   
    window.show()

    console.log("Show Finish ..")

    await setupEvents(window!)

    app.on('window-all-closed', async () => {
        console.log("Run Before Quit ...")
    // })
    // window.on('close', async () => {
        window = undefined

        console.log("Stop Listening Clipboard ... ")
        RxClipboardListener.stopListening()

        console.log("Service Page Closing....")
        await Promise.all(playwrightServices.map((service) => {
            return service.close()
        }))
        console.log("Service Page Closed")


        console.log("Playwright Quiting ... ")
        await playwrightBrowser?.close()
        
        console.log("App Quiting ...")
        app.quit()

        if (process.platform !== 'darwin') {
            console.log('if you see this message - all windows was closed')
            app.quit()
        } 
        console.log("App Closed")
    })
})


// app.on('window-all-closed',async () => {
//     console.log("Run Window All Close...")
//     // On macOS it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== 'darwin') {
//       console.log('if you see this message - all windows was closed')
//       app.quit()

//     } 
//   })