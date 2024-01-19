import styles from './TextInput.module.css'
export default function TextInput ({ visibleName, internalName }) {
    return (
        <div>
            <label className={styles.font} htmlFor={internalName}>{visibleName}</label>
            <br></br>
            <input type="text" id={internalName} className={styles.textinput}></input>
            <br></br>
        </div>
    )
}
