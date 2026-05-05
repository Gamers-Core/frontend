type Theme = 'light' | 'dark' | 'system';

type XOR<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });
