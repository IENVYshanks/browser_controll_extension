chrome.runtime.onStartup.addListener(() => {
    chrome.sidePanel.setOptions({
        path: 'popup.html',
        enabled: true
    }).catch(error => console.error(error));

    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
        .catch(error => console.error(error));
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.text !== undefined) {
        sendFileAndTextToApi(message.text, message.file, message.fileName, message.fileType)
            .then(response => sendResponse({ reply: response }))
            .catch(error => sendResponse({ reply: "Error processing request" }));
        return true; // Keep the message channel open for async response
    }
});

async function sendFileAndTextToApi(text, fileContent, fileName, fileType) {
    try {
        let formData = new FormData();
        formData.append("text", text);

        if (fileContent && fileName && fileType) {
            // Ensure we only decode the Base64 part if it's a data URL
            let base64String = fileContent.startsWith("data:") ? fileContent.split(",")[1] : fileContent;
        
            const blob = new Blob([Uint8Array.from(atob(base64String), c => c.charCodeAt(0))], { type: fileType });
            formData.append("file", blob, fileName);
        }
        

        const response = await fetch("http://127.0.0.1:8000/process", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Response:", data.response);
        return data.response;
    } catch (error) {
        console.error("Error:", error);
        return "Error sending file and text to API";
    }
}
