import React, { useCallback, useState } from 'react'


interface AppContextValue {
    srcText: string,
    resultList: string[]
}

const Context = React.createContext<AppContextValue | undefined>(undefined)

export function AppProvider(props: React.PropsWithChildren) {
    const [srcText, setSrcText] = useState("")
    const [resultList, setResultList] = useState<string[]>([])

    const contextvalues: AppContextValue = {
        srcText,
        resultList
    }

    
    React.useEffect(() => {
        const onSrcTextAdded = (event: any, text:string) => {
            setResultList([])
            setSrcText(text)
        }

        const onResultResponse = (event: any, text: string) => {
            setResultList((prev) => {
                return prev.concat([text])
            })
        }

        window.electron_ipc.handle_text_for_translate_add(onSrcTextAdded)
        window.electron_ipc.handle_translate_response(onResultResponse)

        // window.electron_ipc.handle_translate_response((result: string) => {
        //     console.log("Resposne data back ", result)
        // })
        return () => {
            window.electron_ipc.off_handle_text_for_translate_added()
            window.electron_ipc.off_translate_response()
        }
    }, [])

    return (
        <Context.Provider value={contextvalues}>
            {props.children}
        </Context.Provider>
    )
}

export function useAppContext(): AppContextValue {
    const appContext = React.useContext(Context)

    if (appContext === undefined ) {
        throw new Error("Cannot Find Context.")
    }
    return appContext
}

