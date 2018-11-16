const https = require('https');

function downloadFile (url) {
    return new Promise ((resolve, reject) => {
        https.get(url, (resp) => {
          let data = '';
        
          resp.on('data', (chunk) => {
            data += chunk;
          });
        
          resp.on('end', () => {
            resolve(JSON.parse(data));
          });
        }).on("error", reject);
    });
}

function requestHandler (url, name) {
 return function (goblinDB){
    console.time(`[organization API][${name.toUpperCase()}]`);
    console.log(`[organization API][${name.toUpperCase()}] has started`);
    downloadFile(url)
    .then(data => {
        goblinDB.set(data, name);
        console.log(`[organization API][${name.toUpperCase()}] has finished`);
        console.timeEnd(`[organization API][${name.toUpperCase()}]`);
    })
    .catch(err => {
        console.timeEnd(`[organization API][${name.toUpperCase()}][ERROR] ${err}`);
    });  
 };

}

module.exports = {
   communities: requestHandler('https://raw.githubusercontent.com/OSWeekends/Organizacion/master/data/communities.json', 'communities'),
   team: requestHandler('https://raw.githubusercontent.com/OSWeekends/Organizacion/master/data/team.json', 'team'),
   sponsors: requestHandler('https://raw.githubusercontent.com/OSWeekends/Organizacion/master/data/sponsors.json', 'sponsors')
};




