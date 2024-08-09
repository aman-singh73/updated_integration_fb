import React from 'react';
import Template from '../components/Template';

export default function Login({ setIsLoggedIn }) {
  return (
    <Template formtype="login" setIsLoggedIn={setIsLoggedIn} />
  )
}
