import paho.mqtt.client as mqtt
import time
import random

names = ['temperatureInner_degC','temperatureOuter_degC','temperatureMiddle_degC']

client = mqtt.Client()
client.connect("127.0.0.1")
client.loop_start()
while True:
    i = 0
    for name in names:
        val = i * 10 + random.random()
        client.publish('data/numeric/'+name,'%.02f' % val)
        i = i + 1
    time.sleep(5)
