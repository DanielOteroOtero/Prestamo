const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.post('/prestamo', (req, res) => {
    const requiredFields = ['id', 'nombre', 'apellido', 'titulo', 'autor', 'editorial', 'año'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.redirect("/error.html");
        }
    }
    const fileName = `id_${req.body.id}.txt`;
    const content = `${req.body.id}, ${req.body.nombre}, ${req.body.apellido}, ${req.body.titulo}, ${req.body.autor}, ${req.body.editorial}, ${req.body.año}`;
    fs.writeFile(path.join(__dirname, 'data', fileName), content, (err) => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
            return res.status(500).send('Error interno del servidor');
        }
        res.download(path.join(__dirname, 'data', fileName));
    });
});



app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
