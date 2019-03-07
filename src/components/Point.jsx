import React, { Component } from 'react';

export class Point extends Component {

	render() {
		const {
			text, isDragged, isClone, offsetTop, onMouseEnter,
			onMouseOver, startDragging, onRemove, onMouseLeave,
		} = this.props;

		const containerProps = {
			className: `point${isClone ? ' clone' : ''}${isDragged ? ' dragged' : ''}`,
			style: offsetTop ? { transform: `translate3d(0, ${offsetTop}, 0)` } : undefined,
			onMouseOver, onMouseEnter, onMouseLeave,
		}

		return (
			<div {...containerProps}>
				<button className='point-btn' onClick={onRemove} />
				<div className='point-overlay' onMouseDown={startDragging}>
					<span className='point-text'>{text}</span>
				</div>
			</div>
		);
	}
}
