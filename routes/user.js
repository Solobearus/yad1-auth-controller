const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

exports.signin = (req, res) => {
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
            // const token = jwt.sign(
            //     { _id: user._id },
            //     'armadilo12',
            //     //TODO:
            //     // {
            //     //     // expiresIn: "12h",
            //     //     algorithm: "RS256"
            //     // }
            // );
            const token = jwt.sign(result.id, process.env.SECRET_KEY);

            return res.json(token);
        })
        .catch(err => res.status(400).json({ err }))

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