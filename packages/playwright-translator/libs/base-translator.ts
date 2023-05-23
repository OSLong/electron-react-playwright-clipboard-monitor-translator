import { Browser, BrowserType, Page, chromium } from 'playwright'

export abstract class BaseTranslator{
    protected page!: Page

    protected outputTimeout = 5 * 1000 

    constructor(
        protected browser: Browser
        ){
        
    }

    async reloadPage(){
        await this.page.reload({waitUntil: 'domcontentloaded'})
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
}