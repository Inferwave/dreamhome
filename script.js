const formSteps = document.querySelectorAll('.form-step');
const nextBtns = document.querySelectorAll('.btn-next');
const prevBtns = document.querySelectorAll('.btn-prev');
const progress = document.getElementById('progress');
let formStepIndex = 0;

const states = {
    "Alabama": ["Birmingham", "Montgomery", "Huntsville"],
    "Alaska": ["Anchorage", "Fairbanks", "Juneau"],
    "Arizona": ["Phoenix", "Tucson", "Mesa"],
    "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville"],
    "California": ["Los Angeles", "San Francisco", "San Diego"],
    "Colorado": ["Denver", "Colorado Springs", "Aurora"],
    "Connecticut": ["Bridgeport", "New Haven", "Hartford"],
    "Delaware": ["Wilmington", "Dover", "Newark"],
    "Florida": ["Jacksonville", "Miami", "Tampa"],
    "Georgia": ["Atlanta", "Augusta", "Columbus"],
    "Hawaii": ["Honolulu", "Hilo", "Kailua"],
    "Idaho": ["Boise", "Meridian", "Nampa"],
    "Illinois": ["Chicago", "Aurora", "Naperville"],
    "Indiana": ["Indianapolis", "Fort Wayne", "Evansville"],
    "Iowa": ["Des Moines", "Cedar Rapids", "Davenport"],
    "Kansas": ["Wichita", "Overland Park", "Kansas City"],
    "Kentucky": ["Louisville", "Lexington", "Bowling Green"],
    "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport"],
    "Maine": ["Portland", "Lewiston", "Bangor"],
    "Maryland": ["Baltimore", "Frederick", "Rockville"],
    "Massachusetts": ["Boston", "Worcester", "Springfield"],
    "Michigan": ["Detroit", "Grand Rapids", "Warren", "Lansing", "Flint", "Ann Arbor", "Sterling Heights", "Dearborn", "Westland", "Troy", "Farmington Hills", "Kalamazoo", "Wyoming", "Southfield", "Rochester Hills", "Taylor", "Pontiac", "Novi", "Royal Oak", "Battle Creek", "Saginaw", "Kentwood", "Roseville", "St. Clair Shores", "Portage", "East Lansing", "Midland", "Muskegon", "Lincoln Park", "Bay City", "Jackson", "Holland", "Southgate", "Garden City", "Allen Park", "Madison Heights", "Hazel Park", "Traverse City", "Mount Clemens", "Marquette", "Port Huron"],
    "Minnesota": ["Minneapolis", "Saint Paul", "Rochester"],
    "Mississippi": ["Jackson", "Gulfport", "Southaven"],
    "Missouri": ["Kansas City", "Saint Louis", "Springfield"],
    "Montana": ["Billings", "Missoula", "Great Falls"],
    "Nebraska": ["Omaha", "Lincoln", "Bellevue"],
    "Nevada": ["Las Vegas", "Henderson", "Reno"],
    "New Hampshire": ["Manchester", "Nashua", "Concord"],
    "New Jersey": ["Newark", "Jersey City", "Paterson"],
    "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho"],
    "New York": ["New York City", "Buffalo", "Rochester"],
    "North Carolina": ["Charlotte", "Raleigh", "Greensboro"],
    "North Dakota": ["Fargo", "Bismarck", "Grand Forks"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati"],
    "Oklahoma": ["Oklahoma City", "Tulsa", "Norman"],
    "Oregon": ["Portland", "Eugene", "Salem"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown"],
    "Rhode Island": ["Providence", "Warwick", "Cranston"],
    "South Carolina": ["Charleston", "Columbia", "North Charleston"],
    "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen"],
    "Tennessee": ["Nashville", "Memphis", "Knoxville"],
    "Texas": ["Houston", "Dallas", "Austin"],
    "Utah": ["Salt Lake City", "West Valley City", "Provo"],
    "Vermont": ["Burlington", "South Burlington", "Rutland"],
    "Virginia": ["Virginia Beach", "Norfolk", "Chesapeake"],
    "Washington": ["Seattle", "Spokane", "Tacoma"],
    "West Virginia": ["Charleston", "Huntington", "Morgantown"],
    "Wisconsin": ["Milwaukee", "Madison", "Green Bay"],
    "Wyoming": ["Cheyenne", "Casper", "Laramie"]
};

// Populate states dynamically
document.addEventListener('DOMContentLoaded', () => {
    const stateSelect = document.getElementById('state');
    for (const state in states) {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    }
});

document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', function() {
        const nextButton = document.querySelector('.form-step-active .btn-next');
        const allSelects = document.querySelectorAll('.form-step-active select');
        let allSelected = true;
        allSelects.forEach(select => {
            if (!select.value) {
                allSelected = false;
            }
        });

        if (this.value) {
            this.closest('.question').nextElementSibling.classList.remove('disabled');
        }

        if (allSelected) {
            nextButton.classList.add('completed');
            nextButton.disabled = false;
        } else {
            nextButton.classList.remove('completed');
            nextButton.disabled = true;
        }
        updateProgressBarPartial();

        if (this.id === 'state') {
            const citySelect = document.getElementById('city');
            citySelect.innerHTML = '<option value="" disabled selected>Select a city</option>';
            states[this.value].sort().forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
            document.getElementById('city-not-listed-container').style.display = 'block';
        }

        if (this.id === 'working-with-agent') {
            if (this.value === 'yes') {
                document.getElementById('agent-info').style.display = 'block';
                document.getElementById('local-agent-convo').style.display = 'none';
            } else {
                document.getElementById('agent-info').style.display = 'none';
                document.getElementById('local-agent-convo').style.display = 'block';
                document.getElementById('local-agent-convo').classList.remove('disabled');
                document.getElementById('local-agent-convo-select').value = 'yes';
                document.getElementById('local-agent-convo-select').dispatchEvent(new Event('change'));
            }
        }
    });
});

