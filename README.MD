<!--
This code block provides instructions on how to run a project locally on a machine.
It includes steps such as cloning the repository, navigating to the project directory, installing project dependencies, starting the development server, and opening the project in a web browser.
-->

# Running the Project

To run this project, follow these steps:

1. Clone the repository to your local machine using the following command:

   ```
   git clone https://github.com/username/repository.git
   ```

2. Navigate to the project directory:

   ```
   cd repository
   ```

3. Install the project dependencies:

   ```
   npm install
   ```

4. Configure the database in config/config.json

5. Run the migrations:

   ```
   npx sequelize db:migrate
   ```

6. Start the development server:

   ```
   npm start
   ```

7. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to view the project.

8. Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to access the API documentation

That's it! You should now be able to run the project locally on your machine.
