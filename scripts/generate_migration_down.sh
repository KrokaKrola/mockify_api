#!/bin/bash

# Directory to search in
SEARCH_DIR="src/infra/database/prisma/migrations/"

# Find the latest created directory
latest_dir=$(ls -td src/infra/database/prisma/migrations/*/ | head -1)

# Check if a directory was found
if [ -n "$latest_dir" ]; then
    echo "Latest directory: $latest_dir"

    # Run the npx command and write the output to the file in the latest directory
    npx prisma migrate diff \
    --from-schema-datamodel src/infra/database/prisma/schema.prisma \
    --to-schema-datasource src/infra/database/prisma/schema.prisma \
    --script > "src/infra/database/prisma/migrations/$(basename "$latest_dir")/down.sql"
else
    echo "No directories found in $SEARCH_DIR"
fi
