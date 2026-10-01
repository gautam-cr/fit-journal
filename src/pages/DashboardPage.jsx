import React from "react";
import { Alert } from "react-bootstrap";
import WeeklyWorkoutsTable from "../components/WeeklyWorkoutsTable";
import WeeklyActivityChart from "../components/WeeklyActivityChart";
import PersonalRecords from "../components/PersonalRecords";
import ExerciseSearch from "../components/ExerciseSearch";

function isGoalAchieved(goal) {
  if (!goal) return false;

  const currentWeight = Number(goal.weight);
  const targetWeight = Number(goal.targetWeight);

  if (goal.goalType === "cutting") return currentWeight <= targetWeight;
  if (goal.goalType === "bulking") return currentWeight >= targetWeight;
  if (goal.goalType === "maintenance") return Math.abs(currentWeight - targetWeight) <= 1;

  return false;
}

function getGoalMessage(goal, achieved) {
  const currentWeight = Number(goal.weight);
  const targetWeight = Number(goal.targetWeight);
  const remainingWeight = Math.abs(currentWeight - targetWeight);

  if (achieved) {
    return `You reached your ${goal.goalType} target of ${targetWeight} kg. Brilliant work.`;
  }

  return `${currentWeight} kg today · ${targetWeight} kg target · ${remainingWeight} kg to go.`;
}

function getTotalVolume(workouts) {
  return workouts.reduce((total, workout) => {
    const sets = Number(workout.sets) || 0;
    const reps = Number(workout.reps) || 0;
    const weight = Number(workout.weight) || 0;

    return total + sets * reps * weight;
  }, 0);
}

function getCurrentStreak(workouts) {
  const workoutDays = new Set(workouts.map((workout) => workout.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let dayToCheck = new Date(today);

  if (!workoutDays.has(dayToCheck.toISOString().slice(0, 10))) {
    dayToCheck.setDate(dayToCheck.getDate() - 1);
  }

  while (workoutDays.has(dayToCheck.toISOString().slice(0, 10))) {
    streak += 1;
    dayToCheck.setDate(dayToCheck.getDate() - 1);
  }

  return streak;
}

export default function DashboardPage({ user }) {
  const workoutsKey = `workouts_${user.id}`;
  const goalKey = `fit_goal_v1_${user.id}`;

  const workouts = JSON.parse(localStorage.getItem(workoutsKey) || "[]");
  const goal = JSON.parse(localStorage.getItem(goalKey) || "null");

  const totalSets = workouts.reduce(
    (total, workout) => total + Number(workout.sets || 0),
    0
  );
  const totalReps = workouts.reduce(
    (total, workout) => total + Number(workout.reps || 0),
    0
  );
  const totalVolume = getTotalVolume(workouts);
  const currentStreak = getCurrentStreak(workouts);
  const achieved = isGoalAchieved(goal);

  const statCards = [
    ["⌁", "Sessions", workouts.length, "#e9f8f2", "#0c9e6d"],
    ["◫", "Total sets", totalSets, "#eef0ff", "#6656e5"],
    ["↗", "Total reps", totalReps, "#fff4df", "#ba7200"],
    ["◌", "Lifted volume", totalVolume.toLocaleString(), "#fceef6", "#b4407b"],
    ["✦", "Current streak", `${currentStreak} day${currentStreak === 1 ? "" : "s"}`, "#fff4df", "#ba7200"],
  ];

  const recentWorkouts = [...workouts].sort((first, second) =>
    second.date.localeCompare(first.date)
  );

  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your progress</p>
          <h1>{user.name}’s dashboard</h1>
          <p className="page-subtitle">A clear view of the work you’re putting in.</p>
        </div>
      </div>

      {goal && (
        <Alert className={`goal-banner ${achieved ? "is-achieved" : ""}`}>
          <strong>{achieved ? "Goal achieved ✦" : "Goal in progress"}</strong>
          <div className="mt-1">{getGoalMessage(goal, achieved)}</div>
        </Alert>
      )}

      <div className="row g-3 mb-5">
        {statCards.map(([icon, label, value, tint, tone]) => (
          <div className="col-sm-6 col-lg-3" key={label}>
            <div
              className="surface-card stat-card"
              style={{ "--tint": tint, "--tone": tone }}
            >
              <span className="stat-icon">{icon}</span>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <WeeklyActivityChart workouts={workouts} />

      <div className="row g-4 mb-5">
        <div className="col-lg-6"><PersonalRecords workouts={workouts} /></div>
        <div className="col-lg-6"><ExerciseSearch workouts={workouts} /></div>
      </div>

      <div className="page-heading">
        <div>
          <p className="eyebrow">Training history</p>
          <h2 className="h3 mb-0">Recent weeks</h2>
        </div>
      </div>

      <WeeklyWorkoutsTable workouts={recentWorkouts} weeksToShow={6} />
    </div>
  );
}
