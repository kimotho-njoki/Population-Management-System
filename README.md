
# Population Management System
Hapi JS API for an Population Management System. <br>
The Population Management System enables users to create locations, add sub locations within those locations and populate them with residents.


## Getting Started
- Clone the repository onto your machine
- `npm install` dependencies in package.json
- Create a database and add the user, password and database name to `knex.js`
- Run the database migrations with `knex migrate:make setup`
- Run npm start to start the application
- You can use Postman to run the endpoints
- To run the tests, run `knex seeds:run` first then `npm test`. Ensure you run `knex seeds:run` if you would like to rerun the tests once more.


#### Application End points

| Resource URL | Method | Description | 
| -------------|--------|-------------|
|/auth/register| POST   | POST a single user |
|/auth/login| POST   | POST a single user |

|/locations| GET   | GET all locations |
|/locations/statistics/<:locationID>| GET   | GET a single locations population summary |
|/locations| POST   | POST a location |
|/locations/<:locationID>| PUT   | Update a specific location |
|/locations/<:locationID>| DELETE   | DELETE a specific location |

|/sublocations| GET   | GET all sublocations |
|/sublocations/<:locationID>| POST   | POST a single sublocation |
|/sublocations/<:sublocationID>| PUT    | Update a single sublocation |
|/sublocations/<:sublocationID>| DELETE   | DELETE a single sublocation |


|/residents| GET   | GET all residents |
|/residents/<:locationID>| POST   | POST a single resident |
|/residents/<:residentID>| PUT    | Update a single resident |
|/residents/<:residentID>| DELETE   | DELETE a single resident |

