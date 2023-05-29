import { BaseTranslator } from "./base-translator";

export class PlaywrightBaiduTranslator extends BaseTranslator {
    async init(){
        if ( !this.page ){
            this.page = await this.browser.newPage()
        }
        await this.page.goto('https://fanyi.baidu.com/#jp/zh/', { waitUntil: 'domcontentloaded', timeout: 0})
        // await this.page.goto('https://fanyi.baidu.com/#jp/zh/', { waitUntil: 'domcontentloaded', timeout: 0})

        const app_guide = await this.page.$('div#app-guide span.app-guide-close')
        app_guide?.click()
    }

    async translate(text: string): Promise<string> {
        const clearbtns = await this.page.$$('a.textarea-clear-btn')
        if (clearbtns.length){
            await Promise.all(clearbtns.map((btn) => btn.click()))
        }

        const source_dom = await this.page.locator('textarea#baidu_translate_input')

        
        await source_dom.type(text, {delay: 50})
        
        const error_prompt = await this.page.$('div#long-text-prompt-wrap p', ).then(element => element?.textContent())
        if ( error_prompt ){
            throw new Error(error_prompt || "Baidu error ")
        }

        const result_dom = await this.page.waitForSelector('div.output-bd',{timeout : this.outputTimeout  })
       
        // await result_dom.waitFor({ state: "attached" })
        
        const result = await result_dom.innerText()
        await this.delay(1000)
        await source_dom.fill("")
        await this.delay(500)
        return 'B: ' +  result
    }
}