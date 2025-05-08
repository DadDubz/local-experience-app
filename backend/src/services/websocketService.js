const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/errorhandler"); // lowercase

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Store connected users
    this.initialize();
  }

  initialize() {
    this.wss.on("connection", async (ws, req) => {
      try {
        const userId = await this.authenticateConnection(req);
        this.clients.set(userId, ws);
        console.log(`[WS] Connected: ${userId}, Total: ${this.clients.size}`);

        ws.on("message", async (message) => {
          try {
            let data;
            try {
              data = JSON.parse(message);
            } catch (err) {
              throw new Error("Invalid JSON format");
            }

            await this.handleMessage(userId, data);
          } catch (err) {
            this.sendError(ws, err);
          }
        });

        ws.on("close", () => {
          this.clients.delete(userId);
          this.broadcastUserStatus(userId, "offline");
        });

        this.sendWelcomeMessage(ws, userId);
      } catch (err) {
        this.sendError(ws, err);
        ws.close();
      }
    });
  }

  async authenticateConnection(req) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        throw errorHandler.handleAuthorizationError("No token provided");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;
    } catch (err) {
      throw errorHandler.handleAuthorizationError("Invalid or expired token");
    }
  }

  async handleMessage(userId, data) {
    switch (data.type) {
      case "location_update":
        await this.handleLocationUpdate(userId, data.payload);
        break;

      case "chat_message":
        await this.handleChatMessage(userId, data.payload);
        break;

      case "status_update":
        await this.handleStatusUpdate(userId, data.payload);
        break;

      default:
        console.warn(`[WS] Unknown message type from ${userId}: ${data.type}`);
        throw new Error("Unknown message type");
    }
  }

  async handleLocationUpdate(userId, location) {
    const nearbyUsers = await this.findNearbyUsers(location);
    this.broadcastToUsers(nearbyUsers, {
      type: "nearby_user",
      payload: { userId, location },
    });
  }

  async handleChatMessage(userId, { recipientId, message }) {
    const recipientWs = this.clients.get(recipientId);
    if (recipientWs) {
      this.sendToClient(recipientWs, {
        type: "chat_message",
        payload: {
          senderId: userId,
          message,
          timestamp: new Date(),
        },
      });
    }
  }

  async handleStatusUpdate(userId, status) {
    this.broadcastUserStatus(userId, status);
  }

  broadcastUserStatus(userId, status) {
    this.broadcast({
      type: "user_status",
      payload: {
        userId,
        status,
        timestamp: new Date(),
      },
    });
  }

  sendToClient(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  broadcastToUsers(userIds, data) {
    userIds.forEach((id) => {
      const ws = this.clients.get(id);
      if (ws) {
        this.sendToClient(ws, data);
      }
    });
  }

  broadcast(data) {
    this.clients.forEach((ws) => {
      this.sendToClient(ws, data);
    });
  }

  sendError(ws, error) {
    this.sendToClient(ws, {
      type: "error",
      payload: {
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      },
    });
  }

  sendWelcomeMessage(ws, userId) {
    this.sendToClient(ws, {
      type: "welcome",
      payload: {
        userId,
        message: "Connected to WebSocket server",
        timestamp: new Date(),
      },
    });
  }

  async findNearbyUsers(location) {
    // 🔧 Replace this with DB query or geolocation logic
    return [];
  }
}

module.exports = WebSocketService;