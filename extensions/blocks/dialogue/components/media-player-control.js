/* global mejs */

/**
 * External dependencies
 */
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { controlBackFive, controlForwardFive } from '../../../shared/icons';
import { STATE_PAUSED, STATE_PLAYING, STORE_ID } from '../../../store/media-source/constants';

export default function MediaPlayerControl( {
	timestamp,
	onTimeChange,
} ) {
	const { mediaId, playerState, domEl } = useSelect( select => {
		const { getDefaultMediaSource, getMediaSourceCurrentTime, getMediaElementDomReference } = select( STORE_ID );
		const mediaSource = getDefaultMediaSource();
		const domRef = getMediaElementDomReference( mediaId );

		let domElement;
		if ( getMediaElementDomReference( mediaId ) ) {
			domElement = document.getElementById( domRef );
		}

		return {
			mediaId: mediaSource?.id,
			playerState: mediaSource?.state,
			currentTime: getMediaSourceCurrentTime( mediaSource?.id, true ),
			domEl: domElement,
		};
	}, [] );

	const {
		playMediaSource,
		pauseMediaSource,
	} = useDispatch( STORE_ID );

	const moveTimestamp = ( offset ) => {
		const prevPlayerState = playerState;
		pauseMediaSource( mediaId );

		const newCurrentTime = mejs.Utils.timeCodeToSeconds( timestamp ) + offset;
		domEl.currentTime = newCurrentTime;
		onTimeChange( { timestamp: mejs.Utils.secondsToTimeCode( newCurrentTime ) } );
		if ( prevPlayerState === STATE_PLAYING ) {
			playMediaSource( mediaId );
		}
	};

	if ( ! mediaId ) {
		return null;
	}

	return (
		<ToolbarGroup>
			<ToolbarButton
				icon={ controlBackFive }
				onClick={ () => moveTimestamp( -5 ) }
			/>

			<ToolbarButton
				icon={ playerState === STATE_PAUSED
					? 'controls-play'
					: 'controls-pause'
				}
				onClick={ () => {
					if ( playerState === STATE_PLAYING ) {
						return pauseMediaSource( mediaId );
					}
					const newCurrentTime = mejs.Utils.timeCodeToSeconds( timestamp );
					domEl.currentTime = newCurrentTime;
					playMediaSource( mediaId );
				} }
			/>
			<ToolbarButton
				icon={ controlForwardFive }
				onClick={ () => moveTimestamp( 5 ) }
			/>
		</ToolbarGroup>
	);
}