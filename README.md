# https://vanity.osweekends.com

### Objetivo
Recolectar todas las métricas más vanidosas de la comunidad en un solo punto.

Información pública de Twitter, Github, Slack y Meetup.

### Demo


![captura de pantalla](other/vanity_capture.gif)


### Equipo: Guild 24
- [@koolTheba](https://github.com/koolTheba) Diseño y Frontend
- [@UlisesGascon](https://github.com/UlisesGascon) Backend, API y DB

### Tecnología
- `Nodejs` v10 (Server)
- `Pillarsjs` (HTTP)
- `GoblinDB` (Database)
- `Puppeteer` (Scraper)
- `Scheduled` (Cron Jobs)
- `@octokit/rest` (Github Communication)
- `moment.js` (Timeago en front)

### :round_pushpin: Variables de entorno

- `GITHUB_TOKEN`: Token de github para hacer consultas a la API.
- `GITHUB_MAIN`: *Slugs/ids* de la organización principal.
- `GITHUB_ORGS`: Lista/Array de *slugs/ids* de organizaciones adicionales.
- `SLACK_USER`: Usuario de Slack para hacer el login.
- `SLACK_PASS`: Password del usuario de Slack.
- `TWITTER_USER`: Usuario de Twitter del que extraemos la información.