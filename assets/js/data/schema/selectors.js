/**
 * External dependencies
 */
import { sprintf } from '@wordpress/i18n';

/**
 * Returns the requested route for the given arguments.
 *
 * @param {Object} state                   The original state.
 * @param {string} namespace               The namespace for the route.
 * @param {string} modelName               The model being requested
 *                                         (i.e. products/attributes)
 * @param {Object} [idPlaceholderMap=null] Properties should correspond to the
 *                                         route placeholder name for parameters
 *                                         in the route.
 *
 * @throws {Error}  If there is no route for the given arguments, then this will
 *                  throw
 *
 * @return {string} The route if it is available.
 */
export const getRoute = (
	state,
	namespace,
	modelName,
	idPlaceholderMap = null
) => {
	if ( ! state[ namespace ] ) {
		throw new Error(
			sprintf(
				'There is no route for the given namespace (%s) in the store',
				namespace
			)
		);
	}
	if ( ! state[ namespace ][ modelName ] ) {
		throw new Error(
			sprintf(
				'There is no route for the given model name (%s) in the store',
				modelName
			)
		);
	}
	const route = getRouteFromModelEntries(
		state[ namespace ][ modelName ],
		idPlaceholderMap
	);
	if ( route === '' ) {
		throw new Error(
			sprintf(
				'While there is a route for the given namespace (%s) and model name (%s), the ids you provided are missing a necessary property for the route, the available routes are:',
				namespace,
				modelName,
				state[ namespace ][ modelName ]
			)
		);
	}
	return route;
};

/**
 * Return all the routes for a given namespace.
 *
 * @param {Object} state     The current state.
 * @param {string} namespace The namespace to return routes for.
 *
 * @return {Array} An array of all routes for the given namespace.
 */
export const getRoutes = ( state, namespace ) => {
	const routes = state[ namespace ];
	if ( ! routes ) {
		throw new Error(
			sprintf(
				'There is no route for the given namespace (%s) in the store',
				namespace
			)
		);
	}
	let namespaceRoutes = [];
	for ( const modelName in routes ) {
		namespaceRoutes = [
			...namespaceRoutes,
			...Object.keys( routes[ modelName ] ),
		];
	}
	return namespaceRoutes;
};

/**
 * Returns the route from the given slice of the route state.
 *
 * @param {Object} stateSlice               This will be a slice of the route
 *                                          state from a given namespace and
 *                                          model name.
 * @param {Object} [idPlaceholderMap=null]  Any id references that are to be
 *                                          used in a route with placeholders.
 *
 * @returns {string}  The route or an empty string if nothing found.
 */
const getRouteFromModelEntries = ( stateSlice, idPlaceholderMap = null ) => {
	// convert to array for easier discovery
	stateSlice = Object.entries( stateSlice );
	const match = stateSlice.find( ( [ , idNames ] ) => {
		if ( idPlaceholderMap === null && idNames.length === 0 ) {
			return true;
		}
		return (
			Object.keys( idPlaceholderMap ).length === idNames.length &&
			idNames.filter( ( id ) => !! idPlaceholderMap[ id ] )
		);
	} );
	const [ matchingRoute, routePlaceholders ] = match || [];
	// if we have a matching route, let's return it.
	if ( matchingRoute ) {
		return idPlaceholderMap === null
			? matchingRoute
			: assembleRouteWithIdPlaceholderMap(
					matchingRoute,
					routePlaceholders,
					idPlaceholderMap
			  );
	}
	return '';
};

/**
 * For a given route, route parts and ids,
 *
 * @param {string} route
 * @param {array}  routeParts
 * @param {Object} idPlacholderMap
 *
 * @returns {string}
 */
const assembleRouteWithIdPlaceholderMap = (
	route,
	routePlaceholders,
	idPlacholderMap
) => {
	routePlaceholders.forEach( ( part ) => {
		route = route.replace( `{${ part }}`, idPlacholderMap[ part ] );
	} );
	return route;
};
