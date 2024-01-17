import styles from './StagePossibilities.module.css'

export default function StagePossibilities () {
    return (
        <div className='stagePossibilities'>
            <div>
                <input name="Stage" type="radio" id="None"></input>
                <label htmlFor="None">None</label>
            </div>
            <div>
                <input name="Stage" type="radio" id="OnstageAttempt"></input>
                <label htmlFor="OnstageAttempt">Onstage Attempt</label>
            </div>
            <div>
                <input type="checkbox" id="Park"></input>
                <label htmlFor="Park">Park?</label>
            </div>
            <div>
                <input name="Stage" type="radio" id="OnstageSuccess"></input>
                <label htmlFor="OnstageSuccess">Onstage Success</label>
            </div>
            <div>
                <input name="StagePlacement" type="radio" id="CenterStage"></input>
                <label htmlFor="CenterStage">Center</label>
            </div>
            <div>
                <input name="StagePlacement" type="radio" id="SideStage"></input>
                <label htmlFor="SideStage">Side</label>
            </div>
            <div>
                <input type="checkbox" id="Harmony"></input>
                <label htmlFor="Harmony">Harmony?</label>
            </div>
        </div>
    )
}