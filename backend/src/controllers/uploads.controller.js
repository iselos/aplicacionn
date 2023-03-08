import { request, response } from 'express';
import { getConnection } from '../database/database';
import { cargarArchivos } from '../helpers/cargar-archivos';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';


const subirArchivo = async (req = request, res = response) => {

    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).send('Los archivos no han sido subidos.');
    }

    const pathUpload = await cargarArchivos(req.files, undefined, 'images/users');

    return res.json(
        pathUpload
    );

}

const getImage = async (req = request, res = response) => {

    const { username } = req.params;

    try {
        
        const connection = await getConnection();
        const user = await connection.query('SELECT id, username, avatar FROM accounts WHERE id = ? OR username = ? ', [ username ]);

        if (user.length < 1) {
            return res.status(400).json({
                msg: `No se pudo traer el avatar`
            });

        } else {
            //limpiar imagenes previas
            const img = user[0].avatar;

            if (img) {
                const pathImage = join(__dirname, '../uploads/images', username, img);
                if (existsSync(pathImage)) {
                    console.log(pathImage);
                    return res.sendFile(pathImage);
                }
            } else {
                return res.status(500).json({
                    ok: false,
                    msg: error.msg
                });
            }
        }

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'No se pudo traer la imagen del usuario',
            error: error
        })
    }
}


const updateImage = async (req = request, res = response) => {

    const { username } = req.params;

    try {

        const connection = await getConnection();
        const user = await connection.query('SELECT username, avatar FROM accounts WHERE username = ? ', username);

        //   limpiar imagenes previas
        const img = user[0].avatar;

        if (img) {
            const pathImage = join(__dirname, '../uploads/images', username, img);
            if (existsSync(pathImage)) {
                unlinkSync(pathImage);
            }
        }

        const nombreImagen = await cargarArchivos(req.files, undefined, 'images/users');
        await connection.query('UPDATE accounts SET avatar = ? WHERE username = ?', [nombreImagen, username]);

        return res.status(200).json({
            ok: true,
            msg: 'imagen actualizada con exito!'
        });


    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'No se pudo actualizar la imagen',
            error: error
        });

    }
}


module.exports = {
    subirArchivo,
    updateImage,
    getImage
}