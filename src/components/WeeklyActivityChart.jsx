import React from "react";

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    return date;
  });
}

export default function WeeklyActivityChart({ workouts }) {
  const workoutsByDate = workouts.reduce((totals, workout) => {
    totals[workout.date] = (totals[workout.date] || 0) + 1;
    return totals;
  }, {});

  const days = getLastSevenDays().map((date) => ({
    label: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: getDateKey(date),
  }));
  const maximum = Math.max(1, ...days.map((day) => workoutsByDate[day.date] || 0));

  return (
    <section className="section-card card activity-chart">
      <div className="card-header">
        <p className="eyebrow">This week</p>
        <h2 className="h4 mb-0">Workout activity</h2>
      </div>

      <div className="card-body">
        <div className="activity-bars" aria-label="Workouts logged over the last seven days">
          {days.map((day) => {
            const count = workoutsByDate[day.date] || 0;
            const height = count ? `${Math.max(18, (count / maximum) * 100)}%` : "5%";

            return (
              <div className="activity-day" key={day.date}>
                <span className="activity-value">{count || ""}</span>
                <div className="activity-track">
                  <div className="activity-bar" style={{ height }} />
                </div>
                <span className="activity-label">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
