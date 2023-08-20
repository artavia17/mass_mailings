const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('../route/api');
const MySqlConnect = require('./db/connection');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.middleware();
        this.routers();
        this.connect = new MySqlConnect;
    }
    
    routers(){
        this.app.use(bodyParser.json());

        // Api routes
        this.app.use('/api', router);
    }

    middleware(){

        // Lectura y parceo del body

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(bodyParser.json());
    }

   

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Corriendo servidor en el puerto: ${this.port}`);
        });
    }
}


module.exports = Server;