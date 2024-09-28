# Daftar DB Mock

This is a program that generates mock data for a PostgreSQL database for a project called [Daftar](https://github.com/seifmegahed/daftar).

The mock data is generated using a JSON file called `mockData.json` which contains the structure of the database tables and their data.

A script called `populate.ts` is used to insert the mock data into the database.

This program uses `Deno` runtime and `pnpm` package manager.

## TODO

- [ ] Add starting id for each mock data
- [ ] Add script to grab latest ids' from all tables

## Usage

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies by running `pnpm install`.
3. Create a `.env` file in the project directory and add the following environment variables:

```
DATABASE_USER=your_database_user
DATABASE_HOST=your_database_host
DATABASE_NAME=your_database_name
DATABASE_PASSWORD=your_database_password
DATABASE_PORT=your_database_port
```

4. Run the `generate.ts` script by running `pnpm run generate`.
5. The mock data will be generated in the `mockData.json` file.
6. Run the `populate.ts` script by running `pnpm run populate`.
7. The mock data will be inserted into the database.

## Generating Mock Data

The `generate.ts` script uses the `faker` library to generate mock data for each table in the database. The generated data is stored in the `mockData.json` file.

## Inserting Mock Data

The `populate.ts` script uses the `pg` library to insert the mock data into the database. The script connects to the database, inserts the data, and then closes the connection.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.