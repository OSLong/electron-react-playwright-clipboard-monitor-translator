import React from 'react'
import styles from './styles.module.css'
import { useAppContext } from '../providers/AppProvider'

export default function MainWindow(props: React.PropsWithChildren){
    const appContext = useAppContext()
    
    if ( appContext.isIniting){
        return (
            <div className={styles.wrapper}>
                <div className={styles.translateContainer}>
                    <h1>Initializing ....</h1>
                </div>
            </div>
        ) 
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.translateContainer}>
                <div className={styles.translateSrc}>
                    {appContext.srcText}
                </div>

                {
                    appContext.resultList.map((result) => {
                        return (
                            <div className={styles.translateResult}>{result}</div>
                        )
                    })
                }
            </div>

         
        </div>
    )
}