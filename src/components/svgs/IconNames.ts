import React, { SVGAttributes } from "react";
export type TIcon = SVGAttributes<SVGElement>;
export type TRenderSvg = (args: TIcon) => React.ReactNode;
export type TIconNames = "dashboardIcon" | "restaurantIcon" | "userIcon";
