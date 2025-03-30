
document.getElementById("sendBtn").addEventListener("click", function() {
  const userInput = document.getElementById("userInput").value;
  
  chrome.runtime.sendMessage({ text: userInput }, function(response) {
      document.getElementById("responseText").innerText = response.reply;
  });
});
