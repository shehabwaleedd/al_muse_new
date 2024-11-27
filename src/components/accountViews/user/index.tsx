import React from 'react'

const UserView = ({ handleOpen }: { handleOpen: (value: string) => () => void }) => {
    const options = [
        { value: 'personalInfo', label: 'Personal Info' },
        { value: 'changePassword', label: 'Change Password' },
        { value: 'userEvents', label: 'My Events' },
        { value: 'participants', label: 'Participants' },
        { value: 'createEvent', label: 'Create Event' },
    ];
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        handleOpen(value)();
    }

    return (
        <select onChange={handleSelectChange}>
            <option value="">Select View</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export default UserView