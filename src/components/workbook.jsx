import React, { Component } from "react";
import ContextMenu from "./contextMenu";
import axios from "axios";

let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabetSplit = alphabet.split("");
class WorkBook extends Component {
  state = {
    showMenu: false,
    selectedCell: "",
    col: [],
    sheet: { 0: [""] },
    selectedFile: null,
    selectedRow: null,
    selectedCol: null,
  };

  async componentDidMount() {
    document
      .querySelector("td[contenteditable]")
      .addEventListener("paste", this.pasteDefaultStop);
    document.addEventListener("contextmenu", this.handleContextMenu);
    document.addEventListener("click", this.handleClick);
    const data = {
      fileDirectory: "workbook/Kelly/1611685812635-Book 1.xlsx",
    };
    let sheet = await axios.post(
      "http://localhost:3030/file/retrieveFile",
      data
    );
    this.setState({ sheet: sheet.data });
    this.convertJsonToFile(this.state.sheet);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("contextmenu", this.handleContextMenu);
  }

  handleContextMenu = (e) => {
    e.preventDefault();

    this.setState({
      xPos: `${e.pageX}px`,
      yPos: `${e.pageY}px`,
      showMenu: true,
    });
  };

  handleClick = (e) => {
    if (this.state.showMenu) this.setState({ showMenu: false });
  };

  pasteDefaultStop = (e) => {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };

  highlightCell(cell) {
    this.setState({ selectedCell: cell, selectedRow: null, selectedCol: null });
  }

  stopRightClickSelect = (e) => {
    if (e.nativeEvent.which === 3) {
      e.nativeEvent.preventDefault();
    }
  };

  convertJsonToFile(SheetValues) {
    let length = Object.keys(SheetValues).length;
    for (let index = 0; index < length; index++) {
      let row = SheetValues[index];
      for (let f = 0; f < row.length; f++) {
        let id = alphabetSplit[f] + (index + 1);
        document.getElementById(id).innerHTML = SheetValues[index][f];
      }
    }
  }

  highlightRowHeader(array, index) {
    if (array.length < 3) {
      return array[1] == index ? "selectedColHeader" : null;
    } else {
      let number = "";
      for (let i = 1; i < array.length; i++) {
        number += array[i];
      }
      return parseInt(number) == index ? "selectedColHeader" : null;
    }
  }
  onKeyPressed(event) {
    const { sheet } = this.state;
    let value = document.getElementById(event).innerHTML.trim();
    const cell = event.split("");
    let tempArray = [];
    let row = cell[0];
    let rowNumber = alphabetSplit.indexOf(row);
    let column;

    if (cell.length < 3) {
      column = parseInt(cell[1]);
      column -= 1;
    } else {
      let number = "";
      for (let i = 1; i < cell.length; i++) {
        number += cell[i];
      }
      column = parseInt(number);
      column = column -= 1;
    }

    if (value.split("")[0] === "=") {
      var res = value.substr(1);
      var multiply = new Function("x", "y", "return x * y");
      console.log(res);
    }

    if (sheet[column] == null) {
      let last = parseInt(Object.keys(sheet).pop());
      for (let index = last + 1; index <= column; index++) {
        sheet[index] = [];
      }
    }

    if (sheet[column][rowNumber] != null) {
      let tempRow = sheet[column];
      tempRow.splice(rowNumber, 1, value);
    } else {
      if (value === "") {
        return;
      }
      let tempRow = sheet[column];
      let diff = rowNumber + 1 - tempRow.length;
      for (let index = 0; index < diff; index++) {
        tempRow.push("");
      }
      tempRow.splice(rowNumber, 1, value);
    }
  }

  clickRow(index) {
    this.setState({ selectedCell: "", selectedRow: index, selectedCol: "" });
  }

  clickCol(item) {
    this.setState({ selectedCol: "" });
    this.setState({ selectedCell: "", selectedRow: "", selectedCol: item });
  }

  onChangeHandler = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
    const data = new FormData();
    data.append("file", event.target.files[0]);
    axios.post("http://localhost:3030/file", data, {}).then((res) => {
      console.log(res.statusText);
    });
  };

  save() {
    const { sheet } = this.state;
    let data = Object.values(sheet);
    axios.post("http://localhost:3030/saveFile", data).then((res) => {
      console.log(res.statusText);
    });
  }

  upload() {}
  render() {
    let colHeader = [];
    const alphabetSplit = alphabet.split("");
    const { selectedCell, selectedRow, selectedCol } = this.state;
    const selected = selectedCell.split("");

    const { showMenu, xPos, yPos } = this.state;

    for (let index = 1; index < 200; index++) {
      colHeader.push(
        <tr key={index} className={index == selectedRow ? "selectedRow" : null}>
          <td
            className={this.highlightRowHeader(selected, index)}
            id="colHeader"
            onClick={() => this.clickRow(index)}
          >
            {index}
          </td>
          {alphabetSplit.map((item) => {
            return (
              <td
                key={item}
                id={`${item}${index}`}
                className={
                  selectedCell === `${item}${index}`
                    ? "workAreaSelected"
                    : "workArea"
                }
                contentEditable="true"
                onClick={() => this.highlightCell(`${item}${index}`)}
                onBlur={() => this.onKeyPressed(`${item}${index}`)}
                onMouseDown={this.stopRightClickSelect}
              ></td>
            );
          })}
        </tr>
      );
    }

    return (
      <div className="mainDiv">
        <ContextMenu
          showMenu={showMenu}
          xPos={xPos}
          yPos={yPos}
          onSave={() => this.save()}
        ></ContextMenu>
        <div className="d-flex justify-content-end" id="buttonsMain">
          <div className="my-auto">
            <button
              className="btn btn-success"
              id="saveButton"
              onClick={() => this.save()}
            >
              Save <i class="fa fa-floppy-o" aria-hidden="true"></i>
            </button>
          </div>
          <div className="my-auto m-2">
            <div id="borderUpload">
              <label
                htmlFor="file-upload"
                className="custom-file-upload btn btn-sm m-0"
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={this.onChangeHandler}
                />
                Upload <i class="fa fa-cloud-upload" aria-hidden="true"></i>
              </label>
            </div>
          </div>
        </div>
        <div className="mainSheet">
          <table>
            {selectedCol ? (
              <colgroup>
                <col span={alphabetSplit.indexOf(selectedCol) + 1} />
                <col style={{ border: "3px solid#1d6f42" }}></col>{" "}
              </colgroup>
            ) : null}

            <thead>
              <tr>
                <th></th>
                {alphabetSplit.map((item) => {
                  return (
                    <th
                      className={
                        selected[0] === item ? "selectedRowHeader" : null
                      }
                      key={item}
                      id="rowHeader"
                      onClick={() => this.clickCol(item)}
                    >
                      {item}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>{colHeader}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default WorkBook;
