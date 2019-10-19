from pyModbusTCP.client import ModbusClient
from pyModbusTCP import utils
import paho.mqtt.client as mqtt
import time

c = ModbusClient(host="192.168.1.222", port=502, auto_open=True)

client = mqtt.Client()
client.connect("127.0.0.1")
client.loop_start()


outputs = c.read_holding_registers(28680,4) #PLC says address is 428681 so, 400001 must be subtracted from address
print outputs
if outputs:
    outputs = [utils.decode_ieee(f) for f in utils.word_list_to_long(outputs,False)]
print outputs

while True:
    analogInputs = c.read_holding_registers(28672,8)
    #print analogInputs
    if analogInputs:
        analogInputs = [utils.decode_ieee(f) for f in utils.word_list_to_long(analogInputs,False)]
    i = 0    

    scaleAI = [ #scaling of analog inputs from 4 - 20 mA to engineering units
        {"m":6.25, "b":-25.0}, #4 - 20 mA to 0 - 100 degC
        {"m":6.25, "b":-25.0},
        {"m":1.0, "b":0.0},
        {"m":1.0, "b":0.0}
    ]
    for analogInput in analogInputs:
        value = analogInput / 5.0 #convert from % to mA
        scaledValue = scaleAI[i]["m"] * value + scaleAI[i]["b"]
        analogInputs[i] = scaledValue
        i = i + 1
    #print analogInputs
    client.publish('data/numeric/temperatureOffice_degC','%.02f' % analogInputs[0])
    client.publish('data/numeric/temperatureOutside_degC','%.02f' % analogInputs[1])

    time.sleep(5)

    #print(float_l)

c.close()
