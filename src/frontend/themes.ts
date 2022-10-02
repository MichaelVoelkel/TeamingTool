import { createContext } from "react";

export const Theme = {
    default: {
        fontSize: 14,
        padding: 8,
        lineHeight: 14 * 1.5,
        memberMarginTop: 14 * 1.5,
        memberTagSpacing: 4
    }
};

export const ThemeContext = createContext(Theme.default);