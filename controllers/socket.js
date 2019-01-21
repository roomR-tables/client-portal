export var mqttClient = function(host, port, onStatusMessage, onPositionMessage) {
    this.host = host
    this.port = port
    this.onStatusMessage = onStatusMessage
    this.onPositionMessage = onPositionMessage

    this.connect()
}

mqttClient.prototype = (function () {
    var client = null;

    var onConnect = function () {
        console.log("Connected to socket");

        client.subscribe("cc/status");
        client.subscribe("cc/position");
    }

    var onConnectionLost = function (responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("Socket connection lost:" + responseObject.errorMessage);
        }
    }

    var onMessageArrived = function (message) {
        let topic = message.destinationName;
        let payload = message.payloadString;

        console.log(`topic=${topic}; message=${payload}`);
        switch (topic) {
            case "cc/status":
                this.onStatusMessage(payload)
                return
            case "cc/position":
                this.onPositionMessage(payload)
                return
        }
    }

    var connect = function () {
        client = new Paho.MQTT.Client(this.host, this.port, "cc");
        client.onConnectionLost = onConnectionLost.bind(this);
        client.onMessageArrived = onMessageArrived.bind(this);

        client.connect({ onSuccess: onConnect });
    }

    var sendMoveCommand = function (tables) {
        if (!client || client.isConnected())
        {
            return false
        }
        
        client.send("cc/cmd", JSON.stringify({ cmd: "move", tables: tables }));
    }

    var getStatusCommand = function () {
        if (!client || !client.isConnected())
        {
            return false
        }

        client.send("cc/cmd", JSON.stringify({ cmd: "request_status" }));
    }

    return {
        connect: connect,
        sendMoveCommand: sendMoveCommand,
        getStatusCommand: getStatusCommand
    }
})();
