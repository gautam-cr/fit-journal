import React from "react";

function getPersonalRecords(workouts) {
  const records = new Map();

  workouts.forEach((workout) => {
    const volume = (Number(workout.sets) || 0) * (Number(workout.reps) || 0) * (Number(workout.weight) || 0);
    const currentRecord = records.get(workout.exercise);

    if (!currentRecord || volume > currentRecord.volume) {
      records.set(workout.exercise, { ...workout, volume });
    }
  });

  return [...records.values()].sort((first, second) => second.volume - first.volume).slice(0, 5);
}

export default function PersonalRecords({ workouts }) {
  const records = getPersonalRecords(workouts);

  return <section className="section-card card personal-records"><div className="card-header"><p className="eyebrow">Your best efforts</p><h2 className="h4 mb-0">Personal records</h2></div>{records.length ? <div className="record-list">{records.map((record) => <div className="record-row" key={record.exercise}><div><strong>{record.exercise}</strong><small>{record.sets} sets × {record.reps} reps · {record.weight || 0} kg</small></div><b>{record.volume.toLocaleString()} kg</b></div>)}</div> : <div className="empty-state"><div className="empty-icon">✦</div><h5>Your records will appear here</h5><p className="mb-0">Log a weighted workout to start tracking your best sets.</p></div>}</section>;
}
