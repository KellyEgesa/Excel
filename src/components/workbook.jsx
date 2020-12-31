import React, { Component } from "react";

class WorkBook extends Component {
  state = { selectedCell: "" };

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

  render() {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let colHeader = [];
    const rowHeader = alphabet.split("");
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
          {rowHeader.map((item) => {
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
                <p contentEditable="true" id={`${item}${index}`}></p>
              </td>
            );
          })}
        </tr>
      );
    }

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              {rowHeader.map((item) => {
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
