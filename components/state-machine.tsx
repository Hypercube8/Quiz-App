"use client";

import { useState } from "react";

interface StateMachineProps<T> {
    default: T;
}

export default function StateMachine<T>({children}) {
    const [state, setState] = useState<T>();
    
    return (
        {children[]}
    )
}