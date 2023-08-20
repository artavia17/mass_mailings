/**
 * En este archivo manejamos el reseteo de contraseña
 */

const { response, request} = require('express');

const {
    selectQuery,
    insertQuery 
} = require('../../helpers/sql/selets');

const { 
    responseJSON
} = require('../../helpers/response/data');

const { 
    generarJWT 
} = require('../../helpers/tokenJWT');

// const nodemailer = require('nodemailer');

const { mailsend }  = require('../../helpers/mail/config');

const reset  = async(req = request, res = response) => {
  
    const { email } = req.body;

    const result = await selectQuery('users', `email = '${email}'`, "COUNT(*) as 'exist'");
    const exist = result[0].exist;

    if(!exist){
        return responseJSON(
            res, 
            'error', 
            "This email isn't already registered", 
            422
        );
    }

    // Validamos si el correo electronico ya tiene un codigo de verificacion

    const resultVerification = await selectQuery('reset_password', `email = '${email}'`, "COUNT(*) as 'exist'");
    const existeVerification = resultVerification[0].exist;
    if(!existeVerification){
        // Generamos el nuevo token de usuario
        const token = await generarJWT(email);
        await insertQuery('reset_password', 'email, token', `'${email}', '${token}'`);
    }

    const tokenQuery = await selectQuery('reset_password', `email = '${email}'`, "*");
    const tokenExist = tokenQuery[0].token;


    const html = `<p>
                    Se ha solicitado un nuevo reestablecimiento de contraseña, para ingresar al enlace ingrese al siguiente enlace 
                    <a href="${process.env.APP_URL}/password/reset/${tokenExist}?email=${email}">${process.env.APP_URL}/password/reset/${tokenExist}?email=${email}</a> 
                  </p>`;

    await mailsend(`noreply@alonsocr.com`, email, 'Password Reset - Alonso CR', html);

    responseJSON(
        res, 
        'data', 
        'Send code in email', 
        201
    );

}

module.exports = {
    reset
};