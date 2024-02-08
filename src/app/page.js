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
import { useEffect, useRef, useState } from "react";
import PopUp from "@/components/PopUp";
import { get, isUndefined } from "lodash";

export default function Home() {
  const [noShow, setNoShow] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const [defense, setDefense] = useState(false);
  const [scoutProfile, setScoutProfile] = useState(null);
  const form = useRef();

  useEffect(()=> {
    if(typeof window !== "undefined" && window.localStorage && window.localStorage.ScoutProfile) {
      setScoutProfile(JSON.parse(localStorage?.ScoutProfile))
    }
  }, [])

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
    let submitButton = document.querySelector("#submit");
    submitButton.disabled = true;
    e.preventDefault();
    let data = {noshow: false, leave: false, harmony: false, gndintake: false, srcintake: false, breakdown: false, defense: false, stageplacement: -1, breakdowncomments: null, defensecomments: null };
    [...new FormData(form.current).entries()].forEach(([name, value]) => {
      if (value == 'on') {
        data[name] = true;
      } else {
        if (!isNaN(value) && value != "") {
          data[name] = +value;
        } else {
          data[name] = value;
        }
      }
    });
    data.breakdown = undefined;
    data.defense = undefined;

    let preMatchInputs = document.querySelectorAll(".preMatchInput");
    for (let preMatchInput of preMatchInputs) {
      if(preMatchInput.value == "" || preMatchInput.value <= "0") {
        alert("Invalid Pre-Match Data!");
        submitButton.disabled = false;
        return;
      } 
    }

    if (confirm("Are you sure you want to submit?") == true) {
      fetch('/api/add-match-data', {
        method: "POST",
        body: JSON.stringify(data)
      }).then((response)=> {
        if(response.status === 201) {
          return response.json();
        } else {
          return response.json().then(err => Promise.reject(err.message));
        }
      }) 
      .then(data => {
        alert("Thank you!");
        if (typeof document !== 'undefined')  {
          let ScoutName = document.querySelector("input[name='scoutname']").value;
          let ScoutTeam = document.querySelector("input[name='scoutteam']").value;
          let Match = document.querySelector("input[name='match']").value;
          let scoutProfile = { 
            scoutname: ScoutName, 
            scoutteam: ScoutTeam, 
            match: Number(Match)+1 
          };
          localStorage.setItem("ScoutProfile", JSON.stringify(scoutProfile));
        }
        location.reload();
      })
      .catch(error => alert(error));

    } else {
      
    };
    submitButton.disabled = false;
    //todo: handle response to display message (and if 200, clear form)
    //todo: in the meantime, lock up form
  }

  return (
    <div className={styles.MainDiv}>
      <form ref={form} name="Scouting Form" onSubmit={submit}>
        <Header headerName={"Match Info"} />
        <div className={styles.MatchInfo}>
          <TextInput 
            visibleName={"Scout Name:"} 
            internalName={"scoutname"} 
            defaultValue={scoutProfile?.scoutname || ""}
          />
          <TextInput 
            visibleName={"Team #:"} 
            internalName={"scoutteam"} 
            defaultValue={scoutProfile?.scoutteam || ""}
            type={"number"}
          />
          <TextInput
            visibleName={"Team Scouted:"}
            internalName={"team"}
            defaultValue={""}
            type={"number"}
          />
          <TextInput 
            visibleName={"Match #:"} 
            internalName={"match"} 
            defaultValue={scoutProfile?.match || ""}
            type={"number"}
          />
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
        <br></br>
        <button id="submit" type="submit">SUBMIT</button>
      </form>
    </div>
  );
}
