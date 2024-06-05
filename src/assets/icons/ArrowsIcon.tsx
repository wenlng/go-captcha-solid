import { Component } from 'solid-js';
import type { JSX } from 'solid-js';

const Icon:Component<any> = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={20} height={20} {...props}>
    <path d="M131.6,116.3c0,0-75.6,0-109.7,0c-9.1,0-16.2-7.4-16.2-16.2c0-9.1,7.4-16.2,16.2-16.2c28.7,0,109.7,0,109.7,0
	s-5.4-5.4-30.4-30.7c-6.4-6.4-6.4-16.7,0-23.1s16.7-6.4,23.1,0l58.4,58.4c6.4,6.4,6.4,16.7,0,23.1c0,0-32.9,32.9-57.9,57.9
	c-6.4,6.4-16.7,6.4-23.1,0c-6.4-6.4-6.4-16.7,0-23.1C121.8,126.2,131.6,116.3,131.6,116.3z"/>
  </svg>
);
export default Icon;
