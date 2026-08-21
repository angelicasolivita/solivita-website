# Setting Up Google Sheets API Access (Service Account)

A reusable guide for connecting a website form (or any app) directly to a Google Sheet using a service account. No Zapier/Make.com needed — the app writes rows to the Sheet via Google's API.

Use this any time a client wants form submissions to land in a live Google Sheet.

---

## What you're building

A **service account** is a robot Google account that belongs to your app, not a person. You:
1. Create it inside a Google Cloud project
2. Give it a JSON "key" file (like a password) that your app uses to authenticate
3. Share your target Google Sheet with the service account's email — exactly like sharing a Sheet with a coworker
4. Enable the Sheets API for that Google Cloud project

Once that's done, your app can read/write that Sheet using the key file, with no user login flow required.

---

## Step 1 — Create (or pick) a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Top left, click the project dropdown → **New Project** (or select an existing one if you already have one for this client)
3. Name it something identifiable, e.g. `solivita-website` or `[client]-integrations`
4. Click **Create**, then make sure the new project is selected in the top dropdown

## Step 2 — Enable the Google Sheets API

1. In the search bar at the top of the console, search **"Google Sheets API"**
2. Click into it, then click **Enable**
3. (If you'll also read/write Drive metadata, do the same for **Google Drive API** — not required just to write to a Sheet)

## Step 3 — Create the service account

1. In the search bar, search **"Service Accounts"** and open that page
2. Click **+ Create Service Account**
3. Enter a **service account name** (e.g. `sheets-writer`) — Google auto-generates an ID
4. Optionally add a description (e.g. "Writes Get in Touch survey submissions to Sheets")
5. Click **Create and continue**
6. On the role step, you can skip granting a project-level IAM role (permissions to the Sheet itself are handled separately in Step 5) — click **Continue**, then **Done**

## Step 4 — Generate the JSON key

1. On the Service Accounts list, click the **email address** of the account you just created
2. Go to the **Keys** tab
3. Click **Add key** → **Create new key**
4. Choose **JSON** → **Create**
5. A `.json` file downloads automatically — **this only happens once, it cannot be re-downloaded**. Store it somewhere secure (password manager or encrypted storage, never committed to git).

The file looks like:
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key": "...",
  "client_email": "sheets-writer@your-project.iam.gserviceaccount.com",
  ...
}
```

## Step 5 — Share the target Sheet with the service account

1. Open the Google Sheet you want the app to write to
2. Click **Share**
3. Paste in the service account's `client_email` (from the JSON file, looks like `name@project-id.iam.gserviceaccount.com`)
4. Give it **Editor** access
5. Click **Send** (no real email goes out — it's a robot account, this just grants access)

## Step 6 — Hand off the two things your app needs

Whoever wires up the code needs:
- The **JSON key file contents** (stored as an environment variable / secret, never in the repo)
- The **Sheet ID** — the long string in the Sheet's URL between `/d/` and `/edit`:
  `https://docs.google.com/spreadsheets/d/THIS_PART/edit`

---

## Security notes
- Never commit the JSON key to a git repo. Store it as an environment variable (e.g. in Vercel's project settings) or a secrets manager.
- The service account can only access Sheets it's explicitly been shared with — sharing is what scopes its access, so don't share more sheets with it than necessary.
- If a key is ever exposed, delete it from the Keys tab and generate a new one — this immediately invalidates the old one.
