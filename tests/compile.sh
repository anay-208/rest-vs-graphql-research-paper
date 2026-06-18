#!/bin/bash

OUTPUT="./results/metrics.csv"

echo "scenario,profile,api,avg_ms,min_ms,med_ms,max_ms,p90_ms,p95_ms,total_requests,data_received,http_req_failed_pct" > "$OUTPUT"

parse_duration() {
    local val=$1
    if [[ $val == *"µs" ]]; then
        echo "$val" | sed 's/µs//' | awk '{printf "%.4f", $1/1000}'
    elif [[ $val == *"ms" ]]; then
        echo "$val" | sed 's/ms//'
    elif [[ $val == *"s" ]]; then
        echo "$val" | sed 's/s//' | awk '{printf "%.4f", $1*1000}'
    else
        echo "0"
    fi
}

extract_val() {
    local line=$1
    local key=$2
    echo "$line" | sed "s/.*${key}=\([^ ]*\).*/\1/"
}

for logfile in ./results/*.log; do
    filename=$(basename "$logfile" .log)

    api=$(echo "$filename" | cut -d'-' -f1)
    scenario_num=$(echo "$filename" | sed 's/.*scenario-\([0-9]*\).*/\1/')
    scenario="scenario-${scenario_num}"
    profile=$(echo "$filename" | sed "s/${api}-scenario-${scenario_num}-//")

    duration_line=$(grep "iteration_duration\.\." "$logfile" | head -1)

    avg=$(extract_val "$duration_line" "avg")
    min=$(extract_val "$duration_line" "min")
    med=$(extract_val "$duration_line" "med")
    max=$(extract_val "$duration_line" "max")
    p90=$(extract_val "$duration_line" "p(90)")
    p95=$(extract_val "$duration_line" "p(95)")

    avg_ms=$(parse_duration "$avg")
    min_ms=$(parse_duration "$min")
    med_ms=$(parse_duration "$med")
    max_ms=$(parse_duration "$max")
    p90_ms=$(parse_duration "$p90")
    p95_ms=$(parse_duration "$p95")

    total_requests=$(grep "http_reqs\.\." "$logfile" | head -1 | awk '{print $2}')
    data_received=$(grep "data_received\.\." "$logfile" | head -1 | awk '{print $2, $3}')
    http_req_failed_pct=$(grep "http_req_failed\.\." "$logfile" | head -1 | awk '{print $2}')

    echo "$scenario,$profile,$api,$avg_ms,$min_ms,$med_ms,$max_ms,$p90_ms,$p95_ms,$total_requests,\"$data_received\",$http_req_failed_pct" >> "$OUTPUT"
done

sort -t',' -k1,1 -k2,2 -k3,3 "$OUTPUT" -o "$OUTPUT"

echo "Done. CSV saved to $OUTPUT"