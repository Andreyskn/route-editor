export class MapController {
	constructor(containerId) {
		if (!window.ymaps) throw new Error('Missing Map API script');

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
}