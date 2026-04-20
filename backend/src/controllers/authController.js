const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d' });
};

const comparePassword = async (password, hash) => {


    return await bcrypt.compare(password, hash);
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

const validateInput = (name, email, password) => {
    if (!name || !email || !password) {
        return false;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    if (password.trim().length < 6) {
        return false;
    }
    if (name.trim().length === 0) {
        return false;
    }
    return true;
};
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!validateInput(name, email, password)){
            return res.status(400).json({ message: 'Invalid input' });
        }
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: getToken(user._id)
        }); 
         


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // if(!validateInput(email, password)){
        //     return res.status(400).json({ message: 'Invalid input' });
        // }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const isPasswordMatch = await comparePassword(password, user.password);
        if (isPasswordMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: getToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Password incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}