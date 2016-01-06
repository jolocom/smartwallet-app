# Kickoff demo

## Testing live sensor data (WIP)

**1. Login as someone  (In this case https://localhost:8443/justas/profile/card#me)**

**2. Create temperaturate sensor resource:**

```bash
curl -k -i -XPUT -H 'Content-Type: text/turtle' --data @payload_initial.ttl https://localhost:8443/justas/little-sister/sensor
```

**3. Navigate to https://localhost:8443/#/test**

**4. Update the sensor resource first time and watch live update in the UI**

```bash
curl -k -i -XPUT -H 'Content-Type: text/turtle' --data @payload_first_update.ttl https://localhost:8443/justas/little-sister/sensor
```

**5. Update the sensor resource second time and watch live update in the UI**

```bash
curl -k -i -XPUT -H 'Content-Type: text/turtle' --data @payload_second_update.ttl https://localhost:8443/justas/little-sister/sensor
```

