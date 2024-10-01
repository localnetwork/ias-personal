const appForm = document.getElementById("application-form");
const thankYouPopup = document.querySelector(".application-thankyou");
const closeButton = thankYouPopup.querySelector(".close");

// console.log("app form", appForm);
const formFields = appForm.elements;

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to validate a single field
function validateField(field) {
  // Remove existing validation message for this field
  const formItem = field.closest(".form-item");
  const existingMessage = formItem.querySelector(".validation-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  let isValid = true;

  // Check if the field is empty
  if (field.value.trim() === "") {
    isValid = false;
    const message = document.createElement("div");
    message.className = "validation-message";
    message.style.color = "#9A0C16";
    message.style.marginTop = "8px"; // Add margin-top to the validation message
    message.innerText = `${capitalizeFirstLetter(field.name)} is required.`;

    // Append the message inside the .form-item
    if (formItem) {
      formItem.appendChild(message);
    }
  }

  // Additional validation for file input
  if (field.type === "file") {
    const previewUpload = document.querySelector(".preview-upload");
    const previewNoUpload = document.querySelector(".preview-noupload");

    if (field.files.length > 0) {
      const file = field.files[0];
      const validExtensions = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validExtensions.includes(file.type)) {
        isValid = false;
        const message = document.createElement("div");
        message.className = "validation-message";
        message.style.color = "#9A0C16";
        message.style.marginTop = "8px"; // Add margin-top to the validation message
        message.innerText = `${capitalizeFirstLetter(
          field.name
        )} must be a .docx or .pdf file.`;

        // Append the message inside the .form-item
        if (formItem) {
          formItem.appendChild(message);
        }

        // Hide preview-upload and show preview-noupload
        previewUpload.style.display = "none";
        previewNoUpload.style.display = "block";
      } else {
        // Insert filename and file size inside .preview-upload
        previewUpload.innerHTML = `Filename: ${file.name}, Size: ${(
          file.size / 1024
        ).toFixed(2)} KB`;

        // Create and append remove button
        const removeButton = document.createElement("button");
        removeButton.innerText = "Remove";
        removeButton.style.marginLeft = "10px";
        removeButton.style.backgroundColor = "#9A0C16"; // Set background color
        removeButton.style.color = "white"; // Set text color
        removeButton.style.padding = "5px 10px"; // Adjust padding
        removeButton.style.border = "none"; // Remove border
        removeButton.style.borderRadius = "3px"; // Add border radius
        removeButton.style.cursor = "pointer"; // Change cursor to pointer
        removeButton.addEventListener("click", function (e) {
          e.preventDefault(); // Prevent form submission
          field.value = ""; // Clear the file input
          previewUpload.style.display = "none";
          previewNoUpload.style.display = "flex";
        });
        previewUpload.appendChild(removeButton);

        // Show preview-upload and hide preview-noupload
        previewUpload.style.display = "block";
        previewNoUpload.style.display = "none";
      }
    } else {
      // Hide preview-upload and show preview-noupload
      previewUpload.style.display = "none";
      previewNoUpload.style.display = "flex";
    }
  }

  return isValid;
}

// Function to validate all fields
function validateFields() {
  let isValid = true;

  for (let field of formFields) {
    if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
      if (!validateField(field)) {
        isValid = false;
      }
    }
  }

  return isValid;
}

// Add event listeners to fields to validate on change/input
for (let field of formFields) {
  if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
    field.addEventListener("input", function () {
      validateField(field);
    });

    if (field.type === "file") {
      field.addEventListener("change", function () {
        validateField(field);
      });
    }
  }
}

// Validate fields on form submit
appForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (validateFields()) {
    // Show the thank you popup
    thankYouPopup.classList.remove("hidden");
    // Reset the form
    appForm.reset();
    // Hide the preview-upload and show the preview-noupload
    document.querySelector(".preview-upload").style.display = "none";
    document.querySelector(".preview-noupload").style.display = "block";
  }
});

// Add event listener to close button to hide the thank you popup
closeButton.addEventListener("click", function () {
  thankYouPopup.classList.add("hidden");
});
