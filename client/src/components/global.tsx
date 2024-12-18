"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/zustand/auth-store";

export default function Global() {
    const { initialize } = useAuthStore();
    useEffect(() => {
        initialize();
    }, []);
  
    return null;
}