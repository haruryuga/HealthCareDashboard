function setActivePatient(patientDiv) {
  const patientElement = document.querySelectorAll(
    "#patient-container .patient"
  );
  patientElement.forEach((element) => {
    element.classList.remove("active");
  });

  patientDiv.classList.add("active");

  // Also remove 'active' class from all navbar links
  const navbarLinks = document.querySelectorAll(".navbar-link");
  navbarLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Add 'active' class to the "Patients" link
  const patientsLink = document.getElementById("fetch-patient-data");
  patientsLink.classList.add("active");
}

window.onload = function () {
  init(); // Call the init function to fetch data
  // Automatically click the "Patients" link to load patient data
  // const patientsLink = document.getElementById("fetch-patient-data");
  // patientsLink.add("active");
};

// Fetch patient data and load it into the left-aside section
function init() {
  let username = "coalition";
  let password = "skills-test";
  let auth = btoa(`${username}:${password}`);

  fetch("https://fedskillstest.coalitiontechnologies.workers.dev", {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((data) => {
      console.log(data);
      const patients = data;
      const container = document.getElementById("patient-container");

      // Clear the left-aside (patient list)
      container.innerHTML = "";

      // Dynamically create patient elements
      patients.forEach((patient, index) => {
        const patientDiv = document.createElement("div");
        patientDiv.className = "patient";
        patientDiv.dataset.index = index;
        patientDiv.innerHTML = `
            <img class="patient-photo" src="${patient.profile_picture}" alt="${patient.name}" />
            <div class="patient-details">
              <span class="patient-name">${patient.name}</span>
              <span class='patient-info'>${patient.gender}, ${patient.age}</span>
            </div>
            <img class="patient-more" src="./img/more_horiz_FILL0_wght300_GRAD0_opsz24.png" alt="More info" />
          `;

        // Append each patient to the container
        container.appendChild(patientDiv);

        // Attach click events
        patientDiv.addEventListener("click", () => {
          displayPatientData(patient);
          displayDiagnosticList(patient);
          displayLabResults(patient);
          displayDiagnosticHistory(patient);
          displayChart(patient);
          displayChartData(patient);

          setActivePatient(patientDiv);
        });
      });

      // Automatically select the first patient
      const firstPatient = container.querySelector(".patient");
      if (firstPatient) {
        firstPatient.click(); // Simulate click on the first patient
        setActivePatient(firstPatient);
      }
    })
    .catch((error) => {
      console.warn(error);
    });
}

// Function to display patient data in the top-aside
function displayPatientData(patient) {
  const topAside = document.querySelector(".top-aside");

  topAside.innerHTML = `
    <img class="big" src="${patient.profile_picture}" alt="${patient.name}" />
    <h1>${patient.name}</h1>
    <div class="patient-dd">
      <div class="patient">
        <img class="patient-photo" src="./img/BirthIcon.png" alt="Birth Icon" />
        <div class="patient-details">
          <span class="patient-name">Date Of Birth</span>
          <span class="patient-info">${new Date(
            patient.date_of_birth
          ).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="patient">
        <img class="patient-photo" src="./img/FemaleIcon.png" alt="Gender Icon" />
        <div class="patient-details">
          <span class="patient-name">Gender</span>
          <span class="patient-info">${patient.gender}</span>
        </div>
      </div>
      <div class="patient">
        <img class="patient-photo" src="./img/PhoneIcon.png" alt="Phone Icon" />
        <div class="patient-details">
          <span class="patient-name">Contact Info.</span>
          <span class="patient-info">${patient.phone_number}</span>
        </div>
      </div>
      <div class="patient">
        <img class="patient-photo" src="./img/PhoneIcon.png" alt="Emergency Contact Icon" />
        <div class="patient-details">
          <span class="patient-name">Emergency Contacts</span>
          <span class="patient-info">${patient.emergency_contact}</span>
        </div>
      </div>
      <div class="patient">
        <img class="patient-photo" src="./img/InsuranceIcon.png" alt="Insurance Icon" />
        <div class="patient-details">
          <span class="patient-name">Insurance Provider</span>
          <span class="patient-info">${patient.insurance_type}</span>
        </div>
      </div>
    </div>
    <a href="#"><h4>Show All Information</h4></a>
  `;
}

// Function to add the Diagnostic List
function displayDiagnosticList(patient) {
  const bottomSection = document.getElementById("bottom-section");

  bottomSection.innerHTML = "";

  patient.diagnostic_list.forEach((diagnostic) => {
    bottomSection.innerHTML += `
    <tr>
      <td>${diagnostic.name}</td>
      <td>${diagnostic.description}</td>
      <td>${diagnostic.status}</td>
    </tr>
  `;
  });
}

// Function to add the Lab Results
function displayLabResults(patient) {
  const bottomAside = document.getElementById("bottom-aside");

  bottomAside.innerHTML = "";

  patient.lab_results.forEach((result) => {
    bottomAside.innerHTML += `
      <div class="lab-result">
        <h5>${result}</h5>
        <img
            src="./img/download_FILL0_wght300_GRAD0_opsz24 (1).png"
            alt=""
        />
      </div>
    `;
  });
}

// Function to add the diagnostic history
function displayDiagnosticHistory(patient) {
  const topSection = document.getElementById("top-section");

  topSection.innerHTML = "";

  patient.diagnosis_history.forEach((history) => {
    topSection.innerHTML = `
      <div class="patient-detail">
        <img src="./img/respiratory rate.svg" alt="" />
        <h3>Respiratory Rate</h3>
        <h1>${history.respiratory_rate.value} bpm</h1>
        <h4>${history.respiratory_rate.levels}</h4>
      </div>
      <div class="patient-detail">
        <img src="./img/temperature.svg" alt="" />
        <h3>Temperature</h3>
        <h1>${history.temperature.value}°F</h1>
        <h4>${history.temperature.levels}</h4>
      </div>
      <div class="patient-detail">
        <img src="./img/HeartBPM.svg" alt="" />
        <h3>Heart Rate</h3>
        <h1>${history.heart_rate.value} bpm</h1>
        <div class="arrow-down">
        <span><img class="arrDown" src="./img/ArrowDown.svg" alt=""
                /></span>
        <span class="">${history.heart_rate.levels}</span>
        </div>
      </div>
    `;
  });
}

let bloodPressureChart; // Declare the chart variable outside the function

// Function to add or update the chart
async function displayChart(patient) {
  const months = [
    "Oct, 2023",
    "Nov, 2023",
    "Dec, 2023",
    "Jan, 2024",
    "Feb, 2024",
    "Mar, 2024",
  ];

  // Arrays to hold systolic and diastolic values (in the correct chronological order)
  const systolicValues = new Array(months.length).fill(null); // Initialize with null values
  const diastolicValues = new Array(months.length).fill(null); // Initialize with null values

  // Define a mapping from month names to index for the chart labels
  const monthMap = {
    October: 0,
    November: 1,
    December: 2,
    January: 3,
    February: 4,
    March: 5,
  };

  // Sort diagnosis_history by year and month
  patient.diagnosis_history.sort((a, b) => {
    // Compare year first
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    // If years are equal, compare month
    return monthMap[a.month] - monthMap[b.month];
  });

  // For each diagnosis history item, map blood pressure values to the correct month
  patient.diagnosis_history.forEach((diagnosis) => {
    const monthIndex = monthMap[diagnosis.month]; // Get the corresponding index for the month

    // Populate the systolic and diastolic values based on the month
    if (monthIndex !== undefined) {
      systolicValues[monthIndex] = diagnosis.blood_pressure.systolic.value;
      diastolicValues[monthIndex] = diagnosis.blood_pressure.diastolic.value;
    }
  });

  const ctx = document.getElementById("bloodPressureChart").getContext("2d");

  // Check if a chart already exists, and if so, destroy it before creating a new one
  if (bloodPressureChart) {
    bloodPressureChart.destroy(); // Destroy the previous chart
  }

  // Create a new chart
  bloodPressureChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: months, // X-axis labels (Months)
      datasets: [
        {
          label: "Diastolic",
          data: diastolicValues, // Diastolic values in the correct order
          borderColor: "#8C6FE6",
          pointBackgroundColor: "#8C6FE6", // Point fill color for diastolic
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 6,
        },
        {
          label: "Systolic",
          data: systolicValues, // Systolic values in the correct order
          borderColor: "#E66FD2",
          pointBackgroundColor: "#E66FD2", // Point fill color for systolic
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false, // Remove vertical grid lines
          },
        },
        y: {
          beginAtZero: false,
          min: 60,
          max: 180,
          ticks: {
            stepSize: 20,
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Remove the dataset legend
        },
      },
    },
  });
}

// Function to add chart data part
function displayChartData(patient) {
  const chartDataPart = document.getElementById("chart-data-part");

  chartDataPart.innerHTML = "";

  patient.diagnosis_history.forEach((history) => {
    chartDataPart.innerHTML = `
      <div class="c-d-block">
        <div class="c-d-block-header">
          <div class="circle"></div>
          <span>Systolic</span>
        </div>        
        <h2>${history.blood_pressure.systolic.value}</h2>
        <div class="c-d-block-footer">
          <img src="./img/ArrowUp.svg" alt="" />
          <span>${history.blood_pressure.systolic.levels}</span>
        </div>
      </div>
      <div class="c-d-block">
        <div class="c-d-block-header">
          <div class="circle"></div>
          <span>Diastolic</span>
        </div>
        <h2>${history.blood_pressure.diastolic.value}</h2>
        <div class="c-d-block-footer">
          <img src="./img/ArrowDown.svg" alt="" />
          <span>${history.blood_pressure.diastolic.levels}</span>
        </div>
      </div>        
    `;
  });
}
