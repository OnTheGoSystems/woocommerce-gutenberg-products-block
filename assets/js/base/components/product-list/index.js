/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Pagination from '@woocommerce/base-components/pagination';
import ProductSortSelect from '@woocommerce/base-components/product-sort-select';
import ProductListItem from '@woocommerce/base-components/product-list-item';
import withProducts from '@woocommerce/base-hocs/with-products';
import withScrollToTop from '@woocommerce/base-hocs/with-scroll-to-top';
import withComponentId from '@woocommerce/base-hocs/with-component-id';
import './style.scss';

const ProductList = ( {
	attributes,
	currentPage,
	onOrderChange,
	onPageChange,
	sortValue,
	products,
	scrollToTop,
	totalProducts,
	componentId,
} ) => {
	const onPaginationChange = ( newPage ) => {
		scrollToTop( { focusableSelector: 'a, button' } );
		onPageChange( newPage );
	};

	const getClassnames = () => {
		const { columns, rows, className, alignButtons, align } = attributes;
		const alignClass = typeof align !== 'undefined' ? 'align' + align : '';

		return classnames(
			'wc-block-grid',
			className,
			alignClass,
			'has-' + columns + '-columns',
			{
				'has-multiple-rows': rows > 1,
				'has-aligned-buttons': alignButtons,
			}
		);
	};

	const perPage = attributes.columns * attributes.rows;
	const totalPages = Math.ceil( totalProducts / perPage );
	const listProducts = products.length
		? products
		: Array.from( { length: perPage } );

	return (
		<div className={ getClassnames() }>
			{ attributes.showOrderby && (
				<ProductSortSelect
					onChange={ onOrderChange }
					value={ sortValue }
				/>
			) }
			<ul className="wc-block-grid__products">
				{ listProducts.map( ( product = {}, i ) => (
					<ProductListItem
						key={ product.id || i }
						attributes={ attributes }
						product={ product }
						componentId={ componentId }
					/>
				) ) }
			</ul>
			{ totalProducts > perPage && (
				<Pagination
					currentPage={ currentPage }
					onPageChange={ onPaginationChange }
					totalPages={ totalPages }
				/>
			) }
		</div>
	);
};

ProductList.propTypes = {
	attributes: PropTypes.object.isRequired,
	// From withScrollToTop.
	scrollToTop: PropTypes.func,
	// From withProducts.
	products: PropTypes.array,
	// from withComponentId
	componentId: PropTypes.number.isRequired,
};

export default withComponentId( withScrollToTop( withProducts( ProductList ) ) );
