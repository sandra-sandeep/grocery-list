#!/bin/bash

# Function to check if Python3 is installed
check_python3() {
    if ! command -v python3 &> /dev/null; then
        echo "Python3 is not installed. Please install Python3 to proceed."
        exit 1
    fi
}

# Function to set up and activate the virtual environment
setup_and_activate_venv() {
    if [ -d ".env" ]; then
        echo "Activating existing virtual environment..."
        source .env/bin/activate
    else
        echo ".env directory does not exist. Setting up the virtual environment..."
        python3 -m venv .env
        source .env/bin/activate
        if [ -f "requirements.txt" ]; then
            echo "Installing required packages..."
            pip install -r requirements.txt
        else
            echo "requirements.txt not found. Skipping package installation."
        fi
    fi
}

# Main script execution
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
pushd "$SCRIPT_DIR" > /dev/null || { echo "Failed to change directory to script location."; exit 1; }

check_python3
setup_and_activate_venv

popd > /dev/null || { echo "Failed to return to the original directory."; exit 1; }
