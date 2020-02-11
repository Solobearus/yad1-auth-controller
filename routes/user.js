const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
var express = require('express');

var authRouter = express.Router();

authRouter.post('/signin', function (req, res, next) {
    const { email, password } = req.body;

    fetch('http://localhost:3002/ReadByEmailAndPassword', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(result => result.json())
        .then(result => {
            if (!result.id) {
                return res.status(400).json({
                    error: 'User with that email does not exist. Please signup'
                });
            }
            const token = jwt.sign(
                { _id: result.id },
                process.env.SECRET_KEY,
                {
                    algorithm: "HS256",
                    expiresIn: "12h"
                }
            );

            return res.json({
                name: result.name,
                token
            });
        })
        .catch(err => res.status(400).json({ err }));
})

authRouter.post('/signup', function (req, res, next) {

    fetch('http://localhost:3002/', {
        method: 'post',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(result => result.json())
        .then(result => {
            if (result.err) {
                return res.status(400).json(result);
            }
            res.status(201).json(result);
        })
})


authRouter.post('/verify', function (req, res, next) {

    jwt.verify(
        req.body.token,
        process.env.SECRET_KEY,
        {
            algorithm: ["HS256"],
        },
        (err, decoded) => {
            // console.log("wtf is going on here:");
            // console.log("err:",err);
            // console.log("decoded:",decoded);
            
            if (err) {
                return res.status(400).json({ err: 'the provided token is invalid' });
            }
            return res.status(201).json(decoded);
        })
})

module.exports = authRouter;
