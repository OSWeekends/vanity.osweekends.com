function apiRoutValidation (path) {
     return ['slack', 'twitter', 'github', 'meetup'].includes(path);
}

function  apiManagement  (gw, goblinDB) {
    const path = gw.pathParams.path;
    if(apiRoutValidation(path)){
        gw.json(goblinDB.get(path), {deep: 10} || 500);
    } else if (!path) {
        gw.json(goblinDB.get(), {deep: 10} || 500);
    } else {
        gw.json(404);
    }
}

module.exports = apiManagement;