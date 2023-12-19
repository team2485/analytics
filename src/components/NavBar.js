import Link from "next/link";
import styles from "./NavBar.module.css";

export default function NavBar() {
    return <nav className={styles.navbar}>
        <img className={styles.logo} src="https://static.wixstatic.com/media/c08dbc_367a25c2a9cd4d5b82a8cef1f6347d5c~mv2_d_1667_1667_s_2.png/v1/fill/w_80,h_83,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/defaultyellow.png"></img>
        <div className={styles.pages}>
            <Link href="/">Scouting Form</Link>
            <Link href="/team-view">Team View</Link>
            <Link href="/match-view">Match View</Link>
            <Link href="/picklist">Picklist</Link>
        </div>
    </nav>
}