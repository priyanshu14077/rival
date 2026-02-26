import React from "react";

export interface TextTypeProps {
    text: string | string[];
    as?: React.ElementType;
    typingSpeed?: number;
    initialDelay?: number;
    pauseDuration?: number;
    deletingSpeed?: number;
    loop?: boolean;
    className?: string;
    showCursor?: boolean;
    hideCursorWhileTyping?: boolean;
    cursorCharacter?: string;
    cursorClassName?: string;
    cursorBlinkDuration?: number;
    textColors?: string[];
    variableSpeed?: { min: number; max: number };
    onSentenceComplete?: (text: string, index: number) => void;
    startOnVisible?: boolean;
    reverseMode?: boolean;
}

declare const TextType: React.FC<TextTypeProps>;
export default TextType;