document.getElementById('city-not-listed').addEventListener('change', function() {
    const citySelect = document.getElementById('city');
    const manualCityField = document.getElementById('manual-city-question');
    if (this.checked) {
        citySelect.disabled = true;
        manualCityField.style.display = 'block';
        manualCityField.classList.remove('disabled');
    } else {
        citySelect.disabled = false;
        manualCityField.style.display = 'none';
        manualCityField.classList.add('disabled');
    }
    updateProgressBarPartial();
});

document.getElementById('first-name').addEventListener('input', function() {
    const lastNameField = document.getElementById('last-name-field');
    const nextButton = document.querySelector('.form-step-active .btn-next');
    if (this.value.trim().length >= 2) {
        lastNameField.style.display = 'block';
        lastNameField.classList.remove('disabled');
        updateProgressBarPartial();
    } else {
        lastNameField.style.display = 'none';
        lastNameField.classList.add('disabled');
        updateProgressBarPartial();
    }
});

document.getElementById('last-name').addEventListener('input', function() {
    const nextButton = this.closest('.form-step').querySelector('.btn-next');
    const firstName = document.getElementById('first-name').value.trim();
    if (firstName.length >= 2 && this.value.trim().length >= 2) {
        nextButton.classList.add('completed');
        nextButton.disabled = false;
    } else {
        nextButton.classList.remove('completed');
        nextButton.disabled = true;
    }
    updateProgressBarPartial();
});

document.getElementById('email').addEventListener('input', function() {
    const nextButton = this.closest('.form-step').querySelector('.btn-next');
    if (this.value.trim().length >= 5 && validateEmail(this.value)) {
        nextButton.classList.add('completed');
        nextButton.disabled = false;
    } else {
        nextButton.classList.remove('completed');
        nextButton.disabled = true;
    }
    updateProgressBarPartial();
});

document.getElementById('phone').addEventListener('input', function() {
    const submitButton = this.closest('.form-step').querySelector('button[type="submit"]');
    let inputValue = this.value.replace(/\D/g, '');
    if (inputValue.length > 3 && inputValue.length <= 6) {
        inputValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3)}`;
    } else if (inputValue.length > 6) {
        inputValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3, 6)}-${inputValue.slice(6, 10)}`;
    } else if (inputValue.length > 3) {
        inputValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3)}`;
    } else if (inputValue.length > 0) {
        inputValue = `(${inputValue}`;
    }

    this.value = inputValue;

    if (inputValue.length === 14) {
        submitButton.classList.add('completed');
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer';
    } else {
        submitButton.classList.remove('completed');
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';
    }
    updateProgressBarPartial();
});

document.getElementById('agent-phone').addEventListener('input', function() {
    let inputValue = this.value.replace(/\D/g, '');
    if (inputValue.length > 3 && inputValue.length <= 6) {
        inputValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3)}`;
    } else if (inputValue.length > 6) {
        inputValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3, 6)}-${inputValue.slice(6, 10)}`;
    } else if (inputValue.length > 3) {
        inputValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3)}`;
    } else if (inputValue.length > 0) {
        inputValue = `(${inputValue}`;
    }

    this.value = inputValue;

    if (inputValue.length === 14) {
        this.classList.add('completed');
        document.querySelector('.form-step-active .btn-next').classList.add('completed');
        document.querySelector('.form-step-active .btn-next').disabled = false;
    } else {
        this.classList.remove('completed');
        document.querySelector('.form-step-active .btn-next').classList.remove('completed');
        document.querySelector('.form-step-active .btn-next').disabled = true;
    }
    updateProgressBarPartial();
});

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('completed')) {
            formStepIndex++;
            updateFormSteps();
            updateProgressBar();
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formStepIndex--;
        updateFormSteps();
        updateProgressBar();
    });
});

function updateFormSteps() {
    formSteps.forEach((formStep, index) => {
        if (index === formStepIndex) {
            formStep.classList.add('form-step-active');
            formStep.querySelectorAll('.question').forEach((question, i) => {
                if (i > 0) question.classList.add('disabled');
            });
        } else {
            formStep.classList.remove('form-step-active');
        }
    });
}

function updateProgressBar() {
    const totalSteps = formSteps.length;
    const progressPercent = ((formStepIndex + 1) / totalSteps) * 100;
    progress.style.width = `${progressPercent}%`;
}

function updateProgressBarPartial() {
    const activeSelects = document.querySelectorAll('.form-step-active select');
    const activeInputs = document.querySelectorAll('.form-step-active input');
    let filledFields = 0;
    let totalFields = activeSelects.length + activeInputs.length;

    activeSelects.forEach(select => {
        if (select.value) filledFields++;
    });

    activeInputs.forEach(input => {
        if (input.value.trim().length > 0) filledFields++;
    });

    const totalSteps = formSteps.length;
    const progressPercent = ((formStepIndex + (filledFields / totalFields)) / totalSteps) * 100;
    progress.style.width = `${progressPercent}%`;
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

document.getElementById('lead-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (firstName && lastName && email && phone) {
        // Assuming you have a backend service to handle the form submission
        fetch('https://your-backend-service.com/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, phone }),
        })
        .then(response => response.json())
        .then(data => {
            // Redirect to the Zillow link
            window.location.href = 'https://www.zillow.com/homedetails/5442-McLin-Dr-Kalamazoo-MI-49009/317166017_zpid/';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error('Form fields are not completely filled out');
    }
});

