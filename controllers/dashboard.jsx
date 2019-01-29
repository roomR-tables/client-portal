import * as React from "react"

export class Dashboard extends React.Component {
    render() {
        return (
            <div className="container-fluid col-8">
                <div className="row">
                    <div className="page-title text-dark">
                        <h1 style={{ fontWeight: 800 }}>Preset overview</h1>
                        <h2>Click and old to activate a preset</h2>
                    </div>
                </div>

                <div className="row cardLoader mx-auto">
                    {this.props.setups.map((s, k) => (
                        <div className="col" key={k} onClick={() => this.props.loadSetup(s.sRoomName, false)}>
                            <div className="card float-none mx-auto">
                                <div className="card-menu">
                                    <div className="edit-btn bg-lime text-light text-center" onClick={(e) => { e.stopPropagation(); this.props.loadSetup(s.sRoomName, true) }}>
                                        <span className="fas fa-pen"></span>
                                    </div>
                                    <div className="remove-btn bg-red text-light text-center" onClick={(e) => { e.stopPropagation(); this.props.removeSetup(s.sRoomName) }}>
                                        <span className="fas fa-times"></span>
                                    </div>
                                </div>
                                <div className="card-circle"></div>
                                <div className="card-title text-dark">{s.sRoomName}</div>
                            </div>
                        </div>
                    ))}
                    <div className="col">
                        <div className="card float-none mx-auto" id="add-preset" onClick={() => this.props.createSetup()}>
                            <div className="card-menu">
                            </div>
                            <div className="add-preset-circle"><span>+</span></div>
                            <div className="card-title text-dark">
                                ADD PRESET
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}