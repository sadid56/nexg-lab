import { useEffect } from "react";

type KeyCombo = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
};

export function useKeyboardShortcut(combo: KeyCombo, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = combo;

      const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();
      const isCtrlMatch = !!ctrlKey === event.ctrlKey;
      const isMetaMatch = !!metaKey === event.metaKey;
      const isShiftMatch = !!shiftKey === event.shiftKey;
      const isAltMatch = !!altKey === event.altKey;

      if (isKeyMatch && (isCtrlMatch || isMetaMatch) && isShiftMatch && isAltMatch) {
        // This is a bit complex, let's simplify for common use cases: (Ctrl/Meta) + Shift + Key
      }

      // Simplified logic for (Ctrl or Meta) + Optional modifiers + Key
      const modifierMatch =
        (ctrlKey === undefined || ctrlKey === event.ctrlKey) &&
        (metaKey === undefined || metaKey === event.metaKey) &&
        (shiftKey === undefined || shiftKey === event.shiftKey) &&
        (altKey === undefined || altKey === event.altKey);

      // Check if either Ctrl or Meta is pressed if either is requested
      const basicModifierMatch = ctrlKey || metaKey ? event.ctrlKey || event.metaKey : true;

      if (isKeyMatch && modifierMatch && basicModifierMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [combo, callback]);
}
