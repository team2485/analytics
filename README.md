## Getting Started

First, install the dependencies:

```bash
npm install
```

Next, set up the database on Vercel with test data.
```sql
CREATE TABLE test_matches (
   ID serial PRIMARY KEY,
   ScoutName VARCHAR (255),
   ScoutTeam INT,
   Team INT,
   Match INT,
   Breakdown BOOLEAN,
   NoShow BOOLEAN,
   Leave BOOLEAN,
   AutoAmpScored INT,
   AutoAmpFailed INT,
   AutoSpeakerScored INT,
   AutoSpeakerFailed INT,
   TeleAmpScored INT,
   TeleAmpFailed INT,
   TeleNAmpedSpeakerScored INT,
   TeleAmpedSpeakerScored INT,
   TeleSpeakerFailed INT,
   EndLocation INT,
   Harmony BOOLEAN,
   TrapScored INT,
   TrapFailed INT,
   Maneuverability INT,
   Aggression INT,
   DefenseEvasion INT,
   SpeakerSpeed INT,
   AmplifierSpeed INT,
   IntakeSpeed INT,
   GndIntake BOOLEAN,
   SrcIntake BOOLEAN,
   StageHazard INT,
   TrapSpeed INT,
   OnStageSpeed INT,
   HarmonySpeed INT,
   GeneralComments VARCHAR (255),
   BreakdownComments VARCHAR (255),
   DefenseComments VARCHAR (255)
);


--INCORRECT CODE FOLLOWS... TODO:

INSERT INTO test_matches (match, scout_name, scout_team, team, auto_score, tele_score, maneuverability)
VALUES
(1, 'Scout 1', 1, 1, 15, 20, 3),
(2, 'Scout 2', 2, 1, 16, 21, 3),
(3, 'Scout 3', 3, 1, 17, 22, 3),
(4, 'Scout 4', 4, 1, 18, 23, 3),
(5, 'Scout 5', 5, 1, 19, 24, 3),
(1, 'Scout 6', 6, 2, 10, 35, 4),
(2, 'Scout 7', 7, 2, 11, 36, 4),
(3, 'Scout 8', 1, 2, 12, 37, 4),
(4, 'Scout 9', 2, 2, 13, 38, 4),
(5, 'Scout 10', 3, 2, 14, 39, 4),
(1, 'Scout 11', 4, 3, 1, 15, 1),
(2, 'Scout 12', 5, 3, 2, 16, 1),
(3, 'Scout 3', 6, 3, 3, 17, 1),
(4, 'Scout 4', 7, 3, 4, 18, 1),
(5, 'Scout 5', 8, 3, 5, 19, 1);
```

Next, import your database passwords from vercel to your local machine (copy the .env.local file).

Finally, execute the following command to run the code:

```bash
npm run dev
```
