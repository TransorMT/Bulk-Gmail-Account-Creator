//const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const LocateChrome = require("locate-chrome");
const stealth = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

async function login(email, password) {
  //puppeteer.use(stealth());
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
      '--proxy-server=la.residential.rayobyte.com:8000',
      //  "--start-maximized",
      //  "--no-sandbox",
      //  "--disable-setuid-sandbox",
      //  "--user-data-dir=F:\\data",
      //  '--enable-automation', '--disable-extensions', '--disable-default-apps', '--disable-component-extensions-with-background-pages'
    ],
  });
  const page = await browser.newPage();

  await page.authenticate({        
      username: 'succxulicorbernal_gmail_com',
      password: 'tq45WY2ZlZGoJ'
  })


  //PRIMEIRA PAGINA
  await page.goto('https://accounts.google.com/signup/v2/createaccount?flowName=GlifWebSignIn&flowEntry=SignUp');
  await page.waitForSelector('input[name="firstName"]');
  await page.type('input[name="firstName"]', 'hariel');
  await page.type('input[name="lastName"]', 'xd');
  await page.click('#collectNameNext > div > button > span');

  //SEGUNDA PAGINA
  await page.waitForSelector('input[name="day"]', { visible: true });
  await page.type('#day', '01');
  await page.waitForSelector('#year');
  await page.type('#year', '1992');
  const selectItemScript = `
    const comboBox = document.querySelector('#month');
    comboBox.selectedIndex = ${1};
    comboBox.dispatchEvent(new Event('change'));`;
  await page.evaluate(selectItemScript);

  const selectItemScript2 = `
    const comboBox2 = document.querySelector('#gender');
    comboBox2.selectedIndex = ${2};
    comboBox2.dispatchEvent(new Event('change'));`;
  await page.evaluate(selectItemScript2);

  await page.waitForSelector('#birthdaygenderNext > div > button > span');
  await new Promise(function (resolve) { setTimeout(resolve, 1000) });
  await page.click('#birthdaygenderNext > div > button > span');

  //TERCEIRA PAGINA
  await new Promise(function (resolve) { setTimeout(resolve, 2000) });
  await page.waitForSelector('#selectionc2');
  const elemento = await page.$('#selectionc2');
  const texto = await page.evaluate(elemento => elemento.textContent, elemento);
  console.log(texto); // Isso irá imprimir o texto dentro do elemento
  await new Promise(function (resolve) { setTimeout(resolve, 3000) });
  await page.click('#selectionc2');
  await page.click('#next > div > button > div.VfPpkd-RLmnJb');

  //QUARTA PAGINA
  await new Promise(function (resolve) { setTimeout(resolve, 4000) });
  console.log('1');
  await page.waitForSelector('#passwd');
  await new Promise(function (resolve) { setTimeout(resolve, 1000) });
  console.log('2');
  await page.waitForSelector('#confirm-passwd');
  console.log('3');

  await page.type('#passwd', '6lxTczLPhtA');
  await new Promise(function (resolve) { setTimeout(resolve, 1000) });
  await page.type('input[name="PasswdAgain"]', '6lxTczLPhtA');
  await page.click('#createpasswordNext > div > button > div.VfPpkd-RLmnJb');









  //await page.waitForSelector('input[type="email"]');
  //await page.type('input[type="email"]', email);
  // await page.click('#identifierNext');
  // return
  // await page.waitFor(5000);

  // await page.waitForSelector('input[type="password"]');
  //  await page.type('input[type="password"]', 1234);
  // await page.keyboard.type(password);

  //await page.evaluate(() => {
  //    document.querySelector('#passwordNext').click();
  //});



  //await page.waitForNavigation();

  const loggedInUrl = page.url();
  //await browser.close();

  return loggedInUrl.includes('inbox');
}

async function main() {
  const wordlistFile = 'wordlist.txt'; // Nome do arquivo de wordlist
  await login('123', '456');
}

main().catch(console.error);