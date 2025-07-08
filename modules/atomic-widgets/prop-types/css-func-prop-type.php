<?php

namespace Elementor\Modules\AtomicWidgets\PropTypes;

use Elementor\Modules\AtomicWidgets\PropTypes\Base\Object_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Primitives\Number_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Primitives\String_Prop_Type;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Css_Func_Prop_Type extends Object_Prop_Type {

	public static function get_key(): string {
		return 'css-func';
	}

	protected function validate_value( $value ): bool {
		return true;
	}

	

	protected function define_shape(): array {
		return [
			'func' => String_Prop_Type::make()->enum( [ 'blur', 'brightness', 'contrast', 'grayscale', 'invert', 'saturate', 'sepia', 'hue-rotate' ] ),
			'args' => Size_Prop_Type::make()->required(),
		];
	}
}
