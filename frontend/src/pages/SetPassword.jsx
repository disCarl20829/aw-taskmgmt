import React from 'react';
import { useNavigate } from 'react-router-dom';

import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/inputField';

import '../css/style.css'
import '../css/sign.css';

function SetPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        user_password: '',
        confirm_password: '',
    });

    const handleChange = (id, value) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (formData.user_password !== formData.confirm_password) {
            alert('Passwords do not match!');
            return;
        }

        if (!formData.user_password.trim()) {
            alert('Password cannot be empty!');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/user/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ user_password: formData.user_password }),
            });

            const data = await res.json();

            if (res.ok) {
                navigate('/dashboard');
            } else {
                console.error('Password Settup Failed:', data.message);
            }

            alert(data.message);
        } catch (err) {
            console.error('Error during password setting:', err);
            alert('Error during password setting. Please try again.');
        }
    };

    return (
        <AuthLayout title="Set Password">
            <form onSubmit={handleSignUp}>
                <InputField icon="lock" type="password" placeholder="Password" id="user_password" isPassword={true} value={formData.user_password} onChange={(e) => handleChange('user_password', e.target.value)} />
                <InputField icon="lock-fill" type="password" placeholder="Confirm Password" id="confirm_password" isPassword={true} value={formData.confirm_password} onChange={(e) => handleChange('confirm_password', e.target.value)} />
                <button type="submit" className="btn btn-signup">Continue</button>
            </form>
        </AuthLayout>
    );
}

export default SetPassword;