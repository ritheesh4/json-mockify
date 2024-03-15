
# json-host

json-host is a lightweight Node.js server that serves JSON data from files, allowing for easy mocking of API responses during development and testing. It can be used as a standalone server or integrated into your existing Node.js projects.

Features

Serve JSON data from files as API responses.
Supports CRUD (Create, Read, Update, Delete) operations.
Configurable via a simple JSON configuration file.
Easy setup and usage.
Installation

Clone the repository:
bash
Copy code
git clone https://github.com/ritheesh4/json-host.git
Install dependencies:
bash
Copy code
npm install
Usage

Define your JSON data files in the data directory.
Configure your server settings in the config.json file.
Start the server:
bash
Copy code
npm start
Configuration

The config.json file allows you to customize various server settings:

hostname: The hostname for the server (default: "localhost").
port: The port number for the server (default: 3000).
dbFilePath: The path to the JSON data file to serve.
Example config.json:

json
Copy code
{
  "hostname": "localhost",
  "port": 3000,
  "dbFilePath": "data/db.json"
}
API Endpoints

GET /path/to/resource: Retrieve data from the specified path.
POST /path/to/resource: Create a new resource.
DELETE /path/to/resource/:id: Delete a resource by ID.
Examples

To retrieve data from a JSON file named data/db.json, make a GET request to /. For example:

bash
Copy code
curl http://localhost:3000/
Contributing

Contributions are welcome! If you have suggestions, feature requests, or bug reports, please open an issue or create a pull request.

License

This project is licensed under the MIT License - see the LICENSE file for details.

Feel free to customize this README template to fit the specific details and usage of your json-host repository.
