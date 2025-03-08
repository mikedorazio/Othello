import {useState} from 'react';

export default function Cell( {entry} ) {

    const subLable = `${entry.id} - (${Math.floor(entry.id / 8)}, ${entry.id % 8})`
    return (
        <div className="cell-container">
            <div className={entry.color} number={entry.id}>
                <sub>{subLable}</sub>
            </div>
        </div>
    )
}