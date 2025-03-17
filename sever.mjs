import WebSocket, { WebSocketServer } from 'ws';
import Max from 'max-api';

// Start WebSocket Server
const wss = new WebSocketServer({ port: 8080 });

function getTime() {
    const currentTime = new Date(); // Get the current date and time
    const formattedTime = currentTime.toLocaleString(); // Format the time
    return formattedTime;
}

wss.on('connection', (ws) => {
    console.log(getTime() + ' - Client connected');

    ws.on('message', (data) => {
        let data_message = data;
        if (data.toString().split("\n").length > 5) {
            data_message = data.toString().split("\n").slice(0, 5).join("\n") + " ...........";
        }
        
        console.log(getTime() + ' - New message:', data_message.toString());
        Max.outlet(JSON.parse(data));
    });

    ws.on('close', () => {
        console.log(getTime() + ' - Client disconnected');
    });
});
