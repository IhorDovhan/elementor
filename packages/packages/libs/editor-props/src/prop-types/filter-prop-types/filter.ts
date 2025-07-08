import { z } from '@elementor/schema';

import { createPropUtils } from '../../utils/create-prop-utils';
import { blurFilterPropTypeUtil } from './blur-filter';
import { brightnessFilterPropTypeUtil } from './brightness-filter';
import { contrastFilterPropTypeUtil } from './contrast-filter';
import { dropShadowFilterPropTypeUtil } from './drop-shadow-filter';
import { grayscaleFilterPropTypeUtil } from './grayscale-filter';
import { hueRotateFilterPropTypeUtil } from './hue-rotate-filter';
import { invertFilterPropTypeUtil } from './invert-filter';
import { saturateFilterPropTypeUtil } from './saturate-filter';
import { sepiaFilterPropTypeUtil } from './sepia-filter';
import { sizePropTypeUtil } from '../size';
import { stringPropTypeUtil } from '../string';

export const filterFunction = createPropUtils( 'css-func', z.object( {
	func: stringPropTypeUtil.schema,
	args: sizePropTypeUtil.schema,
} ) );

// export const filterTypes = z.union( [
// 	blurFilterPropTypeUtil.schema,
// 	brightnessFilterPropTypeUtil.schema,
// 	contrastFilterPropTypeUtil.schema,
// 	grayscaleFilterPropTypeUtil.schema,
// 	invertFilterPropTypeUtil.schema,
// 	saturateFilterPropTypeUtil.schema,
// 	sepiaFilterPropTypeUtil.schema,
// 	hueRotateFilterPropTypeUtil.schema,
// 	dropShadowFilterPropTypeUtil.schema,
// ] );

export const filterPropTypeUtil = createPropUtils( 'filter', z.array( filterFunction.schema ) );

export type FilterPropValue = z.infer< typeof filterPropTypeUtil.schema >;

export type FilterItemPropValue = z.infer< typeof filterFunction.schema >;
