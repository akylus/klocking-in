## Clock in & Clock out into your Keka right from your terminal.
This application uses Puppeteer and is roughly put together to make it work.
May or may not work for you.

### Requirements
- Node
- Yarn package manager
- Google Chrome Canary (https://www.google.com/intl/en_in/chrome/canary/)
- Optional: Windows Powershell
- Optional: `BurntToastNotification` package for Powershell to give you a neat notification once the command run is successful

### Setup Steps
1. Install Chrome Canary and log into your Keka. Requires Captcha and OTP. (Make sure to hit remember password for ease of access in the future)
2. Locate the executable and user data directory for this application. Check the `.env.example` file for the plausible default location.
3. Inside the `/clockin` folder, create a `.env` using the `.env.example` & use `yarn install` to install the packages.
4. Optionally, add the project's folder to `Path` in Environment Variables to access the commands from anywhere.

### Commands
#### Clock-in: `clockin.bat`
#### Clock-out: `clockin.bat out`

Note: Keka's auth token expires time to time. So make sure your account is always logged in through Chrome Canary
