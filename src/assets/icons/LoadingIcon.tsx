import { Component } from 'solid-js';
import type { JSX } from 'solid-js';

const Icon:Component<any> = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width={84} height={84} {...props}>
    <circle cx="50" cy="36.8101" r="10" fill="#3e7cff">
      <animate attributeName="cy" dur="1s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9" keyTimes="0;0.5;1" values="23;77;23"></animate>
    </circle>
  </svg>
);


export default Icon
