import * as React from "react"
import * as ReactDOM from "react-dom"

import { Dashboard } from "./dashboard.jsx"
import { Setup } from "./setup.jsx"
import { isArray } from "util"
import { MqttClient } from "./mqtt.js"
import "babel-polyfill"

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = { page: 'dashboard', isNew: false, editable: true, setups: [], currentSetup: [], selectedSetup: null }

        this.mqttClient = new MqttClient((message) => this.onMqttMessage(message))
    }

    componentDidMount() {
        let sRooms = localStorage.getItem("aRooms");
        let jRooms = JSON.parse(sRooms);

        let currentPosition = localStorage.getItem("currentPositionInCm");

        this.setState({
            setups: !jRooms || !isArray(jRooms) ? [] : jRooms,
            currentSetup: !currentPosition ? { x_pos: 0, y_pos: 0 } : JSON.parse(currentPosition)
        })
    }

    onMqttMessage(message) {
        try {
            let messageBody = message.payloadString
            console.log(message)
            switch (message.destinationName) {
                case "table/status":
                    // Expects is a command F300, where 300 is in centimeters
                    let direction = messageBody.substring(0, 1)
                    let cm = Number(messageBody.substring(1))

                    if (direction === 'R') {
                        var newSetup = { x_pos: this.state.currentSetup.x_pos + cm, y_pos: this.state.currentSetup.y_pos }
                    } else if (direction === 'L') {
                        var newSetup = { x_pos: this.state.currentSetup.x_pos - cm, y_pos: this.state.currentSetup.y_pos }
                    } else if (direction == 'F') {
                        var newSetup = { x_pos: this.state.currentSetup.x_pos, y_pos: this.state.currentSetup.y_pos - cm }
                    } else {
                        var newSetup = { x_pos: this.state.currentSetup.x_pos, y_pos: this.state.currentSetup.y_pos + cm }
                    }

                    console.log(newSetup)

                    this.setState({ currentSetup: newSetup })
                    return;
            }
        } catch (e) {
            console.error(`Error on parsing mqtt message: ${message.payloadString}`)
            console.error(e)
        }

    }

    loadSetup(sRoomName, editable) {
        let setup = this.state.setups.find(s => s.sRoomName == sRoomName);

        this.setState({
            selectedSetup: !setup ? {} : setup,
            isNew: !setup,
            editable: editable,
            page: 'setup'
        })
    }

    createSetup() {
        this.setState({
            selectedSetup: {
                sRoomName: "",
                fRoomWidth: 10,
                fRoomLength: 5,
                fTableWidth: 0.43,
                fTableLength: 0.26,
                fTablePosX: 0,
                fTablePosY: 0,
                icon: "fas fa-heart"
            },
            isNew: true,
            editable: true,
            page: 'setup'
        })
    }

    saveSetup(newSetup) {
        let oldSetup = this.state.selectedSetup
        let otherSetups = this.state.setups

        if (!newSetup.sRoomName) {
            alert("Invalid room name");
            return;
        }

        if (this.state.isNew && otherSetups.find(r => r.sRoomName == newSetup.sRoomName)) {
            if (!confirm("A preset with this name already exists. Do you want to overwrite it?")) {
                return;
            }
        }

        // Remove the old room
        let newSetups = otherSetups.filter(s => s.sRoomName != newSetup.sRoomName && s.sRoomName != oldSetup.sRoomName)
        newSetups.push(newSetup)

        this.setState({
            setups: newSetups,
            selectedSetup: newSetup,
            isNew: false
        }, () => {
            localStorage.setItem("aRooms", JSON.stringify(this.state.setups))
            alert("Your setup has been saved.")
            this.cancel()
        })
    }

    removeSetup(roomName) {
        if (!confirm("This setup will be permanently removed. Are you sure?")) {
            return;
        }

        let newSetups = this.state.setups.filter(s => s.sRoomName != roomName)
        this.setState({ setups: newSetups }, () => localStorage.setItem("aRooms", JSON.stringify(newSetups)))
    }

    cancel() {
        this.setState({ page: 'dashboard', selectedSetup: null })
    }

    executeSetup(distanceX, distanceY) {
        let movements = []

        if (distanceX !== 0) {
            movements.push((distanceX < 0 ? 'R' : 'L') + Math.abs(distanceX.toFixed()))
        }

        if (distanceY !== 0) {
            movements.push((distanceY < 0 ? 'B' : 'F') + Math.abs(distanceY.toFixed()))
        }

        movements.length > 0 && this.mqttClient.send('table/movement', movements.reduce((reduction, m) => m + ";" + reduction) + ';')
    }

    render() {
        return <>
            <div className="header col-12 bg-lime">
                <div className="logo">
                    <img src="/images/vroom_logo.svg" alt="vroom Logo" />
                </div>
            </div>
            <div id="content">
                <div id="scroller" style={{ marginLeft: this.state.page != 'dashboard' ? '-100%' : 0 }}>
                    <div id="content1">
                        <Dashboard
                            setups={this.state.setups}
                            loadSetup={(roomName, editable) => this.loadSetup(roomName, editable)}
                            removeSetup={(roomName) => this.removeSetup(roomName)}
                            createSetup={_ => this.createSetup()}
                        />
                    </div>
                    <div id="content2">
                        {this.state.selectedSetup && this.state.currentSetup ? <Setup
                            key={`${this.state.selectedSetup.sRoomName}_${this.state.editable}`}
                            preferredSetup={this.state.selectedSetup}
                            editable={this.state.editable}
                            currentSetup={this.state.currentSetup}
                            saveSetup={setup => this.saveSetup(setup)}
                            cancelSetup={_ => this.cancel()}
                            executeSetup={(preferredSetup, currentSetup) => this.executeSetup(preferredSetup, currentSetup)}
                        /> : <p>Loading current setup...</p>}
                    </div>
                </div>
            </div>
        </>
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById("react-root")
)