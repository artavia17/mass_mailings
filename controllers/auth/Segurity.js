const { response } = require("express")

const segurityUser = (req, res) => {
    return res.status(202).json({
            'code' : 202,
    })
}


module.exports = {
    segurityUser
};