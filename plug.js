const apiKey = 'aab6990fa1f86fcb2c441df3bf709048';
if (fs.existsSync('./plugin/js/config_ac_api_key.js')) {
    let confData = fs.readFileSync('./plugin/js/config_ac_api_key.js', 'utf8');
    confData = confData.replace(/antiCapthaPredefinedApiKey = ''/g, `antiCapthaPredefinedApiKey = '${apiKey}'`);
    fs.writeFileSync('./plugin/js/config_ac_api_key.js', confData, 'utf8');
} else {
    console.error('plugin configuration not found!')
}