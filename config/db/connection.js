const mysql = require('mysql');

class MySqlConnect{

    async mysql(code, consult){

        // Validate credential MYSQL
        const connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });

        // Create connection MYSQL
        await connection.connect(function(err){
            if(err){
                console.error(`Error connecting to database: ${err.stack}`);
                return;
            }
        })

        // Execute the function queryBD (Code => SQL Code) (Connection => Execute the validate sql credentials)
        return await this.queryDB(connection, code, consult);

    }

    // Execute code SQL for create consults
    async queryDB(connection, code, consult){

        // Code SQL
        const sql = code;


        // Wait for the SQL code to execute
        return new Promise( (resolve, reject) =>{

            connection.query(sql, consult , function (err, result) {
                if (err) {

                    // Return failed the code SQL
                    reject(err);

                } else {

                    // Successfully return SQL code
                    resolve(result);
                    
                };
                
            });
        });

    }



}

module.exports = MySqlConnect;