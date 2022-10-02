import React, { useState, useEffect } from 'react';
import './Login.css';
import { TextInput, Button, Group, Paper, Notification, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../contexts/AuthContext';
import { XIcon } from '@heroicons/react/solid';
import { useNavigate, Link } from 'react-router-dom';

export default function Signin() {
    const { signInWithDiscord } = useAuth();

    return (
        signInWithDiscord()
    )
}