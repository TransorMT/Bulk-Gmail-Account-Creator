const { GetSMS, ServiceApiError, TimeoutError, errors } = require('getsms')
 
const sms = new GetSMS({
  key: '177294U15a8640801c39bf11bacebea6d324b6b',
  url: 'https://smshub.org/stubs/handler_api.php',
  service: 'smshub'
});
 

get();

async function get() {
    await getSMSNumber();
}

async function getSMSNumber() {
  try {



    // eslint-disable-next-line camelcase
    const { balance_number } = await sms.getBalance()
    // eslint-disable-next-line camelcase
    if (balance_number > 0) {
      // Service - bd, operator - mts, country - russia (0)
      const { id, number } = await sms.getNumber('go', 'any', pais)
      console.log('Number ID:', id)
      console.log('Number:', number)
 
      // Set "message has been sent" status
      await sms.setStatus(1, id)
 
      // Wait for code
      const { code } = await sms.getCode(id)
      console.log('Code:', code)
 
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
            console.log('sem numero tentando outro'); 
            await getSMSNumber();
         }
         //console.error(error.code); 
        
      }
    } else console.error(error)
  }
}