import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

// Flowbite
import { TextInput, Button } from 'flowbite-react';


const Message = (props) => {
    const beautifyDate = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return (
        <div className={`w-full p-2 flex justify-${props.owner ? 'end' : 'start'}`}>
            <div>
                <Button className="flex-end" color={props.owner ? "purple" : "gray"}>{props.message}</Button>
                <p className={`text-xs font-thin text-slate-500 opacity-50 ml-2 text-${props.owner ? 'right' : 'left'}`}>{props.author}</p>
                <p className={`text-xs font-thin text-slate-500 opacity-50 ml-2 text-${props.owner ? 'right' : 'left'}`}>{beautifyDate(props.time)}</p>
            </div>
            {props.owner && <Button color="light" onClick={() => { props.edit(props.message_id, props.message) }}>✎</Button>}
        </div>
    );
};

export default Message;
