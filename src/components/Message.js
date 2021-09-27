import React from "react";
import style from "./Message.module.css"
export const Message = ({msg, adr, time}) => {
    let timeStr = time.toString().split(" ")
    let formattedTime = [timeStr[1], timeStr[2], timeStr[3], timeStr[4]].join(" ")
    let smallerAdr = adr.slice(0, 5) + "..." + adr.slice(adr.length - 5, adr.length)
    return(
        <div className = {style.container}>
            <div className = {style.adr}>{smallerAdr} says</div>
            <div className = {style.msg}><div>{msg}</div></div>
            <div className = {style.time}>{formattedTime}</div>
        </div>
    )
}