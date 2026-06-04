#!/bin/bash
source "$(dirname "$0")/load-env.sh"

PROFILE=$1

SCENARIOS=(
    "rest/scenario-1"
    "rest/scenario-2"
    "rest/scenario-3"
    "graphql/scenario-1"
    "graphql/scenario-2"
    "graphql/scenario-3"
)

SCRIPT_DIR="$(dirname "$0")"

for scenario in "${SCENARIOS[@]}"; do
    echo "Running $scenario under $PROFILE..."
    k6 run \
        -e REST_URL=$REST_URL \
        -e GRAPHQL_URL=$GRAPHQL_URL \
        --out json=results/${scenario//\//-}-${PROFILE}.json \
        "$SCRIPT_DIR/${scenario}.js"
    sleep 2
done