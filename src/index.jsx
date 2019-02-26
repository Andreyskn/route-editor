import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import { PointsList } from './components';
import { MapController } from './map';

const ENTER_KEY = 13;

class App extends Component {

	_mapController = null;

	state = {
		points: {},
		order: [],
	}

	componentDidMount() {
		this._mapController = new MapController('map');
	}

	generateId = (ids) => !ids.length ? 0 : Math.max(...ids) + 1;

	addPoint = (e) => {
		const value = e.target.value;

		if (e.keyCode === ENTER_KEY && value !== '') {
			const { points, order } = this.state;

			const newId = this.generateId(order);
			const updatedPoints = { ...points, [newId]: value };
			const updatedOrder = [...order, newId];

			e.target.value = '';

			this.setState({ points: updatedPoints, order: updatedOrder });
		}
	}

	removePoint = (id) => () => {
		const { points, order } = this.state;

		delete points[id];
		const updatedOrder = order.filter(i => i !== id);

		this.setState({ points, order: updatedOrder });
	}

	changeOrder = (order) => {
		this.setState({ order });
	}

	render() {
		const { points, order } = this.state;

		return (
			<div className='app'>
				<div className='sidebar'>
					<input type='text' className='input' autoFocus placeholder='Новая точка маршрута' onKeyDown={this.addPoint} />
					<PointsList points={points} order={order} changeOrder={this.changeOrder} removePoint={this.removePoint} />
				</div>
				<div id='map' />
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
