const jwt = require('jsonwebtoken');
const sql = require('../../config/db/codeSql');

const Home = (req, res) => {


    const { html, title } = req.body;  

    // Bearer token
    const authHeader = req.headers.authorization;

    //Token
    const token = authHeader.split(' ')[1];

    // Get id user
    jwt.verify(token, process.env.SECRETORPRIVATEKEY, async (err, decoded) => {

        if(err){
            return res.status(401).json({
                'error': {
                    'code' : 401,
                    'msg': 'Unauthorized',
                    err
                }
            });
        }

        const {uid} = decoded;

        // Exist register?
        const register_view = `SELECT COUNT(*) as count , id FROM html_email WHERE user_id = ?`;
        const result = await sql(register_view, uid)
        const {count, id} = result[0];

        if(count){

            // Actualizar exito
            const update_sql = `UPDATE html_email SET html='${html}', title='${title}' WHERE id = ?`;
            await sql(update_sql, id);

            return res.status(201).json({
                'data': {
                    'code' : 201,
                    'msg': 'Successfully updated',
                }
            })
        }else{

            // Crear exito
            const create_sql = `INSERT INTO html_email (user_id, html, title) VALUES ('${uid}','${html}', '${title}')`;
            await sql(create_sql);

            return res.status(201).json({
                'data': {
                    'code' : 201,
                    'msg': 'Saved successfully',
                }
            })
        }
    
        

    })
}


const get_email = async (req, res) => {

    // Bearer token
    const authHeader = req.headers.authorization;

    //Token
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRETORPRIVATEKEY, async (err, decoded) => {

        if(err){
            return res.status(401).json({
                'error': {
                    'code' : 401,
                    'msg': 'Unauthorized',
                }
            }); 
        }

        const {uid} = decoded;

        // Create consult
        const get_sql = `SELECT title, html FROM html_email WHERE user_id = ?`;
        const execute = await sql(get_sql, uid);
        const data = execute[0];


        return res.status(200).json({
            'data': {
                'code' : 200,
                data
            }
        }); 

    });


}

module.exports = {
    Home,
    get_email
}