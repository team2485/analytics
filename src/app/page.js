import TextInput from '@/components/TextInput';
import Header from '@/components/Header';
import Checkbox from '@/components/Checkbox';
import NumericInput from '@/components/NumericInput';
import StagePossibilities from '@/components/StagePossibilities';
import Qualitative from '@/components/Qualitative';
import CommentBox from '@/components/CommentBox';

export default function Home() {
  return (
    <div>
      <h1>Scouting Form</h1>
        <div className='matchInfo'>
          <Header headerName={"Match Info"}/>
          <TextInput visibleName={"Scout Name:"} internalName={"ScoutName"}/>
          <TextInput visibleName={"Team #:"} internalName={"TeamNum"}/>
          <TextInput visibleName={"Team # Scouted:"} internalName={"TeamNumScouted"}/>
          <TextInput visibleName={"Match #:"} internalName={"MatchNum"}/>
          <Checkbox visibleName={"No Show"} internalName={"NoShow"}/>
        </div>
        <div className='auto'>
          <Header headerName={"Auto"}/>
          <Checkbox visibleName={"Leave"} internalName={"Leave"}/>
            <div className='autoNotes'>
              <NumericInput visibleName={"Speaker Success"} internalName={"AutoSpeakerSuccess"}/>
              <NumericInput visibleName={"Amp Success"} internalName={"AutoAmpSuccess"}/>
              <NumericInput visibleName={"Speaker Fail"} internalName={"AutoSpeakerFail"}/>
              <NumericInput visibleName={"Amp Fail"} internalName={"AutoAmpFail"}/>
            </div>
        </div>
        <div className='tele'>
          <Header headerName={"TeleOp"}/>
          <div className='teleNotes'>
              <NumericInput visibleName={"Speaker Success"} internalName={"TeleSpeakerSuccess"}/>
              <NumericInput visibleName={"Amplified Speaker Success"} internalName={"TeleAmplifiedSpeakerSuccess"}/>
              <NumericInput visibleName={"Amp Success"} internalName={"TeleAmpSuccess"}/>
              <NumericInput visibleName={"Speaker Fail"} internalName={"TeleSpeakerFail"}/>
              <NumericInput visibleName={"Amp Fail"} internalName={"TeleAmpFail"}/>
            </div>
        </div>
        <div className='endgame'>
          <Header headerName={"Endgame"}/>
          <StagePossibilities />
          <div className='trapNotes'>
            <NumericInput visibleName={"Trap Success"} internalName={"TrapSuccess"}/>
            <NumericInput visibleName={"Trap Fail"} internalName={"TrapFail"}/>
          </div>
        </div>
        <div className='postMatch'>
          <Header headerName={"Post Match"}/>
          <Qualitative visibleName={"Maneuverability"} internalName={"Maneuverability"}/>
          <Qualitative visibleName={"Aggression"} internalName={"Aggression"}/>
          <Qualitative visibleName={"Defense Evasion"} internalName={"DefenseEvasion"}/>
          <Qualitative visibleName={"Stage Hazard"} internalName={"StageHazard"}/>
          <Qualitative visibleName={"Amp Speed"} internalName={"AmpSpeed"}/>
          <Qualitative visibleName={"Speaker Speed"} internalName={"SpeakerSpeed"}/>
          <Qualitative visibleName={"Trap Speed"} internalName={"TrapSpeed"}/>
          <Qualitative visibleName={"Onstage Speed"} internalName={"OnstageSpeed"}/>
          <Qualitative visibleName={"Harmony Speed"} internalName={"HarmonySpeed"}/>
          <Qualitative visibleName={"Intake Speed"} internalName={"IntakeSpeed"}/>
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
