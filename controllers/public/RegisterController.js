/**
 * En este archivo manejamos el registro de usuarios
 */

const { response, request} = require('express');
const bcrypt = require('bcryptjs');

const { 
    generarJWT 
} = require('../../helpers/tokenJWT');

const {
    selectQuery, 
    updateQuery, 
} = require('../../helpers/sql/selets');

const { 
    responseJSON
} = require('../../helpers/response/data');


const register = async ( req = request, res = response) => {

    try{

        // Obtenemos los parametros del body
        const { name, email, password } = await req.body;
        
        // Validamos si existe el usuario
        const result = await selectQuery('users', `email = '${email}'`, "COUNT(*) as 'exist'");
        const exist = result[0].exist;

        if(exist){
            return responseJSON(
                res, 
                'error', 
                'This email is already registered', 
                422
            );
        }

        //  Encriptamos la contraseña
        const salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync(password, salt);


        // Guardamos los usuarios
        const {insertId} = await insertQuery(
            'users', 
            '`name`, `email`, `password`', 
            `'${name}', '${email}', '${pass}'`
        );

        // Generamos el nuevo token de usuario
        const token = await generarJWT(insertId);

        // Save token user
        await updateQuery('users', `id = ${insertId}`, `token = '${token}'`);

        // Definimos la respuesta
        const jsonCode = {
            'token': token,
            'name': name,
        }

        // Retornamos la respuesta al usuario
        return responseJSON(
            res, 
            'data', 
            jsonCode, 
            201
        );

    }catch(err){
        // Obtenemos algun posible error
        res.status(400);
    }

}

module.exports = {
    register
}