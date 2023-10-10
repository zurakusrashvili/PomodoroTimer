const jwt = require('jsonwebtoken');
const User = require('../models/users')
const bcryptjs = require('bcryptjs');
const Setting = require('../models/settings');


exports.getAll = async (req, res, next) => {
    try {
        const users = await User.findAll();
        return res.status(201).json({ users });
    } catch (error) {
        return res.status(500).json("error: error");
    }
};


exports.register = async (req, res, next) => {
    try {
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        const USER_MODEL = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        };

        const user = await User.create(USER_MODEL);
        if (user) {
            await Setting.create({ userId: user.id });
        }
        return res.status(201).json({ user });

    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (user && (await validatePassword(password, user.password))) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

            res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });

            return res.status(200).json({ user: user.toJSON(), status: 200, token: token });

        } else {
            return res.status(401).json({
                success: false,
                status: 401,
                message: "Invalid credentials, password or username is incorrect",
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.logout = (req, res, next) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    return res.status(200).json({ message: "Logged out successfully" });
};


async function validatePassword(candidatePassword, userPassword) {
    try {
        return await bcryptjs.compare(candidatePassword, userPassword);
    } catch (e) {
        console.log("could not compare password due to an unknown error");
    }
}