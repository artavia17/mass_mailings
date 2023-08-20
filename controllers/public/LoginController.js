/**
 * En este archivo manejamos el Inicio de sesion
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


const login = async(req = request, res = response) => {
    
    try{
        // Obtenemos los parametros del body
        const { email, password } = req.body;

        // Verificamos si el usuario existe
        const userExiste = await selectQuery('users', `email = '${email}'`, '*');


        //  Si el usuario el correo no exite le enviamos este error
        if(!userExiste.length){
            return responseJSON(
                res, 
                'error', 
                'Incorrect email or password', 
                401
            );
        }

        // Obtenemos el primero usuario
        const data = userExiste[0]; 

        // Validamos la contraseña
        const validate_password = bcrypt.compareSync(password, data.password);

        //  Si la contraseña no coincide entonces le enviamos un error
        if(!validate_password){
            return responseJSON(
                res, 
                'error', 
                'Incorrect email or password', 
                401
            );
        }

        // Si el usuario existe, entonces le generamos un nuevo token
        const token = await generarJWT(data.id);

        // Insertamos el nuevo token
        await updateQuery('users', `id = ${data.id}`, `token = '${token}'`);

        // Contiene los datos del usuario
        const jsonCode = {
            'token': token,
            'name': data.name
        }

        // Retornamos los datos de usuario
        return responseJSON(
            res, 
            'data', 
            jsonCode, 
            200
        );
    }catch(err){
        // Obtenemos algun posible error
        res.status(400);
    }
}

module.exports = {
    login
}