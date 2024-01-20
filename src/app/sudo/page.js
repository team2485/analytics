"use client";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";

export default function Sudo() {
  const columns = [
    "ID",
    "ScoutName",
    "ScoutTeam",
    "Team",
    "Match",
    "Breakdown",
    "NoShow",
    "Leave",
    "AutoAmpScored",
    "AutoAmpFailed",
    "AutoSpeakerScored",
    "AutoSpeakerFailed",
    "TeleAmpScored",
    "TeleAmpFailed",
    "TeleNAmpedSpeakerScored",
    "TeleAmpedSpeakerScored",
    "TeleSpeakerFailed",
    "EndLocation",
    "Harmony",
    "TrapScored",
    "TrapFailed",
    "Maneuverability",
    "Aggression",
    "DefenseEvasion",
    "SpeakerSpeed",
    "AmplifierSpeed",
    "IntakeSpeed",
    "GndIntake",
    "SrcIntake",
    "StageHazard",
    "TrapSpeed",
    "OnStageSpeed",
    "HarmonySpeed",
    "GeneralComments",
    "BreakdownComments",
    "DefenseComments",
  ].map((title) => {
    return { title, dataIndex: title.toLowerCase(), key: title.toLowerCase() };
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/get-data").then(resp => resp.json()).then(data => setData(data.rows));
  }, []);
  return (
    <div style={{ overflow: "scroll" }}>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
