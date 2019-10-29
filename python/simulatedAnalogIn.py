import paho.mqtt.client as mqtt
import time
import json
import math

moduleName = 'analogIn'

channels = [
    {
        "m":{
                "description":"Channel 0 slope (m)",
                "value":1,
                "dataType":"numeric",
                "returnTopic":moduleName+"/0/m",
                "sendTopic":"setting/0/m"
            },
        "b":
            {
                "description":"Channel 0 y-intercept (b)",
                "value":0,
                "dataType":"numeric",
                "returnTopic":moduleName+"/0/b",
                "sendTopic":"setting/0/b"
            },
        "name":
            {
                "description":"Channel 0 description",
                "value":"pressureUpstream_kPa",
                "dataType":"string",
                "returnTopic":moduleName+"/0/name",
                "sendTopic":"setting/0/name"
            },
        "enabled":
            {
                "description":"Channel 0 enable",
                "value":True,
                "dataType":"boolean",
                "returnTopic":moduleName+"/0/enabled",
                "sendTopic":"setting/0/enable"
            }
    },
    {
        "m":
            {
                "description":"Channel 1 slope (m)",
                "value":1,
                "dataType":"numeric",
                "returnTopic":moduleName+"/1/m",
                "sendTopic":"setting/1/m"
            },
        "b":
            {
                "description":"Channel 1 y-intercept (b)",
                "value":0,
                "dataType":"numeric",
                "returnTopic":moduleName+"/1/b",
                "sendTopic":"setting/1/b"
            },
        "name":
            {
                "description":"Channel 1 description",
                "value":"pressureDownstream_kPa",
                "dataType":"string",
                "returnTopic":moduleName+"/1/name",
                "sendTopic":"setting/1/name"
            },
        "enabled":
            {
                "description":"Channel 1 enable",
                "value":True,
                "dataType":"boolean",
                "returnTopic":moduleName+"/1/enabled",
                "sendTopic":"setting/1/enable"
            }
    
    }
]

def on_message(client, userdata, msg):
    global channels
    global moduleName
    print(msg.topic+" "+str(msg.payload))
    topicArray = msg.topic.split('/')
    print topicArray
    if(topicArray[0]==moduleName):
        print "This is a message for this module"
        chIndex = int(topicArray[1])
        chKey = str(topicArray[2])
        print channels[chIndex][chKey]
        dataType = channels[chIndex][chKey]['dataType']
        #modified = False
        if dataType == 'numeric':
            print "is a numeric"
            channels[chIndex][chKey]['value'] = float(msg.payload)
            #modified = True
            print "modified a numeric"
        elif dataType == 'string':
            print "is a string"
            channels[chIndex][chKey]['value'] = str(msg.payload)
            #modified = True
        elif dataType == 'boolean':
            print "dataType is boolean"
            if msg.payload == 'true':
                print "payload is true"
                channels[chIndex][chKey]['value'] = True
            else:
                print "payload is false"
                channels[chIndex][chKey]['value'] = False
            #modified = True
        else:
            print "not a recognized dataType"
        #if modified:
            #print "was modified"
        print "setting changed..."
        topic = channels[chIndex][chKey]['sendTopic']
        payload = json.dumps(channels[chIndex][chKey]) 
        client.publish(topic,payload,0,True)    
        print channels[chIndex][chKey]   

client = mqtt.Client()
client.on_message = on_message
client.connect("127.0.0.1")
client.subscribe(moduleName+'/#')
client.loop_start()

for ch in channels:
    for value in ch:
        print ch[value]
        client.publish(ch[value]['sendTopic'],json.dumps(ch[value]),1,True)
x = 0
while True:
    for ch in channels:
        #print ch['enabled']
        if ch['enabled']['value']:
            newValue = (math.cos(x) * 8 + 12) * ch['m']['value'] + ch['b']['value']
            client.publish('data/numeric/'+ch['name']['value'],str(newValue),1)
    x += 0.1
    time.sleep(1)
