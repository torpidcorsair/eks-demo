// frontend.js
const express = require('express');
const app = express();
const axios = require('axios'); // Use Axios for making HTTP requests to backend

app.use(express.json());
app.use(express.static('public')); // Serve static files (e.g., your HTML, CSS, JavaScript)

app.post('/submit', async (req, res) => {
  try {
    const response = await axios.post('http://backend-service.default.svc.cluster.local/submit', req.body);
    res.send(response.data); // Forward the response from the backend to the client
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error invoking Backend API' });
  }
});

app.listen(3000, () => {
  console.log('Frontend server listening on port 3000');
});

app.get('/', (req, res) => {
  const indexHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Container API Form</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f2f2f2;
      }
      #containerIP {
        color: red; /* Make the IP address text red */
        font-weight: bold;
      }
      .container {
        max-width: 600px;
        margin: 50px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
      }
      form {
        margin-top: 20px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        color: #666;
      }
      input[type="text"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
      button {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to Hypha DevOps Kubernetes wizards Cohorts</h1>
      <h2>Enter your name here</h2>
      <form id="userForm">
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName">
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName">
        <button type="button" onclick="submitForm()">Submit</button>
      </form>
    </div>
    <div id="message" style="text-align: center; color: green; font-weight: bold;"></div>
    <script>
      async function submitForm() {
        const formData = new FormData(document.getElementById('userForm'));
        const payload = Object.fromEntries(formData);

        try {
          const response = await fetch('/submit', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data);
            document.getElementById('userForm').reset();
            document.getElementById('message').innerHTML = 'Form submitted successfully!';
          } else {
            throw new Error(\`Request failed with status \${response.status}\`);
          }
        } catch (error) {
          console.error(error);
          document.getElementById('message').innerHTML = 'Error submitting form.';
        }
      }
    </script>
  </body>
  </html>
  `;
  res.send(indexHtml);
});