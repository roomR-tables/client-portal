import * as React from "react"

export class Setup extends React.Component {
    constructor(props) {
        super(props)
        this.state = { ...this.props.setup }

        this.G_fTableWidth = 2; //meters
        this.G_fTableLength = 1; //meters
    }

    componentDidMount() {
        // Perform jQuery actions after the DOM is rendered. Otherwise the elements are not found
        let draggable = $(".draggable");
        draggable.draggable({
            containment: "parent",
            grid: [10, 10]
        });

        this.G_eRoomHolder = $("#room");
        this.G_eRoomGrid = $("#roomGrid");
        this.G_eRoomGridTopBar = $("#roomGridTopBar");
        this.G_eRoomGridSideBar = $("#roomGridSideBar");
        this.G_eTable = $("#table1");
        this.g_eTableOutline = $("#outline1");

        this.resizeRoom()
    }

    drawTable(fTableWidth, fTableLength) {
        //Resize table dimensions based on this aspect ratio
        let fWidth = this.state.fRoomWidth > this.state.fRoomLength ? fTableWidth / this.state.fRoomWidth * 100 : fTableWidth / this.state.fRoomLength * 100;
        let fLength = this.state.fRoomWidth > this.state.fRoomLength ? fTableLength / this.state.fRoomWidth * 100 : fTableLength / this.state.fRoomLength * 100;

        return <>
            <div id="table1" className="table bg-lime" style={{ width: fWidth, height: fLength, top: 0, left: 0 }}>01</div>
            <div id="outline1" className="table-outline draggable" style={{ width: fWidth, height: fLength, top: this.state.fTablePosY, left: this.state.fTablePosX }}></div>
        </>
    }

    resizeRoom() {
        let fWidth = this.state.fRoomWidth > this.state.fRoomLength ? 100 : this.state.fRoomWidth / this.state.fRoomLength * 100;
        let fLength = this.state.fRoomWidth > this.state.fRoomLength ? this.state.fRoomLength / this.state.fRoomWidth * 100 : 100;

        //Animate  elements to fit aspect ratio.
        this.G_eRoomHolder.animate({
            "width": fWidth + "%",
            "height": fLength + "%"
        });

        this.G_eRoomGrid.animate({
            "width": "100%",
            "height": "100%"
        });

        this.G_eRoomGridTopBar.animate({
            "width": "100%"
        });

        this.G_eRoomGridSideBar.animate({
            "height": "100%"
        });
    }

    onChangeRoomDimensions(fRoomWidth, fRoomLength) {
        this.setState({ fRoomWidth: fRoomWidth, fRoomLength: fRoomLength }, () => this.resizeRoom())
    }

    onSaveSetup() {
        let fNewTablePosX = this.g_eTableOutline.css("left");
        let fNewTablePosY = this.g_eTableOutline.css("top");

        this.props.saveSetup({ ...this.state, fTablePosX: fNewTablePosX, fTablePosY: fNewTablePosY });
    }

    onExecute() {
        let fNewTablePosX = this.g_eTableOutline.css("left");
        let fNewTablePosY = this.g_eTableOutline.css("top");

        this.setTablePosition(fNewTablePosX, fNewTablePosY)
    }

    setTablePosition(x, y) {
        this.G_eTable.animate({
            top: y,
            left: x
        }, "slow");
    }

    render() {
        return <>
            <div className="container-fluid col-8 center">
                <div className="row">
                    <div className="page-title text-dark">
                        <input type="text" placeholder="Insert Room Name" value={this.state.sRoomName} onChange={e => this.setState({ sRoomName: e.currentTarget.value })} id="roomNameInput" />
                        <h2>Drag the tables to their desired location.</h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="col-4 float-left"></div>
                </div>
                <div className="col-2">
                    <div className="col-2 height-spacer"></div>
                </div>
                <div className="col-8">
                    <div id="room-parent">
                        <div id="room">
                            <div id="roomGrid">
                                {this.drawTable(this.state.fTableWidth, this.state.fTableLength)}
                            </div>
                            <div className=" col-12" id="roomGridTopBar">
                                <div className="arrowLeft">◄</div>
                                <div className="arrowRight">►</div>
                                <div className="roomWidthInputParent">
                                    <input type="number" id="roomWidthInput" value={this.state.fRoomWidth} placeholder="Insert Width" onChange={e => this.onChangeRoomDimensions(e.currentTarget.value, this.state.fRoomLength)} />
                                </div>
                            </div>
                            <div id="roomGridSideBar">
                                <div className="arrowUp">▲</div>
                                <div className="col-12" style={{ height: 20 }}></div>
                                <input type="number" id="roomLengthInput" value={this.state.fRoomLength} placeholder="Length" onChange={e => this.onChangeRoomDimensions(this.state.fRoomWidth, e.currentTarget.value)} />
                                <div className="arrowDown">▼</div>
                            </div>

                            <div className="col-12 buttonHandler">
                                <input type="button" value="Cancel" className="GridButton bg-cyan" onClick={_ => this.props.cancel()} />
                                <input type="button" value="execute" className="GridButton bg-cyan" onClick={_ => this.onExecute()} />
                                <input type="button" value="Save" className="GridButton bg-cyan" onClick={_ => this.onSaveSetup()} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}