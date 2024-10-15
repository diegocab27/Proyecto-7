const User = require("../models/user");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");


require("dotenv").config();

const create = async (req, res) => {
    try {
        const { name, username, password, active } = req.body;
        const user = await User.findOne({ username });

        if (user) {
            return res.status(409).json({ message: "El usuario ya existe." });
        }
        const salt = await bcryptjs.genSalt(parseInt(process.env.SALT || 10));
        const hashedPassword = await bcryptjs.hash(password, salt);


        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            active:true,
        });
        res.status(201).json(newUser);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "error al crear usuario" })

    }

};


const login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'usuario o password incorrecto' })
        }
        const passwordCorrect = await bcryptjs.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(400).json({ message: 'usuario o password incorrecto' })
        }

        if (!user.active) {
            return res.status(400).json({ message: 'usuario inactivo' })
        }

        const payload = { user: { id: user.id } }

        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: '1h'
            },
            (error, token) => {
                if (error) throw Error;
                res.status(200).json({ message: "Sesion iniciada", token,name:user.name,_id:user._id})

            }
        )


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "error en incio de sesion" })

    }

}


verifyToken = async (req, res) => {
    try {
        const foundUser = await User.findById(req.user.id).select("-password");

        return res.json({
            message: "Datos de usuario encontrados y verificados.",
            data: foundUser,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "El usuario no se encuentra identificado.",
        });
    }
};


update = async (req, res) => {

    try {
        const { name, username, password, active } = req.body;
        const user = await User.findOne({ username });
        if (user && user._id.toString() !== req.params.id) {
            return res.status(409).json({ message: "El username ya está en uso por otro usuario." });
        }

        const salt = await bcryptjs.genSalt(parseInt(process.env.SALT || 10));
        const hashedPassword = await bcryptjs.hash(password, salt);

        const usuarioActualizado = await User.findByIdAndUpdate(
            req.user.id,
            { name, username, password: hashedPassword, active },
            { new: true }
        ).select("-password");

        res.json({
            Message: "Usuario actualizado con éxito.",
            Usuario: usuarioActualizado,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Hubo un error actualizando el usuario.",
        });
    }
};




module.exports = { create, login, verifyToken, update }