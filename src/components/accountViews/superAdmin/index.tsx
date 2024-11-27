import React from 'react'
import * as XLSX from 'xlsx';
import axios from 'axios';

const SuperAdminView = ({ handleOpen }: { handleOpen: (value: string) => () => void }) => {

    const options = [
        { value: 'personalInfo', label: 'Personal Info' },
        { value: 'changePassword', label: 'Change Password' },
        { value: 'userEvents', label: 'My Events' },
        { value: 'pendingEvents', label: 'Pending Events' },
        { value: 'participants', label: 'Participants' },
        { value: 'users', label: 'Users' },
        { value: 'events', label: 'Events' },
        { value: 'createEvent', label: 'Create Event' },
        { value: 'analytics', label: 'Analytics' },
        { value: 'exportUsers', label: 'Export Users Data' }
    ];


    const handleExport = async () => {
        try {
            // Replace the URL with your actual endpoint to fetch users' data
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
                headers: { token: localStorage.getItem('token') },
            });

            const usersData = response.data.data.result.map(({ password, rePassword, __v, ...user }: { password: string, rePassword: string, __v: any, user: any }) => user);
            const worksheet = XLSX.utils.json_to_sheet(usersData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

            // Create a name for your excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'F365_UsersData.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error fetching users data:', error);
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'exportUsers') {
            handleExport();
        } else {
            handleOpen(value)();
        }
    };


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

export default SuperAdminView