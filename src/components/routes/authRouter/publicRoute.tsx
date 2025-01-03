import React from 'react'
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
    redirectPath: string;
  }

const PublicRoute: React.FC<PublicRouteProps> = ({
    children,
    isAuthenticated,
    redirectPath,
}) => {
  return isAuthenticated ? <Navigate to={redirectPath} replace/> : <>{children}</>
}

export default PublicRoute