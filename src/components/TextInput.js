import styles from './TextInput.module.css'
export default function TextInput ({ visibleName, internalName }) {
    return (
        <div className={styles.TextInput}>
            <label className={styles.font} htmlFor={internalName}>{visibleName}</label>
            <br></br>
            <input type="text" id={internalName}></input>
            <br></br>
        </div>
    )
}
