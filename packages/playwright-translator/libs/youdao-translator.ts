import { BaseTranslator } from "./base-translator";

export class PlaywrightYoudaoTranslator extends BaseTranslator {
    async init(){
        if ( !this.page ){
            this.page = await this.browser.newPage()
        }
        await this.page.goto('https://fanyi.youdao.com/index.html', { waitUntil: 'domcontentloaded', timeout: 0})

        const closeMask = await this.page.$('div.pop-up-comp img.close')
        await closeMask?.click()

        const arxiv_popup = await this.page.$('div.arxiv-pop-up div.never-show')
        await arxiv_popup?.click()

        const langFrom = await this.page.$('div.languageSelector-web')
        await langFrom?.click()

        const langFromSelector = await this.page.$('div.interfaceDialog div.specify-language-container div.language-item[data-code="ja"]')
        await langFromSelector?.click()

    }

    async translate(text: string): Promise<string> {
        const source_dom = await this.page.locator('div#js_fanyi_input')

        
        await source_dom.type(text, {delay: 10})
        
        const result_dom = await this.page.waitForSelector('div#js_fanyi_output_resultOutput', { timeout:  this.outputTimeout })

        // await result_dom.waitFor({ state: "attached" , timeout: 5000 })
        
        const result = await result_dom.innerText()
        // await this.delay(500)
        await source_dom.fill("")
        await this.delay(500)
        return 'Y: ' + result
    }
}