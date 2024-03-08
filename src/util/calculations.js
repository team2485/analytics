function calcAuto(record) {
  return (
    record.autoampscored * 2 +
    record.autospeakerscored * 5 +
    (record.leave ? 2 : 0)
  );
};
function calcTele(record) {
  return (
    record.teleampscored * 1 +
    record.teleampedspeakerscored * 5 +
    record.telenampedspeakerscored * 2
  );
};
function calcEnd(record) {
  return (
    (record.endlocation == 0 ? 0 :
      record.endlocation <= 2 ? 2 : 3) +
    (record.harmony ? 2 : 0) +
    record.trapscored * 5
  );
};
function calcESPM(record) {
  return calcAuto(record) + calcTele(record) + calcEnd(record);
};

export {calcAuto, calcTele, calcEnd, calcESPM};