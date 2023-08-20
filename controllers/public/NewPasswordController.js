/**
 * Desde aqui se resetea la contraseña
 */

const { 
    responseJSON
} = require('../../helpers/response/data');

const {
    selectQuery, 
    updateQuery,
    deleteQuery
} = require('../../helpers/sql/selets');

const bcrypt = require('bcryptjs');

const { 
    generarJWT 
} = require('../../helpers/tokenJWT');

const newPassword = async (req = request, res = response) => {
    
    const { email, password, confirm_password } = req.body;
    const token = req.params.token;

    if(password != confirm_password){

        return responseJSON(
            res, 
            'error', 
            'Your password does not match', 
            404
        );    

    }

    const tokenExiste = await selectQuery('reset_password', `token = '${token}' && email = '${email}'`, '*');

    if(!tokenExiste.length){
        return responseJSON(
            res, 
            'error', 
            "This token is incorrect", 
            401
        );
    }

    // Volvemos a ingresar los datos del usuario
    const userExiste = await selectQuery('users', `email = '${email}'`, '*');

    // Obtenemos el primero usuario
    const data = userExiste[0]; 


    // Si el usuario existe, entonces le generamos un nuevo token
    const newToken = await generarJWT(data.id);

    // Generamos la nueva contraseña
    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync(password, salt);

    // Insertamos el nuevo token y la nueva contraseña
    await updateQuery('users', `id = ${data.id}`, `token = '${newToken}', password = '${pass}'`);

    // Cuando todo se genero con exito, entonces eliminamos el items de resetear la contraseña

    await deleteQuery('reset_password', `email = '${email}'`);

    // Contiene los datos del usuario
    const jsonCode = {
        'token': newToken,
        'name': data.name
    }
    
    return responseJSON(
        res, 
        'successfull', 
        jsonCode, 
        202
    );

}

module.exports = {
    newPassword
}