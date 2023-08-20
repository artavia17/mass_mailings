const jwt = require('jsonwebtoken');


class User {

    constructor(){
        this.userid = 1;

    }

    async get_id(req){

         // Bearer token
        const authHeader = req.headers.authorization;

        //Token
        const token = authHeader.split(' ')[1];


        return new Promise((resolve, reject)=>{
            jwt.verify(token, process.env.SECRETORPRIVATEKEY, async (err, decoded) =>{

                if(err){
                    reject(err)
                }else{
                    const {uid} = decoded;
                    resolve(uid)
                }
            })
        })


    }

}

module.exports = User