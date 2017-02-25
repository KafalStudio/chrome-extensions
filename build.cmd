@echo off
pushd .
cd chrome\nse-pe-indicator
echo "Building chrome"
call npm run build
popd && pushd .
cd edge\nse-pe-indicator
echo "Building EDGE"
call npm run build
echo %cd%
