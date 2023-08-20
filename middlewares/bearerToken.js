const sql = require('../config/db/codeSql');

const bearerToken =  async (req, res, next) => {


    const authHeader = req.headers.authorization;

    if(authHeader){

        // Get token
        const token = authHeader.split(' ')[1];

        // Validate el user
        const consult_sql = `SELECT COUNT(id) as count FROM users WHERE token = '${token}'`;
        const query_consult = await sql(consult_sql);

        if(query_consult){
            const response = query_consult[0].count;
            // Validate the authorization
            if(response){
                next();
            }else{
                res.status(401).json({
                    'error': {
                        'code' : 401,
                        'msg': 'Unauthorized',
                    }
                })
            }
        }


    }else{
        res.status(401).json({
            'error': {
                'code' : 401,
                'msg': 'Unauthorized',
            }
        })
    }
    

}


module.exports = bearerToken;