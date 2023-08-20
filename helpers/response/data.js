/**
 * En este archivo generamos todas las respuestas
 */

function responseJSON(res, type, content, code){

    return res.status(code).json({
        [type] : {
            'code': code,
            'data': content
        }
    });

}

module.exports = {
    responseJSON
}