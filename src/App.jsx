import React, { Component } from 'react';

import { PointsList } from './components';
import MapController from './map';

const ENTER_KEY = 13;

export class App extends Component {

	_mapController = null;
	_input = null;

	state = {
		points: {},
		order: [],
	}

	componentDidMount() {
		this._mapController = new MapController('map');
		this._input && this._mapController.setActionCallback(this.setInputFocus);
	}

	setInputFocus = () => this._input.focus();

	generateId(ids) { return !ids.length ? 0 : Math.max(...ids) + 1 };

	addPoint = (e) => {
		const value = e.target.value;
		if (e.keyCode !== ENTER_KEY || value === '') return;

		const { points, order } = this.state;

		const newId = this.generateId(order);
		const updatedPoints = { ...points, [newId]: value };
		const updatedOrder = [...order, newId];

		e.target.value = '';

		this.setState({ points: updatedPoints, order: updatedOrder });
		this._mapController.addPlacemark(newId, value, updatedOrder);
	}

	removePoint = (id) => () => {
		const { points, order } = this.state;

		delete points[id];
		const updatedOrder = order.filter(i => i !== id);

		this.setState({ points, order: updatedOrder });
		this._mapController.removePlacemark(id, updatedOrder);
	}

	changeOrder = (order) => {
		this.setState({ order });
		this._mapController.changeOrder(order);
	}

	render() {
		const { points, order } = this.state;

		const inputProps = {
			type: 'text', className: 'input',
			placeholder: 'Новая точка маршрута',
			onKeyDown: this.addPoint, autoFocus: true,
		}

		const pointsListProps = {
			points, order,
			changeOrder: this.changeOrder,
			removePoint: this.removePoint,
			mapController: this._mapController,
		}

		return (
			<div className='app'>
				<div className='sidebar'>
					<input {...inputProps} ref={x => this._input = x} />
					<PointsList {...pointsListProps} />
				</div>
				<div id='map' />
			</div>
		)
	}
}