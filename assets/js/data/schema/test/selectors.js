/**
 * Internal imports
 */
import { getRoute, getRoutes } from '../selectors';

/**
 * External imports
 */
import deepFreeze from 'deep-freeze';

const testState = deepFreeze( {
	'wc/blocks': {
		'products/attributes': {
			'wc/blocks/products/attributes': [],
		},
		'products/attributes/terms': {
			'wc/blocks/products/attributes/{attribute_id}/terms/{id}': [
				'attribute_id',
				'id',
			],
		},
	},
} );

describe( 'getRoute', () => {
	const invokeTest = ( namespace, modelName, ids = null ) => () =>
		getRoute( testState, namespace, modelName, ids );
	it( 'throws an error if there is no route for the given namespace', () => {
		expect( invokeTest( 'invalid' ) ).toThrowError( /given namespace/ );
	} );
	it(
		'throws an error if there are routes for the given namespace, but no ' +
			'route for the given model',
		() => {
			expect( invokeTest( 'wc/blocks', 'invalid' ) ).toThrowError(
				/given model name/
			);
		}
	);
	it(
		'throws an error if there are routes for the given namespace and ' +
			'model name, but no routes for the given id placeholder map',
		() => {
			expect(
				invokeTest( 'wc/blocks', 'products/attributes', [ 10 ] )
			).toThrowError( /ids you provided/ );
		}
	);
	describe( 'returns expected value for given valid arguments', () => {
		test( 'when there is a route with no placeholders', () => {
			expect( invokeTest( 'wc/blocks', 'products/attributes' )() ).toBe(
				'wc/blocks/products/attributes'
			);
		} );
		test( 'when there is a route with placeholders', () => {
			expect(
				invokeTest( 'wc/blocks', 'products/attributes/terms', {
					attribute_id: 10,
					id: 20,
				} )()
			).toBe( 'wc/blocks/products/attributes/10/terms/20' );
		} );
	} );
} );

describe( 'getRoutes', () => {
	const invokeTest = ( namespace ) => () => getRoutes( testState, namespace );
	it( 'throws an error if there is no route for the given namespace', () => {
		expect( invokeTest( 'invalid' ) ).toThrowError( /given namespace/ );
	} );
	it( 'returns expected routes for given namespace', () => {
		expect( invokeTest( 'wc/blocks' )() ).toEqual( [
			'wc/blocks/products/attributes',
			'wc/blocks/products/attributes/{attribute_id}/terms/{id}',
		] );
	} );
} );
