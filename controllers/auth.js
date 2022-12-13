const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se ha registrado'
            });
        }

        const usuario = new Usuario( req.body )

        // Encriptación
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt )

        await usuario.save();

        // JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (e) {

        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador del servidor.'
        });

    }

}

const login = async ( req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });        
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email incorrecto'
            });
        }

        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        const token = await generarJWT( usuarioDB.id );

        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
       
    } catch(e) {

        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador del servidor.'
        });

    }

}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    try {

        const token = await generarJWT( uid );

        const usuarioDB = await Usuario.findById(uid);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch(e) {

        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al administrador del servidor.'
        });

    }

}

module.exports = { crearUsuario, login, renewToken };