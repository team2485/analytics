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
import { useRef, useState } from "react";

export default function Home() {
  const [noShow, setNoShow] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const [defense, setDefense] = useState(false);
  const form = useRef();

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
  function submit(e) {
    e.preventDefault();
    let data = {noshow: false, leave: false, harmony: false, gndintake: false, srcintake: false, breakdown: false, defense: false};
    [...new FormData(form.current).entries()].forEach(([name, value]) => {
      if (value == 'on') {
        data[name] = true;
      } else {
        if (!isNaN(value)) {
          data[name] = 1*value;
        } else {
          data[name] = value;
        }
      }
    });
    data.breakdown = undefined;
    data.defense = undefined;

    //todo: add confirmation

    fetch('/api/add-match-data', {
      method: "POST",
      body: JSON.stringify(data)
    });
    //todo: handle response to display message (and if 200, clear form)
    //todo: in the meantime, lock up form
  }

  return (
    <div className={styles.MainDiv}>
      <form ref={form} name="Scouting Form" onSubmit={submit}>
        <Header headerName={"Match Info"} />
        <div className={styles.MatchInfo}>
          <TextInput visibleName={"Scout Name:"} internalName={"scoutname"} />
          <TextInput visibleName={"Team #:"} internalName={"scoutteam"} />
          <TextInput
            visibleName={"Team Scouted:"}
            internalName={"team"}
          />
          <TextInput visibleName={"Match #:"} internalName={"match"} />
        </div>
        <Checkbox
          visibleName={"No Show"}
          internalName={"noshow"}
          changeListener={onNoShowChange}
        />
        {!noShow && (
          <>
            <div className={styles.Auto}>
              <Header headerName={"Auto"} />
              <Checkbox visibleName={"Leave"} internalName={"leave"} />
              <div className={styles.AutoNotes}>
                <SubHeader subHeaderName={"Speaker"} />
                <NumericInput
                  noteType={"Success"}
                  visibleName={"Success"}
                  internalName={"autospeakerscored"}
                />
                <NumericInput
                  noteType={"Fail"}
                  visibleName={"Fail"}
                  internalName={"autospeakerfailed"}
                />
                <SubHeader subHeaderName={"Amp"} />
                <NumericInput
                  noteType={"Success"}
                  visibleName={"Success"}
                  internalName={"autoampscored"}
                />
                <NumericInput
                  noteType={"Fail"}
                  visibleName={"Fail"}
                  internalName={"autoampfailed"}
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
                    internalName={"telenampedspeakerscored"}
                  />
                  <NumericInput
                    noteType={"Success"}
                    visibleName={"Amplified"}
                    internalName={"teleampedspeakerscored"}
                  />
                </div>
                <NumericInput
                  noteType={"Fail"}
                  visibleName={"Fail"}
                  internalName={"telespeakerfailed"}
                />
                <SubHeader subHeaderName={"Amp"} />
                <NumericInput
                  noteType={"Success"}
                  visibleName={"Success"}
                  internalName={"teleampscored"}
                />
                <NumericInput
                  noteType={"Fail"}
                  visibleName={"Fail"}
                  internalName={"teleampfailed"}
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
                    internalName={"trapscored"}
                  />
                  <NumericInput
                    noteType={"Fail"}
                    visibleName={"Fail"}
                    internalName={"trapfailed"}
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
                  internalName={"ampspeed"}
                />
                <Qualitative
                  visibleName={"Speaker Speed"}
                  internalName={"speakerspeed"}
                />
                <Qualitative
                  visibleName={"Trap Speed"}
                  internalName={"trapspeed"}
                />
                <Qualitative
                  visibleName={"Onstage Speed"}
                  internalName={"onstagespeed"}
                />
                <Qualitative
                  visibleName={"Harmony Speed"}
                  internalName={"harmonyspeed"}
                />
                <Qualitative
                  visibleName={"Maneuverability"}
                  internalName={"maneuverability"}
                />
                <Qualitative
                  visibleName={"Defense Evasion"}
                  internalName={"defenseevasion"}
                />
                <Qualitative
                  visibleName={"Aggression"}
                  internalName={"aggression"}
                  symbol={"ⵔ"}
                />
                <Qualitative
                  visibleName={"Stage Hazard"}
                  internalName={"stagehazard"}
                  symbol={"ⵔ"}
                />
              </div>
              <br></br>
              <span className={styles.subsubheading}>Intake</span>
              <hr className={styles.subsubheading}></hr>
              <div className={styles.Intake}>
                <Checkbox
                  visibleName={"Ground"}
                  internalName={"gndintake"}
                />
                <Checkbox
                  visibleName={"Source"}
                  internalName={"srcintake"}
                />
              </div>
              <Checkbox visibleName={"Broke down?"} internalName={"breakdown"} changeListener={onBreakdownChange} />
              { breakdown &&
                <CommentBox
                  visibleName={"Breakdown Elaboration"}
                  internalName={"breakdowncomments"}
                />
              }
              <Checkbox visibleName={"Played Defense?"} internalName={"defense"} changeListener={onDefenseChange}/>
              { defense &&
                <CommentBox
                  visibleName={"Defense Elaboration"}
                  internalName={"defensecomments"}
                />
              }
              <CommentBox
                visibleName={"General Comments"}
                internalName={"generalcomments"}
              />
            </div>
          </>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
