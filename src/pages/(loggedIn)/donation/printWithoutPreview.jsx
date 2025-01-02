// Full React Application Code for Printing Without Preview

import React from "react";
import { jsPDF } from "jspdf";

function App() {
  const printContent = () => {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("Hello, this is a test print!", 10, 10);

    // Output the PDF as a blob
    const blob = doc.output("blob");

    // Create an invisible iframe to load the blob for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.height = "0";
    iframe.style.width = "0";
    document.body.appendChild(iframe);

    // Load the blob into the iframe and trigger the print
    iframe.src = URL.createObjectURL(blob);
    iframe.onload = () => {
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    };
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React Print Without Preview</h1>
      <button
        onClick={printContent}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Print Content
      </button>
    </div>
  );
}

export default App;
