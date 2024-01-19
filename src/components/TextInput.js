import styles from './TextInput.module.css'
export default function TextInput ({ visibleName, internalName }) {
    return (
        <div>
            <label htmlFor={internalName}>{visibleName}</label>
            <br></br>
            <input type="text" id={internalName} className={styles.textinput}></input>
        </div>
    )
}
