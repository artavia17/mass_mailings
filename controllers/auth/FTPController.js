const User = require('../../models/UserInformation');
const sql = require('../../config/db/codeSql');

const FTPConfig = async (req, res) => {

    // User ID
    const user = new User;
    const id_user = await user.get_id(req);

    const { transport, host, port, encryption, username, password } = req.body;


    const slq_code = `SELECT COUNT(*) as count FROM config WHERE user_id = ?`;
    const result = await sql(slq_code, id_user);
    const count = result[0];

    if(count.count){

        const sql_update = `UPDATE config SET transport='${transport}',host='${host}',port='${port}',encryption='${encryption}',username='${username}',password='${password}' WHERE user_id = ?`;
        await sql(sql_update, id_user);

        return res.status(201).json({
            'data': {
                'code' : 201,
                'msg': 'Successfully updated',
            }
        })

    }else{

        const sql_save = `INSERT INTO config (user_id, transport, host, port, encryption, username, password) VALUES ('${id_user}','${transport}','${host}','${port}','${encryption}','${username}','${password}')`;
        await sql(sql_save);

        return res.status(201).json({
            'data': {
                'code' : 201,
                'msg': 'Save successfully',
            }
        })
    }



}


module.exports = {
    FTPConfig
}