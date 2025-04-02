
document.getElementById("sendBtn").addEventListener("click", function () {
  const userInput = document.getElementById("userInput").value;
  const fileInput = document.getElementById("fileInput").files[0]; // Assuming you have a file input element with ID "fileInput"

  // Create FormData to send both text and file
  let formData = new FormData();
  formData.append("text", userInput);
  formData.append("file", fileInput);

  // Send the FormData to the background script using chrome.runtime.sendMessage
  chrome.runtime.sendMessage({ formData: formData }, function (response) {
    document.getElementById("responseText").innerText = response.reply;
  });
});

document.getElementById("sendBtn").addEventListener("click", function () {
  const userInput = document.getElementById("userInput").value;
  const fileInput = document.getElementById("fileInput").files[0]; // Get the selected file

  const reader = new FileReader();

  reader.onload = function (event) {
      const fileContent = event.target.result.split(",")[1]; // Base64 encoded content
      const fileName = fileInput ? fileInput.name : null;
      const fileType = fileInput ? fileInput.type : null;

      chrome.runtime.sendMessage(
          { text: userInput, file: fileContent, fileName: fileName, fileType: fileType },
          function (response) {
              document.getElementById("responseText").innerText = response.reply;
          }
      );
  };

  if (fileInput) {
      reader.readAsDataURL(fileInput);
  } else {
      // If no file is selected, send only text
      chrome.runtime.sendMessage(
          { text: userInput, file: null, fileName: null, fileType: null },
          function (response) {
              document.getElementById("responseText").innerText = response.reply;
          }
      );
  }
});


