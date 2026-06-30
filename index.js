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
        porcentajeComida: constrain(parseInt(porcentajeComida), 0, 100),
        distanciaCm: parseFloat(distanciaCm),
        ultimaActualizacion: new Date().toLocaleString("es-EC", { timeZone: "America/Guayaquil" })
    };

    console.log("Datos recibidos:", estadoAlimentador);
    res.status(200).json({ status: "success" });
});

function constrain(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

app.get('/api/status', (req, res) => {
    res.json(estadoAlimentador);
});

// INTERFAZ ELEGANTE Y ANIMADA
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Panel Premium - Control de Alimentos</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #6366f1;
                --primary-light: #e0e7ff;
                --success: #10b981;
                --danger: #ef4444;
                --danger-bg: #fee2e2;
                --dark: #0f172a;
                --text-muted: #64748b;
            }

            body {
                font-family: 'Plus Jakarta Sans', sans-serif;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 20px;
            }

            .container {
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 32px;
                padding: 40px;
                width: 100%;
                max-width: 400px;
                box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.6);
                text-align: center;
                position: relative;
                box-sizing: border-box;
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .container:hover {
                transform: translateY(-6px);
            }

            .live-badge {
                position: absolute;
                top: 24px;
                right: 24px;
                background: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                color: var(--dark);
                display: flex;
                align-items: center;
                gap: 6px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            }

            .pulse {
                width: 8px;
                height: 8px;
                background: var(--success);
                border-radius: 50%;
                animation: blink 1.5s infinite;
            }

            h1 {
                font-size: 24px;
                color: var(--dark);
                margin: 10px 0 4px 0;
                font-weight: 700;
            }

            .subtitle {
                font-size: 14px;
                color: var(--text-muted);
                margin-bottom: 35px;
            }

            /* Contenedor de nivel circular/óvalo */
            .level-wrapper {
                position: relative;
                width: 160px;
                height: 160px;
                margin: 0 auto 30px auto;
                background: var(--primary-light);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 0 4px 10px rgba(0,0,0,0.05);
                overflow: hidden;
            }

            .water-fill {
                position: absolute;
                bottom: 0;
                width: 100%;
                background: linear-gradient(180deg, var(--primary) 0%, #4f46e5 100%);
                transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 0 0 50% 50%;
            }

            .level-text {
                position: relative;
                font-size: 38px;
                font-weight: 700;
                color: var(--dark);
                transition: color 0.5s ease;
                z-index: 2;
            }

            .level-text.white {
                color: white;
            }

            .metric-info {
                font-size: 15px;
                color: var(--dark);
                font-weight: 500;
                background: #f1f5f9;
                padding: 12px;
                border-radius: 16px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .metric-info span {
                color: var(--text-muted);
                font-size: 13px;
            }

            .alert-banner {
                background: var(--danger-bg);
                color: var(--danger);
                padding: 14px;
                border-radius: 18px;
                font-size: 14px;
                font-weight: 600;
                display: none;
                animation: slideDown 0.4s ease forwards;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
            }

            .footer-date {
                font-size: 12px;
                color: var(--text-muted);
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #f1f5f9;
            }

            .footer-date strong {
                color: var(--dark);
            }

            @keyframes blink {
                0% { transform: scale(0.9); opacity: 0.4; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(0.9); opacity: 0.4; }
            }

            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>

        <div class="container">
            <div class="live-badge">
                <div class="pulse" id="pulse-dot"></div> MONITOR
            </div>

            <h1>PetFeeder Pro 🐾</h1>
            <div class="subtitle">Depósito de comida actual</div>

            <div class="level-wrapper">
                <div id="water" class="water-fill" style="height: 100%;"></div>
                <div id="comida-txt" class="level-text">--%</div>
            </div>

            <div class="metric-info">
                <span>Sensor Ultrasónico</span>
                <strong id="distancia-txt">-- cm</strong>
            </div>

            <div id="alerta-box" class="alert-banner">
                ⚠️ ALERTA: Rellenar el depósito inmediato
            </div>

            <div class="footer-date">
                Sincronizado:<br><strong id="fecha-txt">Esperando datos...</strong>
            </div>
        </div>

        <script>
            async function actualizarUI() {
                try {
                    const res = await fetch('/api/status');
                    const datos = await res.json();
                    
                    const porcentaje = datos.porcentajeComida;
                    
                    // Actualizar texto y barra de carga fluida
                    document.getElementById('comida-txt').innerText = porcentaje + '%';
                    const water = document.getElementById('water');
                    water.style.height = porcentaje + '%';
                    
                    // Cambiar color de texto según la altura del nivel de comida
                    if(porcentaje > 52) {
                        document.getElementById('comida-txt').classList.add('white');
                    } else {
                        document.getElementById('comida-txt').classList.remove('white');
                    }

                    document.getElementById('distancia-txt').innerText = datos.distanciaCm.toFixed(1) + ' cm';
                    document.getElementById('fecha-txt').innerText = datos.ultimaActualizacion || 'Sin registros';
                    
                    // Alerta elegante al bajar de 10%
                    const alerta = document.getElementById('alerta-box');
                    const pulseDot = document.getElementById('pulse-dot');
                    
                    if (porcentaje <= 10) {
                        alerta.style.display = 'block';
                        water.style.background = 'linear-gradient(180deg, var(--danger) 0%, #b91c1c 100%)';
                        pulseDot.style.background = 'var(--danger)';
                    } else {
                        alerta.style.display = 'none';
                        water.style.background = 'linear-gradient(180deg, var(--primary) 0%, #4f46e5 100%)';
                        pulseDot.style.background = 'var(--success)';
                    }
                } catch (err) {
                    console.error("Error obteniendo datos de API:", err);
                }
            }

            actualizarUI();
            setInterval(actualizarUI, 3000);
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
