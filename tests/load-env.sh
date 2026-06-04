cat > ~/rest-vs-graphql-research-paper/tests/load-env.sh << 'EOF'
#!/bin/bash
export $(grep -v '^#' ~/rest-vs-graphql-research-paper/tests/.env | xargs)
EOF