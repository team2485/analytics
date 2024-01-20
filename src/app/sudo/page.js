"use client";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";

export default function Sudo() {
  const [data, setData] = useState([]);
  let columns = [
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
  columns = [
    {
      title: "Delete",
      key: "delete",
      render: (text, record) => (
        <button
          onClick={async () => {
            const password = prompt("Enter your password");
            fetch("/api/delete-row", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: record.id, password }),
            })
              .then((resp) => {
                if (!resp.ok) {
                  return resp.json().then((error) => {
                    throw new Error(error.error);
                  });
                }
                return resp.json();
              })
              .then((respData) => {
                alert("Successfully deleted row.");
                setData(data.filter(dp => dp.id != record.id));
              })
              .catch((error) => {
                alert(`Error: ${error.message}`);
              });
          }}
        >
          Delete Row
        </button>
      ),
    },
    ...columns,
  ];

  useEffect(() => {
    fetch("/api/get-data")
      .then((resp) => resp.json())
      .then((data) => setData(data.rows));
  }, []);

  return (
    <div style={{ overflow: "scroll" }}>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
