import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import styles from './AuthPage.module.css';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Please wait...');
    
    try {
      if (isRegister) {
        // --- SECURE REGISTER PATH ---
        await api.register(formData);
        // The login function below will now handle success/failure properly
        await login({ email: formData.email, password: formData.password });
        toast.dismiss(loadingToast);
        toast.success('Account created!');
        navigate('/interests');
      } else {
        // --- SECURE LOGIN PATH ---
        // The login function will throw an error if credentials are bad
        await login(formData);
        toast.dismiss(loadingToast);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      // The secure login function re-throws the error, which is caught here.
      // This is the ONLY path for failures.
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Authentication failed.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p className={styles.subtitle}>{isRegister ? 'Join our community.' : 'Access your dashboard.'}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister && (
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required className={styles.inputField} />
          )}
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className={styles.inputField} />
          <div className={styles.passwordInputContainer}>
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" onChange={handleChange} required className={styles.inputField} />
            <div className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>{isRegister ? 'Create Account' : 'Login'}</button>
        </form>
        <p className={styles.toggleText}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsRegister(!isRegister)} className={styles.toggleLink}>
            {isRegister ? ' Sign In' : ' Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;