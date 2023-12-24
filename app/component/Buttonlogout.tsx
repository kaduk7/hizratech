"use client"
import { signOut } from 'next-auth/react'
import React from 'react'

const Buttonlogout = () => {
    return (
        <a type='button' onClick={() => signOut()}>
            <span>Logout</span>
        </a>
    )
}

export default Buttonlogout