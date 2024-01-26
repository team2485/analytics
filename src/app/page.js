"use client";
import TextInput from "@/components/TextInput";
import Header from "@/components/Header";
import Checkbox from "@/components/Checkbox";
import NumericInput from "@/components/NumericInput";
import StagePossibilities from "@/components/StagePossibilities";
import Qualitative from "@/components/Qualitative";
import CommentBox from "@/components/CommentBox";
import styles from "./page.module.css";
import SubHeader from "@/components/SubHeader";
import { useState } from "react";

export default function Home() {
  const [noShow, setNoShow] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const [defense, setDefense] = useState(false);

  function onNoShowChange(e) {
    let checked = e.target.checked;
    setNoShow(checked);
  }
  function onBreakdownChange(e) {
    let checked = e.target.checked;
    setBreakdown(checked);
  }
  function onDefenseChange(e) {
    let checked = e.target.checked;
    setDefense(checked);
  }

  return (
    <div className={styles.MainDiv}>
      <Header headerName={"Match Info"} />
      <div className={styles.MatchInfo}>
        <TextInput visibleName={"Scout Name:"} internalName={"ScoutName"} />
        <TextInput visibleName={"Team #:"} internalName={"TeamNum"} />
        <TextInput
          visibleName={"Team Scouted:"}
          internalName={"TeamNumScouted"}
        />
        <TextInput visibleName={"Match #:"} internalName={"MatchNum"} />
      </div>
      <Checkbox
        visibleName={"No Show"}
        internalName={"NoShow"}
        changeListener={onNoShowChange}
      />
      {!noShow && (
        <>
          <div className={styles.Auto}>
            <Header headerName={"Auto"} />
            <Checkbox visibleName={"Leave"} internalName={"Leave"} />
            <div className={styles.AutoNotes}>
              <SubHeader subHeaderName={"Speaker"} />
              <NumericInput
                noteType={"Success"}
                visibleName={"Success"}
                internalName={"AutoSpeakerSuccess"}
              />
              <NumericInput
                noteType={"Fail"}
                visibleName={"Fail"}
                internalName={"AutoSpeakerFail"}
              />
              <SubHeader subHeaderName={"Amp"} />
              <NumericInput
                noteType={"Success"}
                visibleName={"Success"}
                internalName={"AutoAmpSuccess"}
              />
              <NumericInput
                noteType={"Fail"}
                visibleName={"Fail"}
                internalName={"AutoAmpFail"}
              />
            </div>
          </div>
          <div className={styles.Tele}>
            <Header headerName={"TeleOp"} />
            <div className={styles.TeleNotes}>
              <SubHeader subHeaderName={"Speaker"} />
              <div className={styles.HBox}>
                <NumericInput
                  noteType={"Success"}
                  visibleName={"Non-Amplified"}
                  internalName={"TeleSpeakerSuccess"}
                />
                <NumericInput
                  noteType={"Success"}
                  visibleName={"Amplified"}
                  internalName={"TeleAmplifiedSpeakerSuccess"}
                />
              </div>
              <NumericInput
                noteType={"Fail"}
                visibleName={"Fail"}
                internalName={"TeleSpeakerFail"}
              />
              <SubHeader subHeaderName={"Amp"} />
              <NumericInput
                noteType={"Success"}
                visibleName={"Success"}
                internalName={"TeleAmpSuccess"}
              />
              <NumericInput
                noteType={"Fail"}
                visibleName={"Fail"}
                internalName={"TeleAmpFail"}
              />
            </div>
          </div>
          <div className={styles.Endgame}>
            <Header headerName={"Endgame"} />
            <br></br>
            <div className={styles.Stage}>
              <SubHeader subHeaderName={"Stage"} />
              <StagePossibilities />
            </div>
            <br></br>
            <div className={styles.TrapNotes}>
              <SubHeader subHeaderName={"Trap"} />
              <div className={styles.HBox}>
                <NumericInput
                  noteType={"Success"}
                  visibleName={"Success"}
                  internalName={"TrapSuccess"}
                />
                <NumericInput
                  noteType={"Fail"}
                  visibleName={"Fail"}
                  internalName={"TrapFail"}
                />
              </div>
            </div>
          </div>
          <div className={styles.PostMatch}>
            <Header headerName={"Post Match"} />
            <br></br>
            <div className={styles.Qual}>
              <Qualitative
                visibleName={"Amp Speed"}
                internalName={"AmpSpeed"}
              />
              <Qualitative
                visibleName={"Speaker Speed"}
                internalName={"SpeakerSpeed"}
              />
              <Qualitative
                visibleName={"Trap Speed"}
                internalName={"TrapSpeed"}
              />
              <Qualitative
                visibleName={"Onstage Speed"}
                internalName={"OnstageSpeed"}
              />
              <Qualitative
                visibleName={"Harmony Speed"}
                internalName={"HarmonySpeed"}
              />
              <Qualitative
                visibleName={"Maneuverability"}
                internalName={"Maneuverability"}
              />
              <Qualitative
                visibleName={"Defense Evasion"}
                internalName={"DefenseEvasion"}
              />
              <Qualitative
                visibleName={"Aggression"}
                internalName={"Aggression"}
                symbol={"ⵔ"}
              />
              <Qualitative
                visibleName={"Stage Hazard"}
                internalName={"StageHazard"}
                symbol={"ⵔ"}
              />
            </div>
            <br></br>
            <span className={styles.subsubheading}>Intake</span>
            <hr className={styles.subsubheading}></hr>
            <div className={styles.Intake}>
              <Checkbox
                visibleName={"Ground"}
                internalName={"GndIntake"}
              />
              <Checkbox
                visibleName={"Source"}
                internalName={"SrcIntake"}
              />
            </div>
            <Checkbox visibleName={"Broke down?"} internalName={"Breakdown"} changeListener={onBreakdownChange} />
            { breakdown &&
              <CommentBox
                visibleName={"Breakdown Elaboration"}
                internalName={"BreakdownElaboration"}
              />
            }
            <Checkbox visibleName={"Played Defense?"} internalName={"Defense"} changeListener={onDefenseChange}/>
            { defense &&
              <CommentBox
                visibleName={"Defense Elaboration"}
                internalName={"Defense Elaboration"}
              />
            }
            <CommentBox
              visibleName={"General Comments"}
              internalName={"GeneralComments"}
            />
          </div>
        </>
      )}
      <button type="submit">Submit</button>
    </div>
  );
}
