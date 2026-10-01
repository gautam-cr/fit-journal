import React, { useMemo, useState } from "react";

export default function ExerciseSearch({ workouts }) {
  const [query, setQuery] = useState("");
  const matchingWorkouts = useMemo(() => workouts.filter((workout) => workout.exercise.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5), [workouts, query]);

  return <section className="section-card card exercise-search"><div className="card-header"><p className="eyebrow">Find an exercise</p><h2 className="h4 mb-3">Search workout history</h2><input className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Bench press" aria-label="Search workouts by exercise" /></div>{query && <div className="record-list">{matchingWorkouts.length ? matchingWorkouts.map((workout) => <div className="record-row" key={workout.id}><div><strong>{workout.exercise}</strong><small>{workout.date} · {workout.sets} sets × {workout.reps} reps</small></div><b>{workout.weight || "—"} kg</b></div>) : <p className="text-muted p-4 mb-0">No matching exercises yet.</p>}</div>}</section>;
}
