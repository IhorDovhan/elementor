import * as React from 'react';
import { useRef } from 'react';
import {
	blurFilterPropTypeUtil,
	brightnessFilterPropTypeUtil,
	contrastFilterPropTypeUtil,
	dropShadowFilterPropTypeUtil,
	type FilterItemPropValue,
	filterPropTypeUtil,
	grayscaleFilterPropTypeUtil,
	hueRotateFilterPropTypeUtil,
	invertFilterPropTypeUtil,
	type PropKey,
	type PropTypeUtil,
	saturateFilterPropTypeUtil,
	sepiaFilterPropTypeUtil,
	type SizePropValue,
} from '@elementor/editor-props';
import { backdropFilterPropTypeUtil } from '@elementor/editor-props';
import { MenuListItem } from '@elementor/editor-ui';
import { Box, Grid, Select, type SelectChangeEvent } from '@elementor/ui';
import { __ } from '@wordpress/i18n';

import { PropKeyProvider, PropProvider, useBoundProp } from '../bound-prop-context';
import { ControlLabel } from '../components/control-label';
import { PopoverContent } from '../components/popover-content';
import { PopoverGridContainer } from '../components/popover-grid-container';
import { type CollectionPropUtil, Repeater } from '../components/repeater';
import { createControl } from '../create-control';
import { defaultUnits, type Unit } from '../utils/size-control';
import { DropShadowItemContent } from './filter-control/drop-shadow-item-content';
import { DropShadowItemLabel } from './filter-control/drop-shadow-item-label';
import { SizeControl } from './size-control';
import { SelectControl } from './select-control';

type FilterType = FilterItemPropValue[ 'value' ][ 'func' ];
type FilterValue = FilterItemPropValue[ 'value' ][ 'args' ];

const DEFAULT_FILTER = 'blur';

type FilterItemConfig = {
	defaultValue: FilterItemPropValue;
	name: string;
	valueName: string;
	// propType: PropTypeUtil< FilterValue, FilterValue >;
	units?: Exclude< SizePropValue[ 'value' ][ 'unit' ], 'custom' | 'auto' >[];
};

const filterConfig: Record< string, FilterItemConfig > = {
	blur: {
		defaultValue: { $$type: 'css-func', value: { func: { $$type: 'string', value: 'blur' }, args: { $$type: 'size', value: { size: 0, unit: 'px' } } } },
		name: __( 'Blur', 'elementor' ),
		valueName: __( 'Radius', 'elementor' ),
		// propType: blurFilterPropTypeUtil,
		units: defaultUnits.filter( ( unit ) => unit !== '%' ),
	},
	
	brightness: {
		defaultValue: { $$type: 'css-func', value: { func: { $$type: 'string', value: 'brightness' }, args: { $$type: 'size', value: { size: 100, unit: '%' } } } },
		name: __( 'Brightness', 'elementor' ),
		valueName: __( 'Amount', 'elementor' ),
		// propType: brightnessFilterPropTypeUtil,
		units: [ '%' ],
	},
	contrast: {
		defaultValue: { $$type: 'css-func', value: { func: { $$type: 'string', value: 'contrast' }, args: { $$type: 'size', value: { size: 100, unit: '%' } } } },
		name: __( 'Contrast', 'elementor' ),
		valueName: __( 'Amount', 'elementor' ),
		// propType: contrastFilterPropTypeUtil,
		units: [ '%' ],
	},
	'hue-rotate': {
		defaultValue: { $$type: 'css-func', value: { func: { $$type: 'string', value: 'hue-rotate' }, args: { $$type: 'size', value: { size: 0, unit: 'deg' } } } },
		name: __( 'Hue Rotate', 'elementor' ),
		valueName: __( 'Angle', 'elementor' ),
		// propType: hueRotateFilterPropTypeUtil,
		units: [ 'deg', 'rad', 'grad', 'turn' ],
	},
	saturate: {
		defaultValue: { $$type: 'css-func', value: { func: { $$type: 'string', value: 'saturate' }, args: { $$type: 'size', value: { size: 100, unit: '%' } } } },
		name: __( 'Saturate', 'elementor' ),
		valueName: __( 'Amount', 'elementor' ),
		// propType: saturateFilterPropTypeUtil,
		units: [ '%' ],
	},
	grayscale: {
		defaultValue: { $$type: 'css-func', value: { func: { $$type: 'string', value: 'grayscale' }, args: { $$type: 'size', value: { size: 0, unit: '%' } } } },
		name: __( 'Grayscale', 'elementor' ),
		valueName: __( 'Amount', 'elementor' ),
		// propType: grayscaleFilterPropTypeUtil,
		units: [ '%' ],
	},
	invert: {
		defaultValue: { $$type: 'css-func', value: { func: { $$type: 'string', value: 'invert' }, args: { $$type: 'size', value: { size: 0, unit: '%' } } } },
		name: __( 'Invert', 'elementor' ),
		valueName: __( 'Amount', 'elementor' ),
		// propType: invertFilterPropTypeUtil,
		units: [ '%' ],
	},
	sepia: {
		defaultValue: { $$type: 'css-func', value: { func: { $$type: 'string', value: 'sepia' }, args: { $$type: 'size', value: { size: 0, unit: '%' } } } },
		name: __( 'Sepia', 'elementor' ),
		valueName: __( 'Amount', 'elementor' ),
		// propType: sepiaFilterPropTypeUtil,
		units: [ '%' ],
	},
	// 'drop-shadow': {
	// 	defaultValue: {
	// 		$$type: 'css-func',
	// 		value: {
	// 			func: 'drop-shadow',
	// 			args: {
	// 				xAxis: { $$type: 'size', value: { size: 0, unit: 'px' } },
	// 				yAxis: { $$type: 'size', value: { size: 0, unit: 'px' } },
	// 				blur: { $$type: 'size', value: { size: 10, unit: 'px' } },
	// 				color: { $$type: 'color', value: 'rgba(0, 0, 0, 1)' },
	// 			},
	// 		}
	// 	},
	// 	name: __( 'Drop shadow', 'elementor' ),
	// 	valueName: __( 'Drop-shadow', 'elementor' ),
	// 	propType: dropShadowFilterPropTypeUtil,
	// 	units: defaultUnits.filter( ( unit ) => unit !== '%' ),
	// },
};

const filterKeys = Object.keys( filterConfig );

const isSingleSize = ( key: string ): boolean => {
	return ! [ 'drop-shadow' ].includes( key );
};

export const FilterRepeaterControl = createControl( ( { filterPropName = 'filter' }: { filterPropName?: string } ) => {
	const [ propUtil, label ] =
		filterPropName === 'backdrop-filter'
			? [ backdropFilterPropTypeUtil, __( 'Backdrop Filters', 'elementor' ) ]
			: [ filterPropTypeUtil, __( 'Filters', 'elementor' ) ];
	const { propType, value: filterValues, setValue, disabled } = useBoundProp( propUtil );

	return (
		<PropProvider propType={ propType } value={ filterValues } setValue={ setValue }>
			<Repeater
				openOnAdd
				disabled={ disabled }
				values={ filterValues ?? [] }
				setValues={ setValue }
				label={ label }
				collectionPropUtil={ propUtil }
				itemSettings={ {
					Icon: ItemIcon,
					Label: ItemLabel,
					Content: ItemContent,
					initialValues: filterConfig[ DEFAULT_FILTER ].defaultValue,
				} }
			/>
		</PropProvider>
	);
} );

const ItemIcon = () => <></>;

const ItemLabel = ( { value }: { value: FilterItemPropValue } ) => {
	return isSingleSize( value.value.func.value! ) ? (
		<SingleSizeItemLabel value={ value } />
	) : (
		<DropShadowItemLabel value={ value } />
	);
};

const SingleSizeItemLabel = ( { value }: { value: FilterItemPropValue } ) => {
	const { func, args } = value.value;
	const defaultUnit = ( filterConfig[ func.value! ].defaultValue.value.args as SizePropValue ).value.unit ?? defaultUnits[ 0 ];
	const { unit, size } = ( args as SizePropValue ).value ?? { unit: defaultUnit, size: 0 };

	const label = (
		<Box component="span" style={ { textTransform: 'capitalize' } }>
			{ func.value }:
		</Box>
	);

	return (
		<Box component="span">
			{ label }
			{ unit !== 'custom' ? ` ${ size ?? 0 }${ unit ?? defaultUnit }` : size }
		</Box>
	);
};

const ItemContent = ( {
	bind,
	collectionPropUtil,
	anchorEl,
}: {
	bind: PropKey;
	collectionPropUtil?: CollectionPropUtil< FilterItemPropValue >;
	anchorEl?: HTMLElement | null;
} ) => {
	const { value: filterValues, setValue } = useBoundProp( collectionPropUtil ?? filterPropTypeUtil );
	const itemIndex = parseInt( bind, 10 );
	const item = filterValues?.[ itemIndex ];

	// const handleChange = ( e: SelectChangeEvent< string > ) => {
	// 	const newFilterValues = [ ...filterValues ];
	// 	const filterType = e.target.value as FilterType;

	// 	newFilterValues[ itemIndex ] = {
	// 		$$type: 'css-func',
	// 		value: {
	// 			func: filterType,
	// 			args: { ...filterConfig[ filterType ].defaultValue.value.args },
	// 		},
	// 	} as FilterItemPropValue;

	// 	setValue( newFilterValues );
	// };

	// const handleChange = ( newValue: string | null, previousValue: string | null | undefined ) => {
	// 	const newFilterValues = [ ...filterValues ];
	// 	const filterType = newValue as FilterType;

	// newFilterValues[ itemIndex ] = {
	// 	$$type: 'css-func',
	// 	value: {
	// 			func: filterType,
	// 			args: { ...filterConfig[ filterType ].defaultValue.value.args },
	// 		},
	// 	} as FilterItemPropValue;

	// 	setValue( newFilterValues );
	// };

	return (
		<PropKeyProvider bind={ bind }>
			<PopoverContent p={ 1.5 }>
				<PopoverGridContainer>
					<Grid item xs={ 6 }>
						<ControlLabel>{ __( 'Filter', 'elementor' ) }</ControlLabel>
					</Grid>
					<Grid item xs={ 6 }>
						<PropKeyProvider bind='func'>
							<SelectControl
								options={ filterKeys.map( ( filterKey ) => ( {
									label: filterConfig[ filterKey ].name,
									value: filterKey,
								} ) ) }
								// onChange={ handleChange }
							/>						
						</PropKeyProvider>						
					</Grid>
				</PopoverGridContainer>
				<Content filterType={ item?.value.func } anchorEl={ anchorEl } />
			</PopoverContent>
		</PropKeyProvider>
	);
};

const Content = ( { filterType, anchorEl }: { filterType: FilterType; anchorEl?: HTMLElement | null } ) => {
	const { units = [] } = filterConfig[ filterType.value! ];

	return isSingleSize( filterType.value! ) ? (
		<SingleSizeItemContent filterType={ filterType.value! } />
	) : (
		<DropShadowItemContent propType={ dropShadowFilterPropTypeUtil } units={ units as Unit[] } anchorEl={ anchorEl } />
	);
};

const SingleSizeItemContent = ( { filterType }: { filterType: string } ) => {
	const { valueName, defaultValue, units } = filterConfig[ filterType ];	
	const rowRef = useRef< HTMLDivElement >( null );
	const defaultUnit = ( defaultValue.value.args as SizePropValue ).value.unit;

	return (
		<PropKeyProvider bind='args'>			
			<PopoverGridContainer ref={ rowRef }>
				<Grid item xs={ 6 }>
					<ControlLabel>{ valueName }</ControlLabel>
				</Grid>
				<Grid item xs={ 6 }>
					<SizeControl anchorRef={ rowRef } units={ units as Unit[] } defaultUnit={ defaultUnit as Unit } />
				</Grid>
			</PopoverGridContainer>			
		</PropKeyProvider>
	);
};
