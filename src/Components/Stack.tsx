import { StackItemShim, StackShim } from "@fluentui/react-migration-v8-v9";

type TStack = typeof StackShim & { Item: typeof StackItemShim };

export const Stack: TStack = StackShim as TStack;
Stack.Item = StackItemShim;

export const StackItem: typeof StackItemShim = StackShim as TStack;


