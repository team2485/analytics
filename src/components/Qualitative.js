import styles from './Qualitative.module.css'

export default function Qualitative ({ visibleName, internalName, symbol="★"}) {
    return (
        <div className={styles.qual}>
            <br></br>
            <label htmlFor={internalName}>{visibleName}</label>
            <hr></hr>
            <div className={styles.ratings}>
                <div className={styles.symbol}>{symbol}</div>
                <div className={styles.symbol}>{symbol}</div>
                <div className={styles.symbol}>{symbol}</div>
                <div className={styles.symbol}>{symbol}</div>
                <div className={styles.symbol}>{symbol}</div>
                <div className={styles.symbol}>{symbol}</div>
            </div>
            <button>Clear</button>
        </div>
    )
}