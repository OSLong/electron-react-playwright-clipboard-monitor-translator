import { BaseTranslator } from "./base-translator";

export class EmptyTranslator extends BaseTranslator {
    async init(){
        // this.page = await this.browser.newPage()
        // await this.page.goto('https://translate.google.com/?sl=en&tl=zh-CN', { waitUntil: 'domcontentloaded'})
    }

    async translate(text: string): Promise<string> {
        return "Empty"
        // const source_dom = await this.page.locator('textarea[aria-label="Source text"]')
        // const result_dom = await this.page.locator('div[aria-live="polite"] > div:first-child > div:first-child')
        
        // await source_dom.fill(text)
        // // await this.page.waitForResponse((response) => {
        // //     const response_url = response.url()
        // //     // console.log("Check  One ONe ", response_url,)
        // //     return response.url().includes('batchexecute')
        // // })
        // // await delay(100)
        // // console.log("Soorce Dom Inner ", await source_dom.inputValue())
        // // await result_dom.wai
        // await result_dom.waitFor({ state: "attached" })
        // // await this.page.waitForSelector('div[aria-live="polite"] > div:first-child > div:first-child',)
        // const result = await result_dom.innerText()
        // await source_dom.fill("")
        // return  result
    }
}