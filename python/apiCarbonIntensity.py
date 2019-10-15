import requests
import json
import paho.mqtt.client as mqtt
import time

headers = {
  'Accept': 'application/json'
}

client = mqtt.Client()
client.connect("127.0.0.1")
client.loop_start()

while True:
    try:
        r = requests.get('https://api.carbonintensity.org.uk/intensity', params={}, headers = headers)
        response = r.json()
        print response
        print response["data"][0]["intensity"]["actual"]
        val = response["data"][0]["intensity"]["actual"]
        client.publish('data/numeric/carbonIntensity','%.02f'%val)
    except:
        print "response error"
    time.sleep(60)
