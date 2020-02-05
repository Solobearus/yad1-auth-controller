const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const crypto = require('crypto');

exports.signin = (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({msg: "Missing email or password"});
    }
    fetch('http://localhost:3000/ReadByEmailAndPassword', {
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
                    error: 'User with that email does not exist, please signup.'
                });
            }

            const token = jwt.sign({ _id: result.id }, process.env.SECRET_KEY);
            return res.json({ token });
        })
        .catch(err => res.status(400).json({ msg: "An error has occurred while trying to sign-in." }))

};

exports.signup = (req, res) => {

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
}