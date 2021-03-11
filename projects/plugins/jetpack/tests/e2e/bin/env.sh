#!/bin/bash

# Exit if any command fails.
set -e

function usage {
	echo "usage: $0 command"
	echo "  start                        Setup the docker containers for E2E tests"
	echo "  reset                        Reset the containers state"
	echo "  -h | usage                   output this message"
	exit 1
}

start_env() {
	yarn wp-env start
	yarn wp-env run tests-wordpress sh wp-content/plugins/jetpack-dev/tests/e2e/bin/container-setup.sh wp-config
	configure_wp_env
}

reset_env() {
	yarn wp-env clean
	configure_wp_env
}

configure_wp_env() {
	if [ "$GUTENBERG" == "latest" ]; then
		yarn wp-env run tests-cli wp plugin install gutenberg --activate
	elif [ "$GUTENBERG" == "pre-release" ]; then
		GB_ZIP="wp-content/gutenberg.zip"
		yarn wp-env run tests-wordpress "wp-content/plugins/jetpack-dev/tests/e2e/bin/container-setup.sh gb-prerelease $GB_ZIP"
		yarn wp-env run tests-cli "wp plugin install $GB_ZIP"
		yarn wp-env run tests-cli "wp plugin activate gutenberg"
	fi

	yarn wp-env run tests-cli wp plugin activate jetpack-dev

	echo
	echo "WordPress is ready!"
	echo
}

if [ "${1}" == "start" ]; then
	start_env
elif [ "${1}" == "reset" ]; then
	reset_env
elif [ "${1}" == "usage" ]; then
	usage
else
	usage
fi
