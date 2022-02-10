# Heroku Deploy Instructions
0. fork the `spector-trades` repo if repo not in your account
1. Create new app in heroku
2. In the app's resources tab, add the Heroku Postgres addon
3. In the deploy section, goto deployment method and connect to github
4. select `spector-trades` repo in your account and select the branch used for deployment
5. Goto Settings tab -> Buildpacks -> Add the `https://github.com/timanovsky/subdir-heroku-buildpack` buildpack as first for your application.
6. Add the `heroku/nodejs` buildpack as second for your application.
7. Goto Config vars -> Add the Config Vars `PROJECT_PATH` with the value `server`.
8. Add the Config Vars `PORT` with the value `8080`.
9. Add the Config Vars `JWT_SECRET` with a value of a string of your choice.  For example: `somesecretphrase`.
10. Goto Resources tab, click on Heroku Postgres -> Settings -> Reveal credentials 
11. Copy the credientials to Config Vars as followed:
```
PGHOST Host
PGUSER User
PGPASSWORD Password
PGDATABASE Database
DB_PORT Port
```
12. In the deploy tab, choose automatic or manual deploy and pick the branch to deploy with.
