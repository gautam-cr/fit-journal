import React from "react";
import { Badge, Card } from "react-bootstrap";

function getWeekStart(date) {
  const weekDate = new Date(`${date}T00:00:00`);
  const daysSinceMonday = (weekDate.getDay() + 6) % 7;

  weekDate.setDate(weekDate.getDate() - daysSinceMonday);
  return weekDate.toISOString().slice(0, 10);
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWeeklyStats(workouts) {
  return {
    workouts: workouts.length,
    sets: workouts.reduce((total, workout) => total + Number(workout.sets || 0), 0),
    reps: workouts.reduce((total, workout) => total + Number(workout.reps || 0), 0),
    exercises: new Set(workouts.map((workout) => workout.exercise)).size,
  };
}

function getWorkoutVolume(workout) {
  const sets = Number(workout.sets) || 0;
  const reps = Number(workout.reps) || 0;
  const weight = Number(workout.weight) || 0;

  return sets * reps * weight;
}

export default function WeeklyWorkoutsTable({ workouts = [], weeksToShow = 6 }) {
  if (!workouts.length) {
    return (
      <Card className="section-card">
        <div className="empty-state">
          <div className="empty-icon">⌁</div>
          <h5>No workouts logged yet</h5>
          <p className="mb-0">
            Your recent training weeks will appear here after you add a workout.
          </p>
        </div>
      </Card>
    );
  }

  const workoutsByWeek = workouts
    .filter((workout) => workout.date)
    .reduce((groups, workout) => {
      const start = getWeekStart(workout.date);

      if (!groups[start]) {
        groups[start] = [];
      }

      groups[start].push(workout);
      return groups;
    }, {});

  const recentWeeks = Object.keys(workoutsByWeek)
    .sort((first, second) => second.localeCompare(first))
    .slice(0, weeksToShow);

  return (
    <div className="d-grid gap-4">
      {recentWeeks.map((start) => {
        const weekWorkouts = [...workoutsByWeek[start]].sort((first, second) =>
          first.date.localeCompare(second.date)
        );
        const stats = getWeeklyStats(weekWorkouts);
        const end = new Date(`${start}T00:00:00`);

        end.setDate(end.getDate() + 6);

        return (
          <Card key={start} className="week-card">
            <Card.Header className="text-white d-flex flex-wrap gap-3 justify-content-between align-items-center">
              <div>
                <div className="fw-bold fs-5">Training week</div>
                <small className="opacity-75">
                  {formatDate(start)} — {formatDate(end.toISOString().slice(0, 10))}
                </small>
              </div>

              <Badge bg="light" text="dark">
                {stats.workouts} workout{stats.workouts !== 1 ? "s" : ""}
              </Badge>
            </Card.Header>

            <div className="week-stats">
              <div className="row text-center g-3">
                {[
                  [stats.workouts, "Workouts"],
                  [stats.exercises, "Exercises"],
                  [stats.sets, "Total sets"],
                  [stats.reps, "Total reps"],
                ].map(([value, label]) => (
                  <div className="col-6 col-md-3" key={label}>
                    <div className="week-stat-number">{value}</div>
                    <div className="week-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="workout-card-list">
              {weekWorkouts.map((workout) => (
                <article className="workout-entry" key={workout.id}>
                  <div className="workout-entry-heading">
                    <div>
                      <p className="workout-entry-date">{formatDate(workout.date)}</p>
                      <h3>{workout.exercise}</h3>
                    </div>
                    <strong>{getWorkoutVolume(workout).toLocaleString()} kg</strong>
                  </div>

                  <div className="workout-entry-details">
                    <div><span>Sets</span><b>{workout.sets}</b></div>
                    <div><span>Reps</span><b>{workout.reps}</b></div>
                    <div><span>Weight</span><b>{workout.weight ? `${workout.weight} kg` : "Bodyweight"}</b></div>
                  </div>

                  {workout.notes && <p className="workout-entry-notes">{workout.notes}</p>}
                </article>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
