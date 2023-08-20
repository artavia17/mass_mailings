const xlsx = require('xlsx');
const User = require('../../models/UserInformation');
const sql = require('../../config/db/codeSql');

const ExelUsers = async (req, res) => {

    // Get data excel
    const workbook = xlsx.read(req.file.buffer, {type: 'buffer'});
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // User ID
    const user = new User;
    await user.get_id(req).then( id =>{

        if(data.length <= 5000){
            data.forEach( async e=>{
                const email = e[1];
                const name = e[0];
                // console.log(name);
    
                // Save data
                const contacts_save_sql = `INSERT INTO contacts (user_id, name, email) VALUES ('${id}','${name}','${email}')`;
                await sql(contacts_save_sql, id);
    
            })

            return res.status(201).json({
                'data': {
                    'code' : 201,
                    'msg': 'Save successfully',
                    'legth': data.length,
                }
            })

        }else{
            return res.status(405).json({
                'error': {
                    'code' : 405,
                    'msg': 'You can only upload 5000 data per excel',
                }
            })
        }




    }).catch(err => {
        return res.status(401).json({
            'error': {
                'code' : 401,
                'msg': 'Unauthorized',
                err
            }
        })
    });

}


const SaveIndividual =  async (req, res) => {

    const { email, name } = req.body;

    // User ID
    const user = new User;
    await user.get_id(req).then( async id =>{

        // Save data
        const contacts_save_sql = `INSERT INTO contacts (user_id, name, email) VALUES ('${id}','${name}','${email}')`;
        await sql(contacts_save_sql, id);

        return res.status(201).json({
            'data': {
                'code' : 201,
                'msg': 'Save successfully',
            }
        })


    }).catch(err => {
        return res.status(401).json({
            'error': {
                'code' : 401,
                'msg': 'Unauthorized',
                err
            }
        })
    });

}

const UpdateIndividual = async (req, res) => {

    const { email, name } = req.body;

    const {id_contact} = req.query;

    // User ID
    const user = new User;
    await user.get_id(req).then( async id =>{

        // Save data
        const contacts_save_sql = `UPDATE contacts SET  name='${name}', email='${email}' WHERE id="${id_contact}" && user_id="${id}"`;
        await sql(contacts_save_sql);

        return res.status(201).json({
            'data': {
                'code' : 201,
                'msg': 'Save successfully',
            }
        })


    }).catch(err => {
        return res.status(401).json({
            'error': {
                'code' : 401,
                'msg': 'Unauthorized',
                err
            }
        })
    });

}


const DeleteIndividual =  async (req, res) => {

    const {id_contact} = req.query;

    // User ID
    const user = new User;
    await user.get_id(req).then( async id =>{

        // Save data
        const contacts_save_sql = `DELETE FROM contacts WHERE id="${id_contact}" && user_id="${id}"`;
        await sql(contacts_save_sql);

        return res.status(202).json({
            'data': {
                'code' : 202,
                'msg': 'Save successfully',
            }
        })


    }).catch(err => {
        return res.status(401).json({
            'error': {
                'code' : 401,
                'msg': 'Unauthorized',
                err
            }
        })
    });

}


const GetIndividual =  async (req, res) => {
    // User ID
    const user = new User;
    await user.get_id(req).then( async id =>{

        // Save data
        const contacts_save_sql = `SELECT id, name, email FROM contacts  WHERE user_id = ${id} ORDER BY id DESC`;
        const data = await sql(contacts_save_sql);

        return res.status(200).json({
            'data': {
                'code' : 200,
                'items': data
            }
        })


    }).catch(err => {
        return res.status(401).json({
            'error': {
                'code' : 401,
                'msg': 'Unauthorized',
                err
            }
        })
    });
}

const SearchIndividual = async (req, res) => {

    const { search } = req.body;

    // User ID
    const user = new User;
    await user.get_id(req).then( async id =>{

        // Save data
        const contacts_save_sql = `SELECT id, name, email FROM contacts WHERE (user_id = ${id} && name LIKE '%${search}%') OR (user_id = ${id} && email LIKE '%${search}%') ORDER BY id DESC`;
        const data = await sql(contacts_save_sql);

        return res.status(200).json({
            'data': {
                'code' : 200,
                'items': data
            }
        })


    }).catch(err => {
        return res.status(401).json({
            'error': {
                'code' : 401,
                'msg': 'Unauthorized',
                err
            }
        })
    });

}

module.exports = {
    ExelUsers,
    SaveIndividual,
    UpdateIndividual,
    DeleteIndividual,
    GetIndividual,
    SearchIndividual
}