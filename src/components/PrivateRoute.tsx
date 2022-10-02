import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }: any) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" />
}