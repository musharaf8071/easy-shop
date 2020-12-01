const users = require('../../lib/users');
const dbSelect = require('../../db/dbSelect');

async function getPerson(token){
    let id = users.getUser(token);
    let query =
        `SELECT PERSON_ID, FIRST_NAME, LAST_NAME, EMAIL,
                MOBILE, IMAGE, ADDRESS
         FROM PERSONS
         WHERE PERSON_ID = \'${id}\'`;
    return await dbSelect.executeQuery(query);
}

module.exports = {
    getPerson
}
