export class MapController {
	constructor(containerId) {
		if (!window.ymaps) throw new Error('Missing Map API script');

		this.map = null;
		this.points = {};
		this.polyline = null;
		this.order = [];

		window.ymaps.ready(() => this.init(containerId));
	}

	init = (containerId) => {
		try {
			this.map = new ymaps.Map(containerId, {
				center: [57.638724, 44.083593],
				zoom: 4,
				controls: [],
			});
		} catch {
			throw new Error(`Element with id="${containerId}" not found in DOM`);
		}
	}

	setActionCallback = (callback) => {
		window.ymaps.ready(() => this.map && this.map.events.add('actionend', callback));
	}

	addPlacemark = (id, name, order) => {
		this.order = order;

		const newPoint = new ymaps.Placemark(
			this.map.getCenter(),
			{ balloonContent: name },
			{ draggable: true, preset: 'islands#blueDotIcon' }
		);
		newPoint.events.add('dragend', this.drawLines);

		this.points[id] = newPoint;
		this.map.geoObjects.add(newPoint);

		this.drawLines();
	}

	removePlacemark = (id, order) => {
		this.order = order;

		this.map.geoObjects.remove(this.points[id]);
		delete this.points[id];

		this.drawLines();
	}

	changeOrder = (order) => {
		this.order = order;

		this.drawLines();
	}

	drawLines = () => {
		this.map.geoObjects.remove(this.polyline);

		this.polyline = new ymaps.Polyline(
			this.order.map(id => this.points[id].geometry.getCoordinates()),
			{},
			{ strokeWidth: 2, strokeColor: '#0000FF' }
		);

		this.map.geoObjects.add(this.polyline);
	}

	togglePlacemarkHighlight = (id, highlight) => {
		this.points[id].options.set('preset', highlight ? 'islands#greenDotIcon' : 'islands#blueDotIcon');
	}
}