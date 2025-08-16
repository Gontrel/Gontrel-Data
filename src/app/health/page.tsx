"use client";

import React from "react";

const HealthCheck = () => {
  return <pre>{JSON.stringify({ status: "ok" }, null, 2)}</pre>;
};

export default HealthCheck;
