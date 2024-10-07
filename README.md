# Google Account Sign-Up Automation Script

This project provides an automated script to create an account on Google using Puppeteer. The script fills in Google's registration form and follows the necessary steps. The project helps you create an account by automated action in the browser using Puppeteer.

## Features

- **Title**: Google Account Creation
- **Automatization**: Google will automatically fill out and submit the registration form.
- **Privacy**: The browser automatically works with privacy protection features.
- **Adblocker**: Works in conjunction with an ad blocker.

## Requirements

- Node.js (v18 or higher recommended)
- npm (Node package manager)

## Installation

1. **Install Node.js and npm**:
   Download and install Node.js and npm from [Node.js official website](https://nodejs.org/).

2. **Install Project Dependencies**:
   Run the following command in the terminal or command client to install the dependencies used in this project:

   ```bash
   npm install puppeteer-extra puppeteer-extra-plugin-anonymize-ua puppeteer-extra-plugin-adblocker
   ```
   ```bash
    npx puppeteer browsers install chrome
   ```
## Usage

1. **Run the Script File**:
   In the terminal or command client, use the following command to run the script:

   ```bash
   node creator.js
   ```

   Here `creator.js` is the name of your script. When you run the script, the browser opens and the Google registration form is filled in automatically.

2. **Result**:
   When the script completes, a result is written to the `result.txt` file indicating whether the registration was successful or not. Also, the script displays information about the result on the terminal.

## Code Description

- **Puppeteer Settings**:
  - `puppeteer-extra` and plugins (`puppeteer-extra-plugin-anonymize-ua`, `puppeteer-extra-plugin-adblocker`) are used.
  - The browser is initialized to not run in headless mode (`headless: false`) and with specific arguments.

- **Filling a Form**:
  - In the first step, the required fields of the form are filled in and buttons are clicked.
  - JavaScript code is used to enter date, gender and other information.

- **Phone Number Verification**:
  - If the phone number verification stage is reached, click if there is a toggle option.

- **Result Registration**:
  - At the end of the script, the success status is written to the `result.txt` file.

## Debugging and Troubleshooting

- **Error:** “Phone number verification error.”
  - **Solution:** This error usually occurs when the pass option is not available at the phone number verification stage. The registration process can be completed manually.

- **Error:** The browser does not open or the form is not filled.
  - Solution:** Make sure dependencies are installed correctly and check that the CSS selectors in the script are up to date. Google's interface may have changed.

## Contributing

If you want to make any improvements or bug fixes, feel free to contribute.

## Disclaimer

Use of this script is at your own risk.

## License

This project is licensed under the [MIT License](LICENSE).