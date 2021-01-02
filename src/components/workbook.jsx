import React, { Component } from "react";
var XLSX = require("xlsx");

let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabetSplit = alphabet.split("");
class WorkBook extends Component {
  state = {
    selectedCell: "",
    col: [],
    sheet: { 0: [""] },
  };

  componentDidMount() {}

  highlightCell(cell) {
    this.setState({ selectedCell: cell });
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
    let value = document.getElementById(event).innerHTML;
    const cell = event.split("");
    let tempArray = [];
    let row = cell[1];
    let rowNumber = alphabetSplit.indexOf(row);
    let column;

    if (cell.length < 4) {
      column = cell[2];
    } else {
      let number = "";
      for (let i = 2; i < cell.length; i++) {
        number += cell[i];
      }
      column = parseInt(number);
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

  save() {
    const { sheet } = this.state;
    let data = Object.values(sheet);
    console.log(data);
  }

  render() {
    let colHeader = [];
    const alphabetSplit = alphabet.split("");
    const { selectedCell } = this.state;
    const selected = selectedCell.split("");

    for (let index = 0; index < 200; index++) {
      colHeader.push(
        <tr key={index}>
          <td
            id="colHeader"
            className={this.highlightRowHeader(selected, index)}
          >
            {index}
          </td>
          {alphabetSplit.map((item) => {
            return (
              <td
                key={item}
                id={`${item}${index}`}
                onClick={() => this.highlightCell(`${item}${index}`)}
                className={
                  selectedCell === `${item}${index}`
                    ? "workAreaSelected"
                    : "workArea"
                }
              >
                <p
                  contentEditable="true"
                  id={`P${item}${index}`}
                  onBlur={() => this.onKeyPressed(`P${item}${index}`)}
                ></p>
              </td>
            );
          })}
        </tr>
      );
    }

    return (
      <div>
        <button onClick={() => this.save()}>Save</button>
        <table>
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
    );
  }
}

export default WorkBook;
