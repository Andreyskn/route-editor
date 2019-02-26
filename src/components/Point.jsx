import React, { Component } from 'react';

export class Point extends Component {

	render() {
		const { text, isDragged, isClone, offsetTop, onMouseOver, startDragging, onRemove } = this.props;

		const containerProps = {
			className: `point${isClone ? ' clone' : ''}${isDragged ? ' dragged' : ''}`,
			style: offsetTop ? { top: offsetTop } : undefined,
			onMouseOver,
		}

		return (
			<div {...containerProps}>
				<button className='point-btn' onClick={onRemove} />
				<div className='point-overlay' onMouseDown={startDragging}>
					<span className='point-text' title={text}>{text}</span>
				</div>
			</div>
		);
	}
}
