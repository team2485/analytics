import styles from "./Header.module.css";
export default function Header ({ headerName }) {
    return (
        <div className={styles.header}>
            <h1>{headerName}</h1>
            <hr></hr>
        </div>
    )
}
