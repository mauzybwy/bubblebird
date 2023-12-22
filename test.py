import gzip
import requests
import datetime
from tzlocal import get_localzone
import json

soundscape_uploaded = False
firebase_url = ""

birdweather_id = "69"
current_iso8601 = "420"

model = "BirdNET_6K_GLOBAL_MODEL"
sf_thresh = 0.03


try:
    if soundscape_uploaded is False:
        # POST soundscape to server
        soundscape_url = 'https://app.birdweather.com/api/v1/stations/' + \
            birdweather_id + \
            '/soundscapes' + \
            '?timestamp=' + \
            current_iso8601

        with open(args.i, 'rb') as f:
            wav_data = f.read()
        gzip_wav_data = gzip.compress(wav_data)
        response = requests.post(
            url=soundscape_url,
            data=gzip_wav_data,
            headers={
                'Content-Type': 'application/octet-stream',
                'Content-Encoding': 'gzip'
            })
        print("Soundscape POST Response Status - ", response.status_code)
        sdata = response.json()
        soundscape_id = sdata['soundscape']['id']
        soundscape_uploaded = True

    # POST detection to server
    detection_url = "https://app.birdweather.com/api/v1/stations/" + \
        birdweather_id + "/detections"

    start_time = d.split(';')[0]
    end_time = d.split(';')[1]
    post_begin = "{ "
    now_p_start = now + datetime.timedelta(seconds=float(start_time))
    current_iso8601 = now_p_start.astimezone(get_localzone()).isoformat()
    post_timestamp = "\"timestamp\": \"" + current_iso8601 + "\","
    post_lat = "\"lat\": " + str(args.lat) + ","
    post_lon = "\"lon\": " + str(args.lon) + ","
    post_soundscape_id = "\"soundscapeId\": " + str(soundscape_id) + ","
    post_soundscape_start_time = "\"soundscapeStartTime\": " + start_time + ","
    post_soundscape_end_time = "\"soundscapeEndTime\": " + end_time + ","
    post_commonName = "\"commonName\": \"" + entry[0].split('_')[1].split("/")[0] + "\","
    post_scientificName = "\"scientificName\": \"" + entry[0].split('_')[0] + "\","

    if model == "BirdNET_GLOBAL_6K_V2.4_Model_FP16":
        post_algorithm = "\"algorithm\": " + "\"2p4\"" + ","
    else:
        post_algorithm = "\"algorithm\": " + "\"alpha\"" + ","

    post_confidence = "\"confidence\": " + str(entry[1])
    post_end = " }"

    post_json = post_begin + post_timestamp + post_lat + post_lon +\
        post_soundscape_id + post_soundscape_start_time + \
        post_soundscape_end_time + post_commonName + post_scientificName +\
        post_algorithm + post_confidence + post_end
    print(post_json)
    response = requests.post(detection_url, json=json.loads(post_json))
    print("Detection POST Response Status - ", response.status_code)
except BaseException:
    print("Cannot POST right now")
