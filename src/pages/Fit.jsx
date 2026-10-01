import React, { useEffect, useState } from "react";

const emptyGoal = {
  sex: "",
  height: "",
  weight: "",
  workoutType: "",
  goalType: "",
  targetWeight: "",
  targetWeeks: "",
  activityLevel: "",
};

function isGoalAchieved(goal) {
  if (!goal) return false;

  const currentWeight = Number(goal.weight);
  const targetWeight = Number(goal.targetWeight);

  if (goal.goalType === "cutting") return currentWeight <= targetWeight;
  if (goal.goalType === "bulking") return currentWeight >= targetWeight;
  if (goal.goalType === "maintenance") return Math.abs(currentWeight - targetWeight) <= 1;

  return false;
}

function formatLabel(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";
}

export default function Fit({ user }) {
  const [formData, setFormData] = useState(emptyGoal);
  const [errors, setErrors] = useState({});
  const [savedGoal, setSavedGoal] = useState(null);

  useEffect(() => {
    try {
      const storedGoal = JSON.parse(localStorage.getItem(`fit_goal_v1_${user.id}`) || "null");

      if (storedGoal) {
        setFormData({ ...emptyGoal, ...storedGoal });
        setSavedGoal(storedGoal);
      }
    } catch {
      // Leave the form empty when saved browser data cannot be read.
    }
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: null }));
  }

  function validateForm() {
    const nextErrors = {};
    const requiredFields = ["sex", "workoutType", "goalType", "activityLevel"];
    const numericFields = [
      ["height", "Enter a valid height"],
      ["weight", "Enter a valid weight"],
      ["targetWeight", "Enter a valid target weight"],
      ["targetWeeks", "Enter a valid number of weeks"],
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) nextErrors[field] = "Required";
    });

    numericFields.forEach(([field, message]) => {
      if (!formData[field] || Number(formData[field]) <= 0) {
        nextErrors[field] = message;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const heightInMetres = Number(formData.height) / 100;
    const bmi = Math.round((Number(formData.weight) / heightInMetres ** 2) * 10) / 10;
    const goalToSave = { ...formData, bmi, savedAt: new Date().toISOString() };

    localStorage.setItem(`fit_goal_v1_${user.id}`, JSON.stringify(goalToSave));
    setSavedGoal(goalToSave);
    setTimeout(() => document.getElementById("fit-summary")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }

  function renderInput(name, label, type = "text", placeholder = "") {
    return <div className="mb-3"><label className="form-label">{label}</label><input type={type} min={type === "number" ? "0" : undefined} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} className={`form-control ${errors[name] ? "is-invalid" : ""}`} /><div className="invalid-feedback">{errors[name]}</div></div>;
  }

  const achieved = isGoalAchieved(savedGoal);

  return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">Your direction</p><h1>Set your fitness goal</h1><p className="page-subtitle">Make your target clear, then keep it close.</p></div></div><div className="goal-layout"><section className="surface-card goal-form"><h2 className="h4 mb-1">Your baseline</h2><p className="text-muted mb-4">These details help you make your goal more intentional.</p><form noValidate onSubmit={handleSubmit}><div className="row"><div className="col-md-6 mb-3"><label className="form-label">Sex</label><select name="sex" value={formData.sex} onChange={handleChange} className={`form-select ${errors.sex ? "is-invalid" : ""}`}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><div className="invalid-feedback">{errors.sex}</div></div><div className="col-md-6 mb-3"><label className="form-label">Activity level</label><select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={`form-select ${errors.activityLevel ? "is-invalid" : ""}`}><option value="">Select</option><option value="sedentary">Sedentary</option><option value="light">Lightly active</option><option value="moderate">Moderately active</option><option value="active">Very active</option><option value="athlete">Athlete</option></select><div className="invalid-feedback">{errors.activityLevel}</div></div></div><div className="row"><div className="col-md-6">{renderInput("height", "Height (cm)", "number", "e.g. 175")}</div><div className="col-md-6">{renderInput("weight", "Current weight (kg)", "number", "e.g. 70")}</div></div>{renderInput("workoutType", "Preferred training", "text", "e.g. Strength, cardio")}<hr className="my-4"/><h2 className="h4 mb-3">Your target</h2><div className="mb-3"><label className="form-label">Goal type</label><select name="goalType" value={formData.goalType} onChange={handleChange} className={`form-select ${errors.goalType ? "is-invalid" : ""}`}><option value="">Select</option><option value="cutting">Cutting</option><option value="bulking">Bulking</option><option value="maintenance">Maintenance</option></select><div className="invalid-feedback">{errors.goalType}</div></div><div className="row"><div className="col-md-6">{renderInput("targetWeight", "Target weight (kg)", "number", "e.g. 65")}</div><div className="col-md-6">{renderInput("targetWeeks", "Target timeframe (weeks)", "number", "e.g. 12")}</div></div><button className="btn btn-success w-100 mt-2" type="submit">Save my goal</button></form></section><aside id="fit-summary" className="surface-card goal-summary">{savedGoal ? <><div className="summary-label">Your saved goal</div><div className="bmi-value">{savedGoal.bmi ?? "—"}</div><div className="opacity-75 mb-4">BMI · last updated {new Date(savedGoal.savedAt).toLocaleDateString()}</div><div className={`rounded-3 p-3 mb-3 ${achieved ? "bg-white text-dark" : ""}`} style={achieved ? undefined : { background: "rgba(255,255,255,.1)" }}><strong>{achieved ? "Goal achieved ✦" : "In progress"}</strong><div className="small mt-1">{savedGoal.weight} kg now → {savedGoal.targetWeight} kg target</div></div>{[["Goal", formatLabel(savedGoal.goalType)], ["Training", savedGoal.workoutType], ["Timeframe", `${savedGoal.targetWeeks} weeks`], ["Activity", formatLabel(savedGoal.activityLevel)]].map(([label, value]) => <div className="summary-row" key={label}><span>{label}</span><span>{value}</span></div>)}</> : <><div className="summary-label">Your goal preview</div><h2 className="mt-3">A clear target starts here.</h2><p className="opacity-75 mt-3 mb-0">Fill in the form to save your baseline and see your goal summary.</p></>}</aside></div></div>;
}
