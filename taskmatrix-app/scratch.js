const { GoogleGenerativeAI } = require('@google/generative-ai');

async function list() {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBlHqVfTqWcsYbiSZ4qmJGa-7zTsE4qymk');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

list();
