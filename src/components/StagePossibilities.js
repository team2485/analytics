import { useEffect, useState } from 'react';
import styles from './StagePossibilities.module.css'

export default function StagePossibilities () {

    const [endLocation, setEndLocation] = useState(0);
    const [centerOrSide, setCenterOrSide] = useState(0);
    const [harmony, setHarmony] = useState(false);

    useEffect(() => {
        if (harmony && endLocation != 3) setHarmony(false);
    }, [harmony]);

    return (
        <div className={styles.stagePossibilities}>
            <div className={styles.option + ( endLocation == 0 ? " " + styles.checked : "")} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="None" value={0} defaultChecked onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="None">None</label>
            </div>
            <div className={styles.option + ( endLocation == 1 ? " " + styles.checked : "")} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="Park" value={1} onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="Park">Park</label>
            </div>
            <div className={styles.option + ( endLocation == 2 ? " " + styles.checked : "")} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="OnstageFailAndPark" value={2} onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="OnstageFailAndPark">Fail + Park</label>
            </div>
            <div className={styles.option + ( endLocation == 3 ? " " + styles.checked : "")} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                <input name="endlocation" type="radio" id="OnstageSuccess" value={3} onChange={(e) => setEndLocation(e.target.value)}></input>
                <label htmlFor="OnstageSuccess">Onstage</label>
            </div>
            { endLocation == 3 &&
                <>
                    <div className={styles.stagePlacement}>
                        <div className={styles.option + ( centerOrSide == 0 ? " " + styles.checked : "")} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                            <input name="stageplacement" type="radio" id="CenterStage" value={0} defaultChecked onChange={(e) => setCenterOrSide(e.target.value)}></input>
                            <label htmlFor="CenterStage">Center</label>
                        </div>
                        <div className={styles.option + ( centerOrSide == 1 ? " " + styles.checked : "")} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                            <input name="stageplacement" type="radio" id="SideStage" value={1} onChange={(e) => setCenterOrSide(e.target.value)}></input>
                            <label htmlFor="SideStage">Side</label>
                        </div>
                    </div>
                    <div className={styles.checkOption + ( harmony ? " " + styles.checked : "" )} onClick={(e) => {e.target.querySelector("input")?.click();}}>
                        <input type="checkbox" id="Harmony" name="harmony" onChange={(e) => {setHarmony(e.target.checked)}}></input>
                        <label htmlFor="Harmony">Harmony?</label>
                    </div>
                </>
            }
        </div>
    )
}