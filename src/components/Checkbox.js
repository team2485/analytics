import styles from "./Checkbox.module.css";
export default function Checkbox ({ visibleName, internalName }) {
    return (
        <div className={styles.boxContainer}>
            <div className={styles.box}>
                <input type="checkbox" id={internalName}></input>
                <label htmlFor={internalName}>{visibleName}</label>
            </div>
        </div>
    )
}
