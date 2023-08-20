const User = require('../../models/UserInformation');
const sql = require('../../config/db/codeSql');
const nodemailer = require('nodemailer');

const SendEmail = async (req, res) => {

    // User ID
    const user = new User;
    await user.get_id(req).then( async id =>{


        const slq_code = `SELECT transport, host, port, encryption, username, password FROM config WHERE user_id = ?`;
        const result = await sql(slq_code, id);
        const data = result[0];
        const { host, port, encryption, username, password } = data;

        if(data){

            // Get emails

            const sql_emails = `SELECT email FROM contacts WHERE user_id = ?`;
            const json_all_email = await sql(sql_emails, id);
            const array_email = json_all_email.map(objeto => objeto.email);

            // Config_email

            const transporter = nodemailer.createTransport({
                host: host, // El servidor SMTP que usarás
                port: port,
                secure: encryption == 'true' ? true : false,
                auth: {
                  user: username, // Tu correo electrónico
                  pass: password // Tu contraseña
                }
            });

            // Get code email;
            const slq_code_html_email = `SELECT html, title FROM html_email WHERE user_id = 39`;
            const data = await sql(slq_code_html_email, id);
            const { html, title } = data[0];

            if(html && title){
                const destinatarios = array_email;
                const message = {
                    from: username,
                    to: destinatarios.join(', '),
                    subject: title,
                    html: html
                };

                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        return res.status(403).json({
                            'error': {
                                'code' : 403,
                                'msg': 'An error occurred while sending the email',
                                err
                            }
                        })
                    } else {
                        return res.status(202).json({
                            'data': {
                                'code' : 202,
                                'msg': 'The emails were sent successfully',
                                info,
                            }
                        })
                    }
                });

            }else{
                return res.status(402).json({
                    'error': {
                        'code' : 402,
                        'msg': 'Missing to configure the mail',
                    }
                })
            }

        }else{
            return res.status(402).json({
                'error': {
                    'code' : 402,
                    'msg': 'Missing server configuration',
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


module.exports = {
    SendEmail
}