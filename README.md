# Plexora

A starter chat website. It includes accounts, server invite links, room chat, emoji messages, image sharing, daily coin rewards, Flippo purchase, profile customization and sound choices.

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and change `SESSION_SECRET`.
3. Run `npm install`
4. Run `npm start`
5. Open http://localhost:3000

## Docker
`docker build -t plexora .`
`docker run -p 3000:3000 -v plexora-data:/app/data -v plexora-uploads:/app/uploads -e SESSION_SECRET="use-a-long-secret" plexora`

## Important before publishing
This is a starter project, not a fully audited public social network. Use HTTPS, a strong SESSION_SECRET, backups, moderation/reporting, rate limits, spam protection and a privacy policy before inviting people. The browser sound plays while the site is open; reliable notifications when the browser is closed need web-push credentials and a push subscription service, which are not configured here. The sound maker creates a simple tone in the browser. Keep uploaded images appropriate and do not share private information.
