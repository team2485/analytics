export default async function handler(req, res){
   let scoutTeamStatus = ScoutTeam_.isNumber();
   let teamStatus = Team_.isNumber();
   let matchStatus = Match_.isNumber();
   let breakdownStatus = Breakdown_.isBoolean();
   let noShowStatus = NoShow_.isBoolean();
   let leaveStatus = Leave_.isBoolean();
   let autoAmpScoredStatus = AutoAmpScored_.isNumber();
   let autoAmpFailedStatus = AutoAmpFailed_.isNumber();
   let autoSpeakerScoredStatus = AutoSpeakerScored_.isNumber();
   let autoSpeakerFailedStatus = AutoSpeakerFailed_.isNumber();
   let teleAmpScoredStatus = TeleAmpScored_.isNumber();
   let teleAmpFailedStatus = TeleAmpFailed_.isNumber();
   let teleNAmpedSpeakerScoredStatus = TeleNAmpedSpeakerScored_.isNumber();
   let teleAmpedSpeakerScoredStatus = TeleAmpedSpeakerScored_.isNumber();
   let teleSpeakerFailedStatus = TeleSpeakerFailed_.isNumber();
   let endLocationStatus = EndLocation_.isNumber();
   let harmonyStatus= Harmony_.isBoolean();
   let trapScoredStatus = TrapScored_.isNumber();
   let trapFailedStatus = TrapFailed_.isNumber();
   let maneuverabilityStatus = Maneuverability_.isNumber();
   let aggressionStatus = Aggression_.isNumber();
   let defenseEvasionStatus = DefenseEvasion_.isNumber();
   let speakerSpeedStatus = SpeakerSpeed_.isNumber();
   let ampSpeedStatus = AmpSpeed_.isNumber();
   let intakeSpeedStatus = IntakeSpeed_.isNumber();
   let gndIntakeStatus = GndIntake_.isBoolean();
   let srcIntakeStatus = SrcIntake_.isBoolean();
   let stageHazardStatus = StageHazard_.isNumber();
   let trapSpeedStatus = TrapSpeed_.isNumber();
   let onStageSpeedStatus = OnStageSpeed_.isNumber();
   let harmonySpeedStatus = HarmonySpeed_.isNumber();
   let generalCommentsStatus = GeneralComments_.isString();
   let breakdownCommentsStatus = BreakDownComments_.isString();
   let defenseCommentsStatus = DefenseComments_.isString();
  
   if(scoutTeamStatus&&teamStatus&&matchStatus&&breakdownStatus&&noShowStatus&&leaveStatus&&autoAmpScoredStatus&&autoAmpFailedStatus&&autoSpeakerScoredStatus&&autoSpeakerFailedStatus&&teleAmpScoredStatus&&teleAmpFailedStatus&&teleNAmpedSpeakerScoredStatus&&teleAmpedSpeakerScoredStatus&&teleSpeakerFailedStatus&&endLocationStatus&&harmonyStatus&&trapScoredStatus&&trapFailedStatus&&maneuverabilityStatus&&aggressionStatus&&defenseEvasionStatus&&speakerSpeedStatus&&ampSpeedStatus&&intakeSpeedStatus&&gndIntakeStatus&&srcIntakeStatus&&stageHazardStatus&&trapSpeedStatus&&onStageSpeedStatus&&harmonySpeedStatus&&generalCommentsStatus&&breakdownCommentsStatus&&defenseCommentsStatus){
    let resp = await sql`INSERT INTO testtable VALUES(${ScoutTeam}, ${teamStatus},${matchStatus})`;
    console.log(`submitted`);
    res.status(200).json({message: 'success!'});
    return;
}
else{
   res.status(400).json({message: 'invalid submission data'});

}
}

