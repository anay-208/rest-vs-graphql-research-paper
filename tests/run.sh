#!/bin/bash
set -a
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.env"
set +a

INTERFACE="eth0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$SCRIPT_DIR/results"

PROFILES=(
    "baseline"
    "4g"
    "slow4g"
    "3g"
    "constrained"
    "severely-constrained"
)

SCENARIOS=(
    "rest/scenario-1"
    "rest/scenario-2"
    "rest/scenario-3"
    "graphql/scenario-1"
    "graphql/scenario-2"
    "graphql/scenario-3"
)

apply_profile() {
    local profile=$1
    sudo tc qdisc del dev $INTERFACE root 2>/dev/null
    case $profile in
        baseline)
            sudo tc qdisc add dev $INTERFACE root netem rate 10mbit delay 10ms loss 0%
            ;;
        4g)
            sudo tc qdisc add dev $INTERFACE root netem rate 2mbit delay 50ms loss 0%
            ;;
        slow4g)
            sudo tc qdisc add dev $INTERFACE root netem rate 1mbit delay 100ms loss 0%
            ;;
        3g)
            sudo tc qdisc add dev $INTERFACE root netem rate 400kbit delay 200ms loss 0%
            ;;
        constrained)
            sudo tc qdisc add dev $INTERFACE root netem rate 150kbit delay 300ms loss 1%
            ;;
        severely-constrained)
            sudo tc qdisc add dev $INTERFACE root netem rate 50kbit delay 500ms loss 3%
            ;;
    esac
    echo "Applied profile: $profile"
    tc qdisc show dev $INTERFACE
}

for profile in "${PROFILES[@]}"; do
    echo "========================================"
    echo "Starting profile: $profile"
    echo "========================================"

    apply_profile "$profile"

    for scenario in "${SCENARIOS[@]}"; do
        LOG_FILE="$SCRIPT_DIR/results/${scenario//\//-}-${profile}.log"
        JSON_FILE="$SCRIPT_DIR/results/${scenario//\//-}-${profile}.json"

        echo "Running $scenario under $profile..."

        k6 run \
            -e REST_URL=$REST_URL \
            -e GRAPHQL_URL=$GRAPHQL_URL \
            -e PROFILE=$profile \
            --out json="$JSON_FILE" \
            "$SCRIPT_DIR/${scenario}.js" 2>&1 | tee "$LOG_FILE"

        echo "Saved: $LOG_FILE"
        echo "---"
        sleep 2
    done

    echo "Completed profile: $profile"
    echo ""
done

# Reset network
sudo tc qdisc del dev $INTERFACE root 2>/dev/null
echo "========================================"
echo "All profiles and scenarios complete."
echo "========================================"