const fs = require('fs');
const {sms} = require("./liberarComSMS")
const puppeteer = require('puppeteer-extra');
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");



async function signUp() {
  puppeteer.use(AnonymizeUAPlugin());
  puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: [
      '--disable-blink-features=AutomationControlled', 
      '--window-size=800,600', 
      '--window-position=1921,0',
      '--incognito', 
    ],
  });
  const page = await browser.newPage();

  await page.goto('https://accounts.google.com/signup/v2/createaccount?flowName=GlifWebSignIn&flowEntry=SignUp');
  await page.waitForSelector('input[name="firstName"]');
  await page.type('input[name="firstName"]', 'hand');
  await page.type('input[name="lastName"]', 'son');
  await page.click('#collectNameNext > div > button > span');

  await page.waitForSelector('input[name="day"]', { visible: true });
  await page.type('#day', '01');sms();
  await page.waitForSelector('#year');
  await page.type('#year', '1992');
  const selectMonthScript = `
    const monthDropdown = document.querySelector('#month');
    monthDropdown.selectedIndex = ${1};
    monthDropdown.dispatchEvent(new Event('change'));`;
  await page.evaluate(selectMonthScript);

  const selectGenderScript = `
    const genderDropdown = document.querySelector('#gender');
    genderDropdown.selectedIndex = ${2};
    genderDropdown.dispatchEvent(new Event('change'));`;
  await page.evaluate(selectGenderScript);

  await page.waitForSelector('#birthdaygenderNext > div > button > span');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.click('#birthdaygenderNext > div > button > span');

  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.waitForSelector('#selectionc2');
  const selectionElement = await page.$('#selectionc2');
  const selectionText = await page.evaluate(element => element.textContent, selectionElement);
  console.log(selectionText);
  await new Promise(resolve => setTimeout(resolve, 3000));
  await page.click('#selectionc2');
  await page.click('#next > div > button > div.VfPpkd-RLmnJb');

  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.waitForSelector('#passwd');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.waitForSelector('#confirm-passwd');

  await page.type('#passwd', '6lxTczLPhtA');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.type('input[name="PasswdAgain"]', '6lxTczLPhtA');
  await page.click('#createpasswordNext > div > button > div.VfPpkd-RLmnJb');

  await new Promise(resolve => setTimeout(resolve, 4000));
  try {
    await page.waitForSelector('#phoneNumberId', { timeout: 5000 });
    const skipButton = await page.$('button[jsname="LgbsSe"]');

    if (skipButton) {
      console.log("Skip option found, clicking the option.");
      await skipButton.click();
    } else {
      console.log("Phone number verification error: No skip option.");
    }
  } catch (error) {
    console.log("Phone number verification error.");
  }

  const currentUrl = page.url();
  await browser.close();

  const result = currentUrl.includes('inbox') ? 'Account created successfully' : 'Account creation failed';
  fs.writeFileSync('result.txt', result);
  return result;
}

async function main() {
  try {
    const result = await signUp();
    console.log(result);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
