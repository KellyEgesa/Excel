import React, { Component } from "react";
import { Motion, spring } from "react-motion";

const ContextMenu = (props) => {
  const { showMenu, xPos, yPos, onSave } = props;
  return (
    <Motion
      defaultStyle={{ opacity: 0 }}
      style={{ opacity: !showMenu ? spring(0) : spring(1) }}
    >
      {(interpolatedStyle) => (
        <>
          {showMenu ? (
            <div
              className="menu-container"
              style={{
                position: "absolute",
                top: yPos,
                left: xPos,
                opacity: interpolatedStyle.opacity,
              }}
            >
              <ul
                className="list-group"
                style={{ backgroundColor: "blue", cursor: "pointer" }}
              >
                <li className="list-group-item" onClick={onSave}>
                  Save <i class="fa fa-floppy-o" aria-hidden="true"></i>
                </li>
                <li className="list-group-item">
                  Open <i class="fa fa-folder-open-o" aria-hidden="true"></i>
                </li>
                <li className="list-group-item">
                  Add contributor <i class="fa fa-users" aria-hidden="true"></i>
                </li>
              </ul>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </Motion>
  );
};

export default ContextMenu;
