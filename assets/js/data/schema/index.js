import { registerStore } from '@wordpress/data';
import { controls } from '@wordpress/data-controls';

import { STORE_KEY } from './constants';
import * as selectors from './selectors';
import * as actions from './actions';
import * as resolvers from './resolvers';
import reducer from './reducers';

export default registerStore( STORE_KEY, {
	reducer,
	actions,
	controls,
	selectors,
	resolvers,
} );

export const SCHEMA_STORE_KEY = STORE_KEY;
