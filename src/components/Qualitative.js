import styles from './Qualitative.module.css'

export default function Qualitative ({ visibleName, internalName}) {
    return (
        <div className={styles.qual}>
            <label htmlFor={internalName}>{visibleName}</label>
            <div>★</div>
            <div>★</div>
            <div>★</div>
            <div>★</div>
            <button>Clear</button>
        </div>
    )
}