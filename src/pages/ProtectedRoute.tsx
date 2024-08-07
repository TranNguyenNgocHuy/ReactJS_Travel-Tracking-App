import React, { useEffect } from 'react'
import { useAuth } from '../contexts/FakeAuthContext'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: React.ReactElement
}

function ProtectedRoute({ children }: Props) {
  const { isAuthentication } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthentication) navigate('/')
  }, [isAuthentication, navigate])

  return isAuthentication ? children : null
}

export default ProtectedRoute
