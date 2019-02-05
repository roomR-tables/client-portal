export class MqttClient {
    constructor(onMessageArrived) {
        this.client = new Paho.MQTT.Client("iot.eclipse.org", 443, "/ws", "cc");
        this.client.onConnectionLost = (responseObject) => this.onConnectionLost(responseObject);
        this.client.onMessageArrived = (message) => onMessageArrived(message);
        this.client.connect({ useSSL: true, onSuccess: () => this.onConnect() });
    }

    onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("client connected");

        this.client.subscribe("table/position");
    }

    // called when the client loses its connection
    onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.error("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    send(topic, message) {
        if (this.client.isConnected()) {
            return this.client.send(topic, message, 2)
        }

        return false
    }
}
// sendMoveCommand: function () {
//     client.send("cc/cmd", JSON.stringify({ cmd: "move" }))
// },
// getStatusCommand: function () {
//     client.send("cc/cmd", JSON.stringify({ cmd: "request_status" }))
// }