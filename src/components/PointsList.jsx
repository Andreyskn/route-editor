import React, { Component } from 'react';

import { Point } from './Point';

const emptyItem = { id: null, node: null };

export class PointsList extends Component {

	_itemInnerOffset = null;
	_container = {
		node: null,
		offset: null,
		scroll: null,
	}

	state = {
		isDragging: false,
		draggedItem: emptyItem,
		dragMousePos: null,
	}

	componentDidMount() {
		window.addEventListener('mouseup', this.finishDragging);
		this._container.offset = this._container.node.getBoundingClientRect().top;
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.finishDragging);
	}

	startDragging = (id) => (e) => {
		const rect = e.target.getBoundingClientRect();
		this._itemInnerOffset = e.clientY - rect.top;
		this._container.scroll = this._container.node.scrollTop;
		const dragMousePos = e.clientY - this._container.offset - this._itemInnerOffset + this._container.scroll;

		const newState = {
			isDragging: true,
			draggedItem: { id, node: e.target.parentNode },
			dragMousePos,
		}

		this.setState(newState);
		window.addEventListener('mousemove', this.watchMouseMove);
	}

	changeOrder = (targetId) => () => {
		const { order, changeOrder } = this.props;
		const { draggedItem: { id: currentId }, isDragging } = this.state;

		if (!isDragging || targetId === currentId) return;

		const newOrder = order.map(id => {
			if (id === targetId) return currentId;
			if (id === currentId) return targetId;
			return id;
		})

		changeOrder(newOrder);
	}

	finishDragging = () => {
		const { isDragging } = this.state;

		if (isDragging) {
			this.setState({ isDragging: false, draggedItem: emptyItem });
			window.removeEventListener('mousemove', this.watchMouseMove);
		}
	}

	watchMouseMove = (e) => {
		// if (dragMousePos - this._container.scroll < 20) {
		// 	this._container.node.scrollBy({ top: -1, left: 0, behavior: 'smooth' });
		// 	this._container.scroll = this._container.node.scrollTop;
		// }

		const dragMousePos = e.clientY - this._container.offset - this._itemInnerOffset + this._container.scroll;
		this.setState({ dragMousePos });
	}

	render() {
		const { points, order, removePoint } = this.props;
		const { isDragging, draggedItem, dragMousePos } = this.state;

		return (
			<div className='points-list' ref={x => this._container.node = x}>
				{order.map(id =>
					<Point
						key={id}
						isDragged={draggedItem.id === id}
						onMouseOver={this.changeOrder(id)}
						startDragging={this.startDragging(id)}
						onRemove={removePoint(id)}
						text={points[id]}
					/>
				)}
				{isDragging && <Point isClone offsetTop={`${dragMousePos}px`} text={draggedItem.node.innerText} />}
			</div>
		)
	}
}