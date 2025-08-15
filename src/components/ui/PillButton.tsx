import React from 'react'

interface PillButtonProps {
    text: string;
    textColor: string;
    bgColor: string;
    onClick?: () => void;
}

export function PillButton({ text, textColor, bgColor, onClick }: PillButtonProps) {
  return (
    <button onClick={onClick} className={`rounded-lg font-medium p-1.5 ${textColor} ${bgColor}`}>
      {text}
    </button>
  )
}