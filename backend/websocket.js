import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'

const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws, req) => {
        // Extract token from query string
        const token = new URL(req.url, 'ws://localhost').searchParams.get('token')
        
        if (!token) {
            ws.close()
            return
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            ws.userId = decoded.id
        } catch (err) {
            ws.close()
            return
        }

        ws.on('message', (data) => {
            const message = JSON.parse(data)
            
            // Broadcast to all connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message))
                }
            })
        })
    })

    return wss
}

export default setupWebSocket 