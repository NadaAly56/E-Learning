const { rateLimit } = require('express-rate-limit')


const limiterLogin = rateLimit({
    
    windowMs : 60 * 60 * 1000,
    max : 4,
    handler: (req, res) =>{
        res.status(429).json({
            message : `You finished the Number of adapters , you can try again later after an hour`,
            })

    },
    requestWasSuccessful: (req, res) => res.statusCode < 400,
    skipSuccessfulRequests : true,
})

module.exports = limiterLogin