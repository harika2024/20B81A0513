const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }
  const urlList = Array.isArray(urls) ? urls : [urls];
  const fetchPromises = urlList.map(async url => {
    try {
      const response = await axios.get(url);
      return response.data.numbers;
    } catch (error) {
      // Ignore failed requests
      return [];
    }
  });
  try {
    const fetchedData = await Promise.all(fetchPromises);

    const mergedNumbers = fetchedData
      .flatMap(numbers => numbers)
      .filter((number, index, self) => self.indexOf(number) === index) // Deduplicate
      .sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing data' });
  }
});

app.listen(port, () => {
  console.log(`Number Management Service listening at http://localhost:${port}`);
});