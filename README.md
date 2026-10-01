# FitJournal redesign

This is a Create React App-compatible redesign of the supplied FitJournal frontend.

It keeps the existing local-storage keys and flows:

- `users` and `loggedUser` for sign-up and login
- `workouts_<user id>` for workout entries
- `fit_goal_v1_<user id>` for fitness goals

To apply it to the original project, replace its `src` and `public` folders with the folders here, then install dependencies and run the normal CRA start command:

```powershell
npm install
npm start
```

No backend, Vite configuration, or data migration is included.
