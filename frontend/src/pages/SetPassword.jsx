import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

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

    useEffect(() => {
        const checkSession = async () => {
            try {
                await api.get('/auth/check');
            } catch (err) {
                if (err.response?.status === 400) {
                    navigate('/dashboard', { replace: true });
                }
            }
        }

        checkSession();
    }, [navigate]);

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
            const res = await axios.post('/user/update', {
                user_password: formData.user_password
            });
            const data = res.data;

            alert(data.message);
            navigate('/dashboard');
        } catch (err) {
            if (err.response) {
                console.error('Password Setup Failed:', err.response.data.message);
                alert(err.response.data.message);
            } else {
                console.error('Error during password setting:', err.message);
                alert('Error during password setting. Please try again.');
            }
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