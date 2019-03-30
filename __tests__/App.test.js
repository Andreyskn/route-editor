import React from 'react';
import { mount, shallow } from 'enzyme';
import { App } from '../src/App';
import MapController from '../src/map';

const mocks = {
	setActionCallback: jest.fn(),
	addPlacemark: jest.fn(),
	removePlacemark: jest.fn(),
	changeOrder: jest.fn(),
}

jest.mock('../src/map', () => jest.fn().mockImplementation(() => mocks));

describe('<App />', () => {

	const event = {
		target: { value: 'test' },
		keyCode: 13,
	}

	describe('Rendering', () => {

		it('renders correctly', () => {
			expect(mount(<App />)).toMatchSnapshot();
		})
	})

	describe('MapController calls', () => {

		beforeEach(() => {
			jest.restoreAllMocks();
		})

		it('on componentDidMount should create MapController instance and call setActionCallback', () => {
			mount(<App />);
			expect(MapController).toBeCalledWith(expect.any(String));
			expect(mocks.setActionCallback).toBeCalledWith(expect.any(Function));
		})

		it('should call addPlacemark method when new point is added', () => {
			const wrapper = mount(<App />);
			wrapper.instance().addPoint(event);
			expect(mocks.addPlacemark).toBeCalledWith(0, 'test', [0]);
		})

		it('should call removePlacemark method when point is removed', () => {
			const wrapper = mount(<App />);
			wrapper.instance().addPoint(event);
			wrapper.instance().removePoint(0)();
			expect(mocks.removePlacemark).toBeCalledWith(0, []);
		})

		it('should call changeOrder method when points order are reordered', () => {
			const wrapper = mount(<App />);
			wrapper.instance().changeOrder([1,2,3]);
			expect(mocks.changeOrder).toBeCalledWith([1,2,3]);
		})
	})

	describe('Component methods', () => {

		it('should update points on removePoint call', () => {
			const wrapper = shallow(<App/>);
			wrapper.setState({ points: { 0: 'a', 1: 'b' }, order: [0, 1] });
			wrapper.instance().removePoint(0)();
			const state = wrapper.state();
			expect(state.points).toEqual({ 1: 'b' });
			expect(state.order).toEqual([1]);
		})

		it('should generate unique id for new point', () => {
			const wrapper = shallow(<App/>);
			const generateIdSpy = jest.spyOn(wrapper.instance(), 'generateId');

			wrapper.instance().generateId([]);
			expect(generateIdSpy).lastReturnedWith(0);

			wrapper.instance().generateId([0,1,2]);
			expect(generateIdSpy).lastReturnedWith(3);
		})

		it('should focus input when setInputFocus is called', () => {
			const wrapper = shallow(<App/>);
			const mockFn = jest.fn();
			wrapper.instance()._input = { focus: mockFn };
			wrapper.instance().setInputFocus();

			expect(mockFn).toBeCalled();
		})
	})
});