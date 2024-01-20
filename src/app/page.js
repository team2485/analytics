import TextInput from '@/components/TextInput';
import Header from '@/components/Header';
import Checkbox from '@/components/Checkbox';
import NumericInput from '@/components/NumericInput';
import StagePossibilities from '@/components/StagePossibilities';
import Qualitative from '@/components/Qualitative';
import CommentBox from '@/components/CommentBox';
import styles from './page.module.css';
import SubHeader from '@/components/SubHeader';

export default function Home() {
  return (
    <div className={styles.MainDiv}>
      <h1>Scouting Form</h1>
      <Header headerName={"Match Info"}/>
        <div className={styles.MatchInfo}>
          <TextInput visibleName={"Scout Name:"} internalName={"ScoutName"}/>
          <TextInput visibleName={"Team #:"} internalName={"TeamNum"}/>
          <TextInput visibleName={"Team # Scouted:"} internalName={"TeamNumScouted"}/>
          <TextInput visibleName={"Match #:"} internalName={"MatchNum"}/>
        </div>
        <Checkbox visibleName={"No Show"} internalName={"NoShow"}/>
        <div className={styles.Auto}>
          <Header headerName={"Auto"}/>
          <Checkbox visibleName={"Leave"} internalName={"Leave"}/>
          <div className={styles.AutoNotes}>
            <SubHeader subHeaderName={"Speaker"}/>
            <NumericInput noteType={"Success"} visibleName={"Success"} internalName={"AutoSpeakerSuccess"}/>
            <NumericInput noteType={"Fail"} visibleName={"Fail"} internalName={"AutoSpeakerFail"}/>
            <SubHeader subHeaderName={"Amp"}/>
            <NumericInput noteType={"Success"} visibleName={"Success"} internalName={"AutoAmpSuccess"}/>
            <NumericInput noteType={"Fail"} visibleName={"Fail"} internalName={"AutoAmpFail"}/>
          </div>
        </div>
        <div className={styles.Tele}>
          <Header headerName={"TeleOp"}/>
          <div className={styles.TeleNotes}>
            <SubHeader subHeaderName={"Speaker"}/>
            <div className={styles.TeleSpeakerSuccesses}>
              <NumericInput noteType={"Success"} visibleName={"Success"} internalName={"TeleSpeakerSuccess"}/>
              <NumericInput noteType={"Success"} visibleName={"Amplified Success"} internalName={"TeleAmplifiedSpeakerSuccess"}/>
            </div>
            <NumericInput noteType={"Fail"} visibleName={"Fail"} internalName={"TeleSpeakerFail"}/>
            <SubHeader subHeaderName={"Amp"}/>
            <NumericInput noteType={"Success"} visibleName={"Success"} internalName={"TeleAmpSuccess"}/>
            <NumericInput noteType={"Fail"} visibleName={"Fail"} internalName={"TeleAmpFail"}/>
          </div>
        </div>
        <div className={styles.Endgame}>
          <Header headerName={"Endgame"}/>
          <SubHeader subHeaderName={"Stage"}/>
          <StagePossibilities />
          <div className={styles.TrapNotes}>
            <SubHeader subHeaderName={"Trap"}/>
            <NumericInput noteType={"Success"} visibleName={"Success"} internalName={"TrapSuccess"}/>
            <NumericInput noteType={"Fail"} visibleName={"Fail"} internalName={"TrapFail"}/>
          </div>
        </div>
        <div className={styles.PostMatch}>
          <Header headerName={"Post Match"}/>
          <div className={styles.Qual}>
            <Qualitative visibleName={"Maneuverability"} internalName={"Maneuverability"}/>
            <Qualitative visibleName={"Aggression"} internalName={"Aggression"} symbol={"ⵔ"}/>
            <Qualitative visibleName={"Defense Evasion"} internalName={"DefenseEvasion"}/>
            <Qualitative visibleName={"Stage Hazard"} internalName={"StageHazard"} symbol={"ⵔ"}/>
            <Qualitative visibleName={"Amp Speed"} internalName={"AmpSpeed"}/>
            <Qualitative visibleName={"Speaker Speed"} internalName={"SpeakerSpeed"}/>
            <Qualitative visibleName={"Trap Speed"} internalName={"TrapSpeed"}/>
            <Qualitative visibleName={"Onstage Speed"} internalName={"OnstageSpeed"}/>
            <Qualitative visibleName={"Harmony Speed"} internalName={"HarmonySpeed"}/>
            <Qualitative visibleName={"Intake Speed"} internalName={"IntakeSpeed"}/>
          </div>
          <Checkbox visibleName={"Ground Intake"} internalName={"GroundIntake"}/>
          <Checkbox visibleName={"Human Player Intake"} internalName={"HumanPlayerIntake"}/>
          <Checkbox visibleName={"Breakdown"} internalName={"Breakdown"}/>
          <CommentBox visibleName={"Breakdown Elaboration"} internalName={"BreakdownElaboration"}/>
          <Checkbox visibleName={"Played Defense"} internalName={"Defense"}/>
          <CommentBox visibleName={"Defense Elaboration"} internalName={"Defense Elaboration"}/>
          <CommentBox visibleName={"General Comments"} internalName={"GeneralComments"}/>
        </div>
        <button type="submit">Submit</button>
    </div>
  )
}
