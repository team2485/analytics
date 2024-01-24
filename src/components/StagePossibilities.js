import styles from './StagePossibilities.module.css'

export default function StagePossibilities () {
    return (
        <div className={styles.stagePossibilities}>
            <div className={styles.option}>
                <input name="Stage" type="radio" id="None"></input>
                <label htmlFor="None">None</label>
            </div>
            <div className={styles.option}>
                <input name="Stage" type="radio" id="Park"></input>
                <label htmlFor="Park">Park</label>
            </div>
            <div className={styles.option}>
                <input name="Stage" type="radio" id="OnstageFailAndPark"></input>
                <label htmlFor="OnstageFailAndPark">Fail + Park</label>
            </div>
            <div className={styles.option}>
                <input name="Stage" type="radio" id="OnstageSuccess"></input>
                <label htmlFor="OnstageSuccess">Onstage</label>
            </div>
            <div className={styles.stagePlacement}>
                <div className={styles.option}>
                    <input name="StagePlacement" type="radio" id="CenterStage"></input>
                    <label htmlFor="CenterStage">Center</label>
                </div>
                <div className={styles.option}>
                    <input name="StagePlacement" type="radio" id="SideStage"></input>
                    <label htmlFor="SideStage">Side</label>
                </div>
            </div>
            <div className={styles.checkOption}>
                <input type="checkbox" id="Harmony"></input>
                <label htmlFor="Harmony">Harmony?</label>
            </div>
        </div>
    )
}