# Problem Statement

Given a speed limit on a particular location, find out if a vehicle is exceeding the speed limit and if yes, calculate the fine to be imposed and sms the owner.

## Note

- Speed Limit  
    For any given location, assume the Speed limit (may be from an external API).

## Speed of the vehicle

- 2 cameras are placed at 1 km distance apart and they will capture the images of the vehicle at 2 different timestamps and store in some DB (e.g., an array of objects).

## Fine Calculation

Vehicle Type | Fine
--- | ---
2 wheeler | 200
4 wheeler | 400
Bus | 600
Truck | 800