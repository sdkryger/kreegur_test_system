import paho.mqtt.client as mqtt
import time
import json

state = {
    "logging":False,
    "trigger":''
}

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, rc):
    print "Connected with result code "+str(rc)
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    global state
    #print(msg.topic+" "+str(msg.payload))
    if(msg.topic == 'processor/logging'):
        print "Logging message received: "+str(msg.payload)
        message = json.loads(str(msg.payload))
        print message
        if(message["command"]=='start'):
            print "should start logging"
            state.update({"logging":True})
            state.update({"trigger":message["trigger"]})
            print state
        else:
            print "should stop logging"
            state.update({"logging":False})

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

print "will try to connect"
client.connect("127.0.0.1", 1883, 60)
client.subscribe('#')


while client.loop() == 0:
    client.publish("processor/heartbeat",json.dumps(state))
    time.sleep(1)
