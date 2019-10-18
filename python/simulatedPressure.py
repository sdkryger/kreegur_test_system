import paho.mqtt.client as mqtt
import time
import random

names = ['PressureUpstream_kPa','pressureDownstream_kPa']

client = mqtt.Client()
client.connect("127.0.0.1")
client.loop_start()
while True:
    i = 1
    for name in names:
        val = i * 100 + random.random()
        client.publish('data/numeric/'+name,'%.02f' % val)
        i = i + 1
    time.sleep(0.5)
