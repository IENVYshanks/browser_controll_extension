

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  getData(message.text).then(response => {
    sendResponse({ reply: response });
});

return true; 
});

async function getData(prompt) {
  try {
      const response = await fetch("http://127.0.0.1:8000/generate", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt: prompt })  
      });

      const data = await response.json();
      console.log("Response:", data.response);
      return data.response;
  } catch (error) {
      console.error("Error:", error);
      return "Error fetching response";
  }
}