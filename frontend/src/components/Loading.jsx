/* eslint-disable react/prop-types */

import ReactLoading from 'react-loading';

const Loading = ({ type, color }) => (
	<ReactLoading
		type={type}
		color={color}
		height={'10%'}
		width={'10%'}
	/>
);

export default Loading;

/*

TYPES: 

  blank
  balls
  bars
  bubbles
  cubes
  cylon
  spin
  spinningBubbles
  spokes

*/
