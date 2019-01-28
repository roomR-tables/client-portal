import * as React from "react"
import * as ReactDOM from "react-dom"

import { Dashboard } from "./dashboard.jsx"
import { Setup } from "./setup.jsx"
import { isArray } from "util"
import { MqttClient } from "./mqtt"

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = { page: 'dashboard', isNew: false, editable: true, setups: [], currentSetup: [], selectedSetup: null }

        this.mqttClient = new MqttClient((message) => this.onMqttMessage(message))
    }

    componentDidMount() {
        let sRooms = localStorage.getItem("aRooms");
        let jRooms = JSON.parse(sRooms);

        this.setState({ setups: !jRooms || !isArray(jRooms) ? [] : jRooms })
        setInterval(() => this.mqttClient.send("cc/cmd", JSON.stringify({ cmd: "request_status" })), 500)
    }

    onMqttMessage(message) {
        try {
            let jMessageBody = JSON.parse(message.payloadString)
            console.log(jMessageBody)
            switch (message.destinationName) {
                case "cc/status":
                    this.setState({ currentSetup: jMessageBody })
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
                fTableWidth: 0.70,
                fTableLength: 0.50,
                fTablePosX: 0,
                fTablePosY: 0
            },
            isNew: true,
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
        }, () => localStorage.setItem("aRooms", JSON.stringify(this.state.setups)))
    }

    cancel() {
        this.setState({ page: 'dashboard', currentSetup: {} })
    }

    render() {
        return <>
            <div className="header col-12 bg-lime">
                <div className="row">
                    <div className="logo col-5"></div>
                </div>
            </div>
            <div id="content">
                <div id="scroller" style={{ marginLeft: this.state.page != 'dashboard' ? '-100%' : 0 }}>
                    <div id="content1">
                        <Dashboard
                            setups={this.state.setups}
                            loadSetup={(roomName, editable) => this.loadSetup(roomName, editable)}
                            createSetup={_ => this.createSetup()}
                        />
                    </div>
                    <div id="content2">
                        {this.state.selectedSetup && this.state.currentSetup ? <Setup
                            key={this.state.isNew ? new Date().toString() : this.state.selectedSetup.sRoomName}
                            preferredSetup={this.state.selectedSetup}
                            editable={this.state.editable}
                            currentSetup={this.state.currentSetup}
                            saveSetup={setup => this.saveSetup(setup)}
                            cancelSetup={_ => this.cancel()}
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