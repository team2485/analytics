import styles from './Qualitative.module.css'

export default function Qualitative ({ visibleName, internalName, symbol="★"}) {
    return (
        <div className={styles.qual}>
            <label htmlFor={internalName}>{visibleName}</label>
            <div>{symbol}</div>
            <div>{symbol}</div>
            <div>{symbol}</div>
            <div>{symbol}</div>
            <button>Clear</button>
        </div>
    )
}