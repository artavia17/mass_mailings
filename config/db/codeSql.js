const MySqlConnect = require('./connection');

// Call class MYSQLConnect for execute code SQL

const sql =  async (code, consult) => {

    // Init class MySQLConnnect
    const db = new MySqlConnect;

    // Generate the response at code SQL execute
    const response = await db.mysql(code, consult);

    // Return response
    return response;

}

module.exports = sql;