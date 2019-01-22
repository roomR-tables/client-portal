import * as React from "react"
import * as ReactDOM from "react-dom"

import { Dashboard } from "./dashboard.jsx"
import { Setup } from "./setup.jsx"
import { isArray } from "util";

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = { page: 'dashboard', isNew: false, editable: true, setups: [], currentSetup: null }
    }

    componentDidMount() {
        let sRooms = localStorage.getItem("aRooms");
        let jRooms = JSON.parse(sRooms);

        this.setState({ setups: !jRooms || !isArray(jRooms) ? [] : jRooms })
    }

    loadSetup(sRoomName, editable) {
        let setup = this.state.setups.find(s => s.sRoomName == sRoomName);

        this.setState({
            currentSetup: !setup ? {} : setup,
            isNew: !setup,
            editable: editable,
            page: 'setup'
        })
    }

    createSetup() {
        this.setState({
            currentSetup: {
                sRoomName: "",
                fRoomWidth: 10,
                fRoomLength: 5,
                fTableWidth: 2,
                fTableLength: 1,
                fTablePosX: 0,
                fTablePosY: 0
            },
            isNew: true,
            page: 'setup'
        })
    }

    saveSetup(newSetup) {
        let oldSetup = this.state.currentSetup
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
            currentSetup: newSetup,
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
                        {this.state.currentSetup && <Setup
                            key={this.state.isNew ? new Date().toString() : this.state.currentSetup.sRoomName}
                            setup={this.state.currentSetup}
                            saveSetup={setup => this.saveSetup(setup)}
                            cancelSetup={_ => this.cancel()}
                            editable={this.state.editable}
                        />}
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