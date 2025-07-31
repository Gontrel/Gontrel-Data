import React from 'react'

interface ChartWrapperProps {
  children: React.ReactNode;
}

const ChartWrapper = ({ children }: ChartWrapperProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {children}
    </div>
  )
}

export default ChartWrapper