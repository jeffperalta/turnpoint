import React from 'react';
import { getSessionToken } from '../utility/SessionUtil';

export default function LandingPage() {
  const token = getSessionToken();

  return (
    <div className="box-container">
      <h1>Welcome to the Client Management App</h1>
      {
        token && 
        <p>Use the navigation above to manage clients.</p>
      }
      {
        !token && 
        <p>Login to access the client information</p>
      }
      
    </div>
  );
}