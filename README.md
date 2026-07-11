# Alimentador de Gatos — Backend y Panel Web

Backend ligero en **Node.js (Express)** para monitorear un comedero automático de
mascotas en tiempo real. Recibe los datos del microcontrolador (ESP32/Arduino) y
los muestra en un panel web moderno.

## Características

- API REST para recibir y consultar el estado del comedero.
- Panel web "Premium" (estilo *glassmorphism*) con nivel de comida, lectura del
  sensor ultrasónico y alertas de depósito vacío.
- Actualización automática del panel cada 1.5 s.
- Zona horaria local de Guayaquil (`America/Guayaquil`).

## Endpoints

| Método | Ruta          | Descripción                                                        |
|--------|---------------|--------------------------------------------------------------------|
| POST   | `/api/status` | Recibe `{ porcentajeComida, distanciaCm, dispensando }` y actualiza el estado. |
| GET    | `/api/status` | Devuelve el estado actual del alimentador en JSON.                 |
| GET    | `/`           | Panel web de monitoreo.                                            |

## Cómo ejecutar

```bash
npm install
npm start
```

Por defecto corre en el puerto `3000` (o el definido en la variable de entorno `PORT`).

## Notas

- El estado se guarda **en memoria**: se reinicia si el servidor se apaga.
- El hardware envía `dispensando` como booleano o como texto `"true"`; el backend
  acepta ambos formatos.
- `porcentajeComida` se acota automáticamente al rango 0–100.
