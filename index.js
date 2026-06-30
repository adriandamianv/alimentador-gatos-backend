const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let estadoAlimentador = {
    porcentajeComida: 100,
    distanciaCm: 0,
    ultimaActualizacion: null
};

app.post('/api/status', (req, res) => {
    const { porcentajeComida, distanciaCm } = req.body;
    
    estadoAlimentador = {
        porcentajeComida: parseInt(porcentajeComida),
        distanciaCm: parseFloat(distanciaCm),
        ultimaActualizacion: new Date().toLocaleString("es-EC", { timeZone: "America/Guayaquil" })
    };

    console.log("Datos recibidos:", estadoAlimentador);
    res.status(200).json({ status: "success" });
});

app.get('/api/status', (req, res) => {
    res.json(estadoAlimentador);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
