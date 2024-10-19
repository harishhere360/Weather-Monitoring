<h2> Install the node <href>https://nodejs.org/en/learn/getting-started/how-to-install-nodejs</href></h2>
<p><h1>Step 1.1: Initialize Node.js Project</h1>
mkdir weather-monitoring
cd weather-monitoring
npm init -y</p>
<h2>Step 1.2: Install Required Packages</h2>
You’ll need axios for making API requests and dotenv to store your API key in an environment file:
npm install axios dotenv
<h2>Step 1.3: Create TypeScript Configuration</h2>
If you don’t have TypeScript installed yet:
npm install typescript --save-dev
npx tsc --init
<h2>Create a .env file in your root directory to store your OpenWeatherMap API key:
<href>https://home.openweathermap.org/api_keys</href></h2>
<p>OPENWEATHERMAP_API_KEY=your_api_key_here</p>
<h2>To compile and run the application</h2>
<p>
Make sure to compile your TypeScript files:
npx ts 
<h2>Run the Application
You can run the application using Node.js:
node dist/src/app.js</h2>
</p>
