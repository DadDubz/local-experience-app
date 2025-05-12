const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../middleware/ErrorHandler');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map(); // Store client connections
        this.initialize();
    }

    initialize() {
        this.wss.on('connection', async (ws, req) => {
            try {
                // Authenticate connection
                const userId = await this.authenticateConnection(req);

                // Store client connection
                this.clients.set(userId, ws);

                // Handle messages
                ws.on('message', async (message) => {
                    try {
                        await this.handleMessage(userId, message);
                    } catch (error) {
                        this.sendError(ws, error);
                    }
                });

                // Handle client disconnect
                ws.on('close', () => {
                    this.clients.delete(userId);
                    this.broadcastUserStatus(userId, 'offline');
                });

                // Send initial data
                this.sendWelcomeMessage(ws, userId);

            } catch (error) {
                this.sendError(ws, error);
                ws.close();
            }
        });
    }

    async authenticateConnection(req) {
        const token = req.url.split('=')[1]; // Get token from URL
        if (!token) {
            throw ErrorHandler.handleAuthorizationError('No token provided');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.id;
        } catch (error) {
            throw ErrorHandler.handleAuthorizationError('Invalid token');
        }
    }

    async handleMessage(userId, message) {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'location_update':
                    await this.handleLocationUpdate(userId, data.payload);
                    break;

                case 'chat_message':
                    await this.handleChatMessage(userId, data.payload);
                    break;

                case 'status_update':
                    await this.handleStatusUpdate(userId, data.payload);
                    break;

                default:
                    throw new Error('Unknown message type');
            }
        } catch (error) {
            throw error;
        }
    }

    async handleLocationUpdate(userId, location) {
        // Update user's location and notify relevant clients
        const nearbyUsers = await this.findNearbyUsers(location);
        this.broadcastToUsers(nearbyUsers, {
            type: 'nearby_user',
            payload: {
                userId,
                location
            }
        });
    }

    async handleChatMessage(userId, messageData) {
        // Store chat message and send to recipient
        const recipientWs = this.clients.get(messageData.recipientId);
        if (recipientWs) {
            this.sendToClient(recipientWs, {
                type: 'chat_message',
                payload: {
                    senderId: userId,
                    message: messageData.message,
                    timestamp: new Date()
                }
            });
        }
    }

    async handleStatusUpdate(userId, status) {
        // Broadcast user status to relevant clients
        this.broadcastUserStatus(userId, status);
    }

    sendToClient(ws, data) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    broadcastToUsers(userIds, data) {
        userIds.forEach(userId => {
            const ws = this.clients.get(userId);
            if (ws) {
                this.sendToClient(ws, data);
            }
        });
    }

    broadcastUserStatus(userId, status) {
        this.broadcast({
            type: 'user_status',
            payload: {
                userId,
                status,
                timestamp: new Date()
            }
        });
    }

    broadcast(data) {
        this.clients.forEach(client => {
            this.sendToClient(client, data);
        });
    }

    sendError(ws, error) {
        this.sendToClient(ws, {
            type: 'error',
            payload: {
                message: error.message,
                code: error.code
            }
        });
    }

    sendWelcomeMessage(ws, userId) {
        this.sendToClient(ws, {
            type: 'welcome',
            payload: {
                userId,
                timestamp: new Date(),
                message: 'Connected to WebSocket server'
            }
        });
    }

    async findNearbyUsers(location) {
        // Implement logic to find nearby users
        // This would typically query your database
        return [];
    }
}

module.exports = WebSocketService;
