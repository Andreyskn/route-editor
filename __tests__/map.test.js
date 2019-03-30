import MapController from '../src/map';

const ymapsFnMocks = {
	addEvent: jest.fn(),
	addGeoObject: jest.fn(),
	removeGeoObject: jest.fn(),
	newPolyline: jest.fn(),
	setPlacemarkOptions: jest.fn(),
}

const ymapsModuleMock = {
	ready: (cb) => cb(),
	Map: function (containerId, options) {
		if (!containerId) throw new Error('id is not defined');

		this.events = {
			add: ymapsFnMocks.addEvent,
		};
		this.getCenter = () => [0,0];
		this.geoObjects = {
			add: ymapsFnMocks.addGeoObject,
			remove: ymapsFnMocks.removeGeoObject,
		};
	},
	Placemark: function (position, props, options) {
		this.events = {
			add: ymapsFnMocks.addEvent,
		};
		this.geometry = {
			getCoordinates: () => [0,0],
		};
		this.options = {
			set: ymapsFnMocks.setPlacemarkOptions,
		}
	},
	Polyline: ymapsFnMocks.newPolyline,
}

const coordinates = [expect.any(Number), expect.any(Number)];

describe('MapController class', () => {

	beforeEach(() => {
		jest.restoreAllMocks();
	})

	it('should trow if ymaps script is not added', () => {
		expect(() => new MapController()).toThrow('script');
	});

	it('should trow if container element id is not passed', () => {
		window.ymaps = ymapsModuleMock;
		const spy = jest.spyOn(ymapsModuleMock, 'Map');

		expect(() => new MapController()).toThrow('id');
		expect(() => new MapController('test')).not.toThrow();
		expect(spy).lastCalledWith('test', expect.objectContaining({ center: coordinates }));
	});

	it('should add ymaps event callback on setActionCallback call', () => {
		window.ymaps = ymapsModuleMock;
		const map = new MapController('test');
		const mockFn = jest.fn();
		map.setActionCallback(mockFn);

		expect(ymapsFnMocks.addEvent).toBeCalledWith('actionend', mockFn);
	})

	it('should add new placemark and draw lines on addPlacemark call', () => {
		window.ymaps = ymapsModuleMock;
		const map = new MapController('test');
		const placemarkSpy = jest.spyOn(ymapsModuleMock, 'Placemark');
		const drawLinesSpy = jest.spyOn(map, 'drawLines');
		map.addPlacemark(0, 'test', [0]);

		expect(map.order).toEqual([0]);
		expect(placemarkSpy).toBeCalledWith(
			coordinates,
			expect.objectContaining({ balloonContent: 'test' }),
			expect.objectContaining({ draggable: true }),
		);
		expect(ymapsFnMocks.addEvent).toBeCalledWith('dragend', map.drawLines);
		expect(map.points[0]).toBeTruthy();
		expect(ymapsFnMocks.addGeoObject).toBeCalledWith(expect.any(Object));
		expect(drawLinesSpy).toBeCalledTimes(1);
	})

	it('should remove placemark correctly', () => {
		window.ymaps = ymapsModuleMock;
		const map = new MapController('test');
		map.addPlacemark(0, 'test', [0]);
		const drawLinesSpy = jest.spyOn(map, 'drawLines');
		map.removePlacemark(0, []);

		expect(map.order).toEqual([]);
		expect(ymapsFnMocks.removeGeoObject).toBeCalledWith(expect.any(Object));
		expect(map.points).toEqual({});
		expect(drawLinesSpy).toBeCalledTimes(1);
	})

	it('should change placemarks order correctly', () => {
		window.ymaps = ymapsModuleMock;
		const map = new MapController('test');
		map.addPlacemark(0, 'test', [0]);
		map.addPlacemark(1, 'test', [0,1]);
		const drawLinesSpy = jest.spyOn(map, 'drawLines');
		map.changeOrder([1,0]);

		expect(map.order).toEqual([1,0]);
		expect(drawLinesSpy).toBeCalledTimes(1);
	})

	it('should draw lines between placemarks correctly', () => {
		window.ymaps = ymapsModuleMock;
		const map = new MapController('test');
		map.addPlacemark(0, 'test', [0]);

		expect(ymapsFnMocks.removeGeoObject).toBeCalledTimes(1);
		expect(ymapsFnMocks.newPolyline).toBeCalledWith(
			expect.arrayContaining([coordinates]),
			expect.any(Object),
			expect.any(Object),
		);
		expect(map.polyline).toBeTruthy();
		expect(ymapsFnMocks.addGeoObject).toBeCalledWith(map.polyline);
	})

	it('should toggle placemark highlight', () => {
		window.ymaps = ymapsModuleMock;
		const map = new MapController('test');
		map.addPlacemark(0, 'test', [0]);

		map.togglePlacemarkHighlight(0, true);
		expect(ymapsFnMocks.setPlacemarkOptions).lastCalledWith('preset', expect.any(String));

		const prevStyle = ymapsFnMocks.setPlacemarkOptions.mock.calls[0][1];
		map.togglePlacemarkHighlight(0, false);
		expect(ymapsFnMocks.setPlacemarkOptions).lastCalledWith(
			'preset',
			expect.not.stringContaining(prevStyle)
		);
	})
});