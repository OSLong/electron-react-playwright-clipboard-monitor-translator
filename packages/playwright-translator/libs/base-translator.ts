import { Browser, BrowserContext, BrowserType, Page, chromium } from 'playwright'

export abstract class BaseTranslator{
    protected page!: Page

    protected outputTimeout = 10 * 1000 

    constructor(
        protected browser: BrowserContext
        ){
        
    }

    async reloadPage(){
        await this.page.reload({waitUntil: 'domcontentloaded'}).catch(error => console.error("Error : ",error))
    }

    async init(){
        throw new Error("Not Implement ")
    }

    async translate(text: string): Promise<string> {
        throw new Error("Not Implement ")
    }

    delay(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(undefined)
            }, ms);
        })
    }    

    close(){
        return this.page.close({ runBeforeUnload: false })
    }
}