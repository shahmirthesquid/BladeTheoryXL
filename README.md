# BladeTheoryXL

Build log of my custom FPV drone built off an old Blade Theory XL
![image](20240919_092109.jpg)


https://www.bladehelis.com/product/theory-xl-5-fpv-bnf-basic/BLH02150.html

Archive of the above link can be found in this repo. 


## Personal Tune

![image](pid_tune_blade_theory.png)

## Parts

### Frame
Stock 4mm carbon fiber Blade Theory XL frame.

### Flight Controller
Originally a Spektrum F3 controller but was replaced with F4V3S clone from aliexpress

https://www.aliexpress.com/item/1005005407722952.html

![image](https://github.com/user-attachments/assets/6ab83be9-616e-4df2-8b6b-f217b34a00dc)

### Camera
Originally had a 700 TVL Spektrum camera. Wow this was such a bad camera. Terrible FOV and no OSD support.
Replacing with a CADDX Ratel 2. Currently waiting for it to arrive.


![image](caddx_ratel_camera.png)

### Video Transmitter (VTX) 
Stock 200mw Spektrum VTX is actually quite nice. Range is very good for 200mw. Unfortunately you have to physically turn on the VTX button every flight. 

I am replacing this with AKK Long range 3W VTX. Currently waiting for it to arrive.

https://www.aliexpress.com/item/1005006955054449.html

![image](akk_vtx.png)

### Reciever
Originally had a Spektrum SPM4649T / SH703X reciever that refused to go into bind mode.

Replaced with SpeedyBee ELRS Nano reciever from amazon

https://www.amazon.ca/dp/B0CTBWQ91P

### ESC
Stock power delivery board, and 30A BLHeli ESCS running OneShot125 protocol.

ESCs are kinda bad, but after a custom tune they were alright. They didn't seem to have the precision of more modern ESCS using DSHOT protocol. 

I have the parts to replace these, but I'd like to ride these until they die so that I dont' make ewaste.

![image](motor_settings_blade_theory.png)

### Motors
Stock 2206 size motors at 2450Kv

### GPS
Beitan BN-880 GPS unit for return to home failsafe functionality

Compass Setup:
```
resource SERIAL_TX 3 NONE
resource SERIAL_RX 3 NONE
resource I2C_SCL 2 B10
resource I2C_SDA 2 B11
set mag_bustype = I2C
set mag_i2c_device = 2
set mag_i2c_address = 0
set mag_spi_device = 0
set mag_hardware = AUTO
save
```

