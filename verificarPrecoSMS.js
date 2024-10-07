const axios = require('axios');


getPrices();

async function getPrices() {
    for (let i = 1; i <= 201; i++) {
        await new Promise(function (resolve) { setTimeout(resolve, 100) });
        await getPriceGoole(i);
    }
   /* console.log('2	Kazakhsta');
    console.log('4	Philippines');
    console.log('6	Indonesia');
    console.log('7	Malaysia');
    console.log('8	Kenya');
    console.log('10	Vietnam');
    console.log('12	Usa');
    console.log('13	Israel');
    console.log('22	India');
    console.log('31	Southafrica');
    console.log('32	Romania');
    console.log('40	Uzbekistan	');   */
}


async function getPriceGoole(codPais) {
    axios.get('https://smshub.org/stubs/handler_api.php?api_key=177294U15a8640801c39bf11bacebea6d324b6b&action=getPrices&service=go&country=' + codPais)
        .then(res => {
            const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            //console.log('Status Code:', res.status);
            //console.log('Date in Response header:', headerDate);

            const goObject = res.data[codPais].go;
            // Convertendo o objeto 'go' em uma matriz de pares chave-valor
            const keyValueArray = Object.entries(goObject);
            const primeiraLinha = keyValueArray[0];
           
            if (primeiraLinha[0] < 5) {
                if (primeiraLinha != null) {
                    console.log('Pais:' + codPais + '|' + primeiraLinha);
                }
            }

        })
        .catch(err => {
            //console.log('Error: ', err.message);
        });
}