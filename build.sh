date=$(date +"%Y-%m-%d-%HH-%MM-%SS")
filename="../releases/guarani${date}.zip"
echo "Generating release $filename..."

(cd dist && zip $filename -r .  && echo "Done.")