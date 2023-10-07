import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

// Components

// Flowbite
import { Label, TextInput, Button } from 'flowbite-react';

const UserSearchBar = (props) => {
    const { user } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [disabledButton, setDissabledButton] = useState(true);

    useEffect(() => {
        if (username && username.length > 0) {
            setDissabledButton(false)
        } else {
            setDissabledButton(true)
        }
    }, [username])

    return (
        <div className='flex items-end w-full mb-5'>
            <div className='w-full pr-4'>
                <div className="mb-3 block">
                    <Label
                        htmlFor="user_search"
                        value="Search user by username"
                    />
                </div>
                <TextInput
                    id="user_search"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    required={true}
                    maxLength={20}
                />
            </div>
            <Button onClick={(e) => { e.preventDefault(); props.searchUser(username); }} disabled={disabledButton}>
                Search
            </Button>
        </div>
    );
};

export default UserSearchBar;
