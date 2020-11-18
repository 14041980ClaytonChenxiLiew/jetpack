
/**
 * External dependencies
 */
import { map } from 'lodash';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';
import { Dropdown, Button, NavigableMenu, MenuItem, MenuGroup, TextControl, BaseControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './editor.scss';

const LOG_TEMPLATE = [
	[ 'core/paragraph', { placeholder: __( 'Start logging…', 'Jetpack' ) } ],
];

const LabelsSelector = ( {
	className,
	labels,
	value,
	onSelect,

	custom,
	onCustom,
} ) => {
	return (
		<div className={ className }>
			<Dropdown
				position="bottom"
				renderToggle={ ( { isOpen, onToggle } ) => (
					<Button isPrimary onClick={ onToggle } aria-expanded={ isOpen }>
						{ value }
					</Button>
				) }
				renderContent={ () => {
					return (
						<NavigableMenu>
							<MenuGroup>
								{ map( labels, ( { value: labelValue, slug } ) => (
									<MenuItem key={ slug } onClick={ () => onSelect( labelValue ) }>
										{ labelValue }
									</MenuItem>
								) ) }
							</MenuGroup>

							<BaseControl
								className={ `${ className }__custom-label` }
								label={ __( 'Custom', 'jetpack' ) }
							>
								<div className={ `${ className }__text-button-container` }>
									<TextControl
										value={ custom }
										onChange={ ( newCustom ) => {
											onSelect( newCustom );
											onCustom( newCustom );
										} }
									/>
								</div>
							</BaseControl>
						</NavigableMenu>
					);
				} }
			/>
		</div>
	);
};

const defaultLabels = [
	{
		name: __( 'Alarm', 'jetpack' ),
		color: 'red',
	},
	{
		name: __( 'Warning', 'jetpack' ),
		color: 'yellow',
	},
	{
		name: __( 'Normal', 'jetpack' ),
		color: 'green',
	},
];

export default function ChangelogEdit ( {
	className,
	attributes,
	setAttributes,
	context,
} ) {
	const { value = '', custom = '' } = attributes;
	const labels = context[ 'change-log/labels' ] ? context[ 'change-log/labels' ] : defaultLabels;

	return (
		<div class={ className }>
			<LabelsSelector
				className={ `${ className }__labels-dropdown` }
				labels={ labels }

				value={ value || labels?.[ 0 ]?.value }
				onSelect={ ( newValue ) => setAttributes( { value: newValue } ) }

				custom={ custom }
				onCustom={ ( newCustom ) => setAttributes( { custom: newCustom } ) }
			/>
			<InnerBlocks
				template={ LOG_TEMPLATE }
				allowedBlocks={ [ 'core/paragraph' ] }
				templateLock="all"
				orientation="horizontal"
			/>
		</div>
	);
}
