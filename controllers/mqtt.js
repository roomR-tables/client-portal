export class MqttClient {
    constructor(onMessageArrived, onConnectionChanged) {
        this.client = new Paho.Client("178.128.254.40", 9001, "/", "cc" + + parseInt(Math.random() * 100));
        this.onConnectionChanged = onConnectionChanged

        this.client.onConnectionLost = (responseObject) => this.onConnectionLost(responseObject);
        this.client.onMessageArrived = (message) => onMessageArrived(message);
        this.client.connect({ reconnect: true, onSuccess: () => this.onConnect() });
    }

    onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("client connected");
        this.onConnectionChanged('connected')
        this.client.subscribe("table/status");
    }

    // called when the client loses its connection
    onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.error("onConnectionLost:" + responseObject.errorMessage);
        }

        this.onConnectionChanged('lost')
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