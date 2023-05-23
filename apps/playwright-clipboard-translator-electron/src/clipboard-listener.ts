import { BehaviorSubject, Observable, Subscription, from, interval, switchMap } from 'rxjs'
// import clipboardy from 'node-clipboardy'
// // const clipboardy: any = import('clipboardy')
import electron from 'electron'

const ClipboardBehaviorSubject = new BehaviorSubject<string>('')

let subscription$: Subscription | undefined = undefined

export const startListening = () => {
    subscription$ = interval(500)
        .pipe(
            switchMap( (value: number) => {
                const previousValue = ClipboardBehaviorSubject.getValue()
                const currentClipboardText =  electron.clipboard.readText('clipboard')
                const isChanged = previousValue !== currentClipboardText
                if ( isChanged){
                    console.log("Pipp ee : ", currentClipboardText)
                    return from([currentClipboardText])
                }
                return from([])
            })
        )
        .subscribe((clipboardText: string) => {
            ClipboardBehaviorSubject.next(clipboardText)
        })
}

export const stopListening = () => {
    subscription$?.unsubscribe()
}

export const ClipboardListenerObservable = ClipboardBehaviorSubject.asObservable()



