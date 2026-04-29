import React from "react";

type State = string | number;

interface StateMachineProps<T extends State> {
    current: T,
    states: Record<T, number>
}

export default function StateMachine<T extends State>({current, states, children}: React.PropsWithChildren<StateMachineProps<T>>) {
    const childArray = React.Children.toArray(children);

    return (
        <>{childArray[states[current]]}</>
    )
}