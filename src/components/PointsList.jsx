import React, { Component } from 'react';

import { Point } from './Point';

const emptyItem = { id: null, node: null, yPos: 0 };

export class PointsList extends Component {

	_itemInnerOffset = null;
	_scrollContainer = null;
	_itemsContainer = {
		node: null,
		offset: null,
	}

	state = {
		isDragging: false,
		draggedItem: emptyItem,
	}

	startDragging = (id) => (e) => {
		const rect = e.target.getBoundingClientRect();
		this._itemInnerOffset = e.clientY - rect.top;
		this._itemsContainer.offset = this._itemsContainer.node.getBoundingClientRect().top;
		if (!this._scrollContainer) this._scrollContainer = this._itemsContainer.node.parentNode;

		this.setState({
			isDragging: true,
			draggedItem: {
				id,
				node: e.target.parentNode,
				yPos: this.getDragPosition(e.clientY),
			},
		});

		window.addEventListener('mousemove', this.watchMouseMove);
		window.addEventListener('mouseup', this.finishDragging);
		this._scrollContainer.addEventListener('scroll', this.onScroll);
	}

	changeOrder = (targetId) => () => {
		const { order, changeOrder } = this.props;
		const { draggedItem: { id: currentId } } = this.state;

		if (targetId === currentId) return;

		const newOrder = order.map(id => {
			if (id === targetId) return currentId;
			if (id === currentId) return targetId;
			return id;
		})

		changeOrder(newOrder);
	}

	finishDragging = () => {
		this.setState({ isDragging: false, draggedItem: emptyItem });

		window.removeEventListener('mousemove', this.watchMouseMove);
		window.removeEventListener('mouseup', this.finishDragging);
		this._scrollContainer.removeEventListener('scroll', this.onScroll);
	}

	watchMouseMove = (e) => {
		this.setState(s => ({
			draggedItem: {
				...s.draggedItem,
				yPos: this.getDragPosition(e.clientY),
			}
		}));
	}

	onScroll = () => {
		this._itemsContainer.offset = this._itemsContainer.node.getBoundingClientRect().top;
	}

	getDragPosition = (yMousePos) => yMousePos - this._itemInnerOffset - this._itemsContainer.offset;

	toggleItemHover = (id, hover) => () => {
		const { props: { mapController }, state: { isDragging } } = this;

		!isDragging && mapController.togglePlacemarkHighlight(id, hover);
	}

	render() {
		const { points, order, removePoint } = this.props;
		const { isDragging, draggedItem } = this.state;

		const renderPoint = (id) => {
			const pointProps = {
				key: id,
				isDragged: draggedItem.id === id,
				onMouseOver: isDragging ? this.changeOrder(id) : undefined,
				onMouseEnter: this.toggleItemHover(id, true),
				onMouseLeave: this.toggleItemHover(id, false),
				startDragging: this.startDragging(id),
				onRemove: removePoint(id),
				text: points[id],
			}

			return <Point {...pointProps} />;
		}

		return (
			<div className='points-list'>
				<div ref={x => this._itemsContainer.node = x}>
					{order.map(renderPoint)}
					{isDragging && <Point isClone offsetTop={`${draggedItem.yPos}px`} text={draggedItem.node.innerText} />}
				</div>
			</div>
		)
	}
}