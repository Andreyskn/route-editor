import React from 'react';
import { mount } from 'enzyme';
import { PointsList, Point } from '../src/components';

describe('<PointsList />', () => {

	const props = {
		points: {0: 'a', 1: 'b', 2: 'c'},
		order: [0, 2, 1],
		removePoint: () => {},
		changeOrder: jest.fn(),
	}

	const pointsList = mount(<PointsList {...props}/>);

	const event = {
		target: {
			getBoundingClientRect: () => ({ top: 1 }),
			parentNode: pointsList.find(Point).get(0)
		},
		clientY: 1,
	}

	describe('Rendering', () => {

		it('renders Default state correctly', () => {
			expect(pointsList).toMatchSnapshot();
		});

		it('renders Drag state correctly', () => {
			pointsList.setState({
				isDragging: true,
				draggedItem: { id: 2, node: pointsList.find(Point).get(1), yPos: 50 },
			});

			expect(pointsList).toMatchSnapshot();
		});

		it('has itemContainer ref', () => {
			expect(pointsList.instance()._itemsContainer.node).toBeTruthy();
		});
	});

	describe('Dragging functions', () => {

		const watchMouseMoveSpy = jest.spyOn(pointsList.instance(), 'watchMouseMove');
		const finishDraggingSpy = jest.spyOn(pointsList.instance(), 'finishDragging');
		const onScrollSpy = jest.spyOn(pointsList.instance(), 'onScroll');

		const addEventMock = jest.fn();
		const removeEventMock = jest.fn();

		const outerNode = document.createElement('div');
		document.body.appendChild(outerNode);

		beforeEach(() => {
			pointsList.instance().startDragging(0)(event);
			pointsList.instance()._itemsContainer.node = {
				getBoundingClientRect: () => ({top: 1}),
			};
			pointsList.instance()._scrollContainer = {
				addEventListener: addEventMock,
				removeEventListener: removeEventMock,
			};
		});

		describe('startDragging', () => {

			it('sets item inner offset', () => {
				expect(pointsList.instance()._itemInnerOffset).toEqual(0);
			});
	
			it('sets item container offset', () => {
				expect(pointsList.instance()._itemsContainer.offset).toEqual(1);
			});
	
			it('sets scroll container', () => {
				expect(pointsList.instance()._itemsContainer.node).toBeTruthy();
			});
	
			it('sets state with drag info', () => {
				const state = pointsList.state();
	
				expect(state.isDragging).toEqual(true);
				expect(state.draggedItem.id).toEqual(0);
				expect(state.draggedItem.node).toBeTruthy();
				expect(state.draggedItem.yPos).toEqual(0);
			});
	
			it('adds event listeners to window and scrollContainer', () => {
				outerNode.dispatchEvent(new Event('mousemove', { bubbles: true }));
				outerNode.dispatchEvent(new Event('mouseup', { bubbles: true }));
	
				expect(watchMouseMoveSpy).toBeCalled();
				expect(finishDraggingSpy).toBeCalled();
				expect(addEventMock).toBeCalledWith('scroll', onScrollSpy);
			});
		});

		describe('finishDragging', () => {

			beforeEach(() => {
				finishDraggingSpy.mockRestore();
				pointsList.instance().finishDragging();
			});

			it('should reset dragging state', () => {
				const emptyItem = { id: null, node: null, yPos: 0 };
				expect(pointsList.state().isDragging).toEqual(false);
				expect(pointsList.state().draggedItem).toEqual(emptyItem);
			})
	
			it('should remove event listeners from window and scrollContainer', () => {
				const finishDraggingSpy = jest.spyOn(pointsList.instance(), 'finishDragging');
				outerNode.dispatchEvent(new Event('mousemove', { bubbles: true }));
				outerNode.dispatchEvent(new Event('mouseup', { bubbles: true }));
	
				expect(watchMouseMoveSpy).not.toBeCalled();
				expect(finishDraggingSpy).not.toBeCalled();
				expect(removeEventMock).toBeCalledWith('scroll', onScrollSpy);
			});
		});
	});

	describe('changeOrder function', () => {

		beforeEach(() => {
			pointsList.setState({
				isDragging: true,
				draggedItem: { id: 2, node: pointsList.find(Point).get(1), yPos: 50 },
			});
		});

		it('should return if targetId is equal currentId', () => {
			pointsList.instance().changeOrder(2)();

			expect(pointsList.prop('changeOrder')).not.toBeCalled();
		})

		it('should call changeOrder prop with new order', () => {
			pointsList.instance().changeOrder(0)();

			expect(pointsList.prop('changeOrder')).toBeCalledWith([2,0,1]);
		})
	});

	describe('onScroll function', () => { 
		it('should change itemsContainer.offset value', () => {
			pointsList.instance()._itemsContainer = {
				node: {
					getBoundingClientRect: () => ({top: 1}),
				},
				offset: 2
			}
			pointsList.instance().onScroll();

			expect(pointsList.instance()._itemsContainer.offset).toEqual(1);
		})
	});

	describe('toggleItemHover function', () => { 
		it('should call togglePlacemarkHighlight when isDragging is false', () => {
			const mockFn = jest.fn();
			pointsList.setProps({ mapController: { togglePlacemarkHighlight: mockFn } });
			pointsList.setState({ isDragging: false });

			pointsList.instance().toggleItemHover(0, true)();
			expect(mockFn).toBeCalledWith(0, true);

			mockFn.mockClear();
			pointsList.setState({ isDragging: true });
			pointsList.instance().toggleItemHover(0, true)();
			expect(mockFn).not.toBeCalled();

		})
	});
});