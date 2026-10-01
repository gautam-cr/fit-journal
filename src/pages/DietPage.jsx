import React from "react";
import { Badge } from "react-bootstrap";

const dietPlans = {
  cutting: {
    title: "Fuel your cut with satisfying basics.",
    intro:
      "Build meals around protein, colourful plants, and filling fibre so your target feels sustainable.",
    meals: [
      ["☀", "Breakfast", "Greek yogurt or eggs with fruit and oats."],
      ["◌", "Lunch", "A lean-protein bowl with vegetables, beans, or whole grains."],
      [
        "◒",
        "Dinner",
        "Chicken, tofu, fish, or lentils with plenty of vegetables and a measured carb portion.",
      ],
    ],
    tips: [
      "Include a protein source at each meal.",
      "Aim for mostly minimally processed foods.",
      "Plan a satisfying snack such as fruit, yogurt, or nuts.",
    ],
  },
  bulking: {
    title: "Build steadily, not randomly.",
    intro:
      "Support training with regular meals, enough protein, and energy-dense foods you enjoy.",
    meals: [
      ["☀", "Breakfast", "Oats with milk, banana, peanut butter, and yogurt."],
      [
        "◌",
        "Lunch",
        "Rice, potatoes, or pasta with a protein source, vegetables, and olive oil or avocado.",
      ],
      [
        "◒",
        "Dinner",
        "A substantial plate of protein, carbs, vegetables, and a healthy fat.",
      ],
    ],
    tips: [
      "Eat consistently across the day.",
      "Keep convenient snacks ready: trail mix, smoothies, or yogurt.",
      "Use your workout log to notice what supports your training.",
    ],
  },
  maintenance: {
    title: "Keep your plate balanced and flexible.",
    intro:
      "Use a steady rhythm of meals that makes it easy to maintain energy for training and everyday life.",
    meals: [
      ["☀", "Breakfast", "Eggs or yogurt with whole-grain toast, oats, or fruit."],
      [
        "◌",
        "Lunch",
        "A balanced grain or salad bowl with protein and a flavourful dressing.",
      ],
      [
        "◒",
        "Dinner",
        "Your favourite protein with vegetables and a satisfying carb source.",
      ],
    ],
    tips: [
      "Keep meals varied enough to stay enjoyable.",
      "Let hunger, energy, and training performance guide adjustments.",
      "Make water a regular part of your routine.",
    ],
  },
};

const defaultPlan = {
  title: "Simple nutrition, built around your goal.",
  intro:
    "Set a fitness goal to receive suggestions tailored to cutting, bulking, or maintenance.",
  meals: [
    ["☀", "Breakfast", "Choose a protein-rich breakfast with fruit or whole grains."],
    ["◌", "Lunch", "Build a balanced plate with protein, plants, and carbohydrates."],
    ["◒", "Dinner", "Keep it simple: protein, vegetables, and a satisfying side."],
  ],
  tips: [
    "Set your goal on the My goal page for more tailored ideas.",
    "Aim for meals you can repeat and enjoy.",
    "Small, consistent choices matter most.",
  ],
};

function getSavedGoal(userId) {
  try {
    return JSON.parse(localStorage.getItem(`fit_goal_v1_${userId}`) || "null");
  } catch {
    return null;
  }
}

export default function DietPage({ user }) {
  const goal = getSavedGoal(user.id);
  const plan = dietPlans[goal?.goalType] || defaultPlan;

  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Everyday nutrition</p>
          <h1>Diet suggestions</h1>
          <p className="page-subtitle">Simple ideas to complement your training.</p>
        </div>

        {goal && (
          <Badge bg="light" text="dark">
            {goal.goalType} goal
          </Badge>
        )}
      </div>

      <section className="nutrition-hero mb-4">
        <p className="eyebrow">Your nutrition focus</p>
        <h2 className="mb-2">{plan.title}</h2>
        <p className="mb-0">{plan.intro}</p>
      </section>

      <div className="row g-4 mb-4">
        {plan.meals.map(([icon, time, idea]) => (
          <div className="col-md-4" key={time}>
            <article className="surface-card meal-card">
              <div className="meal-icon">{icon}</div>
              <p className="eyebrow">{time}</p>
              <h3>Easy meal idea</h3>
              <p className="mb-0">{idea}</p>
            </article>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <section className="section-card card">
            <div className="card-header">
              <p className="eyebrow">Keep in mind</p>
              <h2 className="h4 mb-0">Helpful habits</h2>
            </div>

            <div className="card-body p-4">
              <ul className="tip-list">
                {plan.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="col-lg-5">
          <section className="surface-card p-4 h-100">
            <p className="eyebrow">A gentle reminder</p>
            <h2 className="h4">Use this as inspiration.</h2>
            <p className="text-muted mb-0">
              These are general wellness suggestions, not medical or personalised dietary advice.
              If you have a health condition, food allergy, or specific nutrition needs,
              speak with a qualified dietitian or clinician.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
