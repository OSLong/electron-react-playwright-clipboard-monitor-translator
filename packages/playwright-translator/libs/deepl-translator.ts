import { BaseTranslator } from "./base-translator";

export class PlaywrightDeepLTranslator extends BaseTranslator {
    async init(){
        if ( !this.page ){
            this.page = await this.browser.newPage()
        }
        await this.page.goto('https://www.deepl.com/en/translator#ja/zh/', { waitUntil: 'domcontentloaded', timeout: 0})
    }

    async translate(text: string): Promise<string> {
        const source_dom = await this.page.locator('div[aria-labelledby="translation-source-heading"]')
        
        await source_dom.fill(text)

        const result_dom = await this.page.locator('div[aria-labelledby="translation-results-heading"]', { hasText: /\S+/ })
        // await this.page.wai
        // result_dom.textContent()
        await result_dom.waitFor({ state: "attached", timeout:  this.outputTimeout  })
        const result = await result_dom.innerText()
        await source_dom.fill("")
        // await this.delay(1000)
        return 'D: ' + result
    }
}