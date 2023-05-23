import { BaseTranslator } from "./base-translator";

export class PlaywrightGoogleTranslator extends BaseTranslator {
    async init(){

        if ( !this.page ){
            this.page = await this.browser.newPage()
        }
        await this.page.goto('https://translate.google.com/?sl=ja&tl=zh-CN', { waitUntil: 'domcontentloaded', timeout: 0})
    }

    async translate(text: string): Promise<string> {
        const source_dom = await this.page.locator('textarea[aria-label="Source text"]')
        const result_dom = await this.page.locator('div[aria-live="polite"] > div:first-child > div:first-child')
        
        await source_dom.fill(text)
        await result_dom.waitFor({ state: "attached", timeout:  this.outputTimeout  })
        const result = await result_dom.innerText()
        await source_dom.fill("")
        return 'G: ' + result
    }
}