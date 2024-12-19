"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/zustand/auth-store";

export default function Global() {
    const { initialize } = useAuthStore();
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!accessToken || !refreshToken) {
            localStorage.clear();
            initialize();
            return;
        }
        
        initialize();
    }, []);
  
    return null;
}