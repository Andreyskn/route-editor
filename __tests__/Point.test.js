import React from 'react';
import { shallow } from 'enzyme';
import { Point } from '../src/components';

describe('<Point />', () => {

	const renderPoint = (props = {}) => shallow(<Point {...props}/>);

	describe('Rendering', () => {
		const defaultProps = {
			text: 'Test text',
		}

		it('renders Default state correctly', () => {
			expect(renderPoint(defaultProps)).toMatchSnapshot();
		});

		it('renders Dragged state correctly', () => {
			const dragProps = {
				isDragged: true,
			}

			expect(renderPoint({...defaultProps, ...dragProps})).toMatchSnapshot();
		});

		it('renders Clone state correctly', () => {
			const cloneProps = {
				isClone: true,
				offsetTop: '10px',
			}

			expect(renderPoint({...defaultProps, ...cloneProps})).toMatchSnapshot();
		});
	});

	describe('Mouse handlers', () => {
		const mockFn = jest.fn();

		it('calls onRemove function when remove button is clicked', () => {
			renderPoint({ onRemove: mockFn }).find('.point-btn').simulate('click');
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('calls startDragging function when mousedown event is triggered on point-overlay', () => {
			renderPoint({ startDragging: mockFn }).find('.point-overlay').simulate('mousedown');
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('calls onMouseOver, onMouseEnter, onMouseLeave functions when mouse is moving over container element', () => {
			renderPoint({ onMouseOver: mockFn, onMouseEnter: mockFn, onMouseLeave: mockFn })
				.simulate('mouseover')
				.simulate('mouseenter')
				.simulate('mouseleave');
			expect(mockFn).toHaveBeenCalledTimes(3);
		})
	});
});