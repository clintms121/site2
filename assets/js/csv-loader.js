// assets/js/csv-loader.js
document.addEventListener('DOMContentLoaded', function() {
    // Load programs data if on programs page
    if (document.getElementById('programsContainer')) {
        loadCSVData('../data/programs.csv', renderPrograms);
    }

    // Load events data if on events page
    if (document.getElementById('eventsContainer')) {
        loadCSVData('../data/events.csv', renderEvents);
    }

    // Load news data if on news page
    if (document.getElementById('newsContainer')) {
        loadCSVData('../data/news.csv', renderNews);
    }
});

/**
 * Load CSV data from a file and process it with the given callback
 * @param {string} filePath - Path to the CSV file
 * @param {function} callback - Function to process the parsed data
 */
function loadCSVData(filePath, callback) {
    // Create a new XMLHttpRequest
    const xhr = new XMLHttpRequest();
    
    // Configure it to GET the CSV file
    xhr.open('GET', filePath, true);
    
    // Set the responseType to text since we're loading a CSV
    xhr.responseType = 'text';
    
    // What to do when the file is loaded
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Parse the CSV data
            Papa.parse(xhr.response, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    // Process the parsed data with the callback
                    callback(results.data);
                },
                error: function(error) {
                    console.error('Error parsing CSV:', error);
                    showDataError();
                }
            });
        } else {
            console.error('Failed to load CSV file:', xhr.statusText);
            showDataError();
        }
    };
    
    // Handle errors
    xhr.onerror = function() {
        console.error('Error loading CSV file');
        showDataError();
    };
    
    // Send the request
    xhr.send();
}

/**
 * Render programs data to the page
 * @param {Array} programs - Array of program objects
 */
function renderPrograms(programs) {
    const container = document.getElementById('programsContainer');
    
    // Clear any existing placeholder content
    container.innerHTML = '';
    
    programs.forEach((program, index) => {
        // Determine the animation delay based on index
        const delayClass = index < 3 ? `animate__delay-${index}s` : '';
        
        const cardHtml = `
            <div class="col-lg-4 mb-4 animate__animated animate__fadeInUp ${delayClass}" data-program-type="${program.level}">
                <div class="card h-100 shadow-sm program-card">
                    <div class="card-header bg-primary text-white">
                        <h4 class="my-0">${getProgramTypeTitle(program.level)}</h4>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${program.name}</h5>
                        <p class="card-text">${program.description}</p>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-clock me-2 text-primary"></i> ${program.duration}</li>
                            <li><i class="fas fa-graduation-cap me-2 text-primary"></i> ${program.credits}</li>
                            <li><i class="fas fa-calendar me-2 text-primary"></i> ${program.admission} admission</li>
                        </ul>
                    </div>
                    <div class="card-footer bg-transparent">
                        <a href="#" class="btn btn-primary">Learn More</a>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHtml;
    });
}

/**
 * Render events data to the page
 * @param {Array} events - Array of event objects
 */
function renderEvents(events) {
    const container = document.getElementById('eventsContainer');
    
    // Clear any existing placeholder content
    container.innerHTML = '';
    
    events.forEach((event, index) => {
        // Parse the date for display
        const eventDate = new Date(`${event.date}T${event.start_time}`);
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const day = eventDate.getDate();
        const month = monthNames[eventDate.getMonth()];
        
        // Determine the animation delay based on index
        const delayClass = index < 3 ? `animate__delay-${index}s` : '';
        
        const cardHtml = `
            <div class="col-lg-4 col-md-6 animate__animated animate__fadeInUp ${delayClass}">
                <div class="card event-card h-100 shadow">
                    <div class="card-header bg-primary text-white">
                        <div class="event-date">
                            <span class="event-day">${day}</span>
                            <span class="event-month">${month}</span>
                        </div>
                        <h5 class="card-title mb-0">${event.title}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><i class="fas fa-clock me-2"></i> ${formatTime(event.start_time)} - ${formatTime(event.end_time)}</p>
                        <p class="card-text"><i class="fas fa-map-marker-alt me-2"></i> ${event.location}</p>
                        <p class="card-text">${event.description}</p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <a href="#" class="btn btn-primary">Register</a>
                        <a href="#" class="btn btn-outline-primary ms-2">Details</a>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHtml;
    });
    
    // Update FullCalendar if it exists on the page
    if (typeof FullCalendar !== 'undefined') {
        updateCalendarWithEvents(events);
    }
}

/**
 * Render news data to the page
 * @param {Array} newsItems - Array of news objects
 */
function renderNews(newsItems) {
    const container = document.getElementById('newsContainer');
    
    // Clear any existing placeholder content
    container.innerHTML = '';
    
    newsItems.forEach((news, index) => {
        // Parse the date for display
        const newsDate = new Date(news.date);
        const formattedDate = newsDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Determine badge color based on type
        const badgeClass = getNewsBadgeClass(news.type);
        const badgeText = getNewsTypeText(news.type);
        
        // Determine the animation delay based on index
        const delayClass = index < 4 ? `animate__delay-${index % 3}s` : '';
        
        const cardHtml = `
            <div class="col-lg-6 animate__animated animate__fadeInUp ${delayClass}" data-news-type="${news.type}">
                <div class="card news-card h-100 shadow">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="assets/images/${news.image}" class="img-fluid rounded-start h-100" alt="${news.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge ${badgeClass}">${badgeText}</span>
                                    <small class="text-muted">${formattedDate}</small>
                                </div>
                                <h5 class="card-title">${news.title}</h5>
                                <p class="card-text">${truncateText(news.content, 120)}</p>
                                <a href="#" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#newsModal" 
                                   data-title="${news.title}" 
                                   data-date="${formattedDate}" 
                                   data-type="${badgeText}" 
                                   data-image="assets/images/${news.image}" 
                                   data-content="${news.content}">Read More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHtml;
    });
    
    // Set up news modal event listeners
    setupNewsModals();
}

/**
 * Update FullCalendar with events data
 * @param {Array} events - Array of event objects
 */
function updateCalendarWithEvents(events) {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: events.map(event => ({
            title: event.title,
            start: `${event.date}T${event.start_time}`,
            end: `${event.date}T${event.end_time}`,
            description: event.description,
            location: event.location
        })),
        eventClick: function(info) {
            const modal = new bootstrap.Modal(document.getElementById('eventModal'));
            document.getElementById('eventModalTitle').textContent = info.event.title;
            
            let eventHtml = `
                <p><strong>Date:</strong> ${info.event.start.toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${info.event.start.toLocaleTimeString()} - ${info.event.end.toLocaleTimeString()}</p>
                <p><strong>Location:</strong> ${info.event.extendedProps.location || 'TBA'}</p>
                <p><strong>Description:</strong> ${info.event.extendedProps.description || 'No description available.'}</p>
            `;
            
            document.getElementById('eventModalBody').innerHTML = eventHtml;
            modal.show();
        }
    });
    
    calendar.render();
}

/**
 * Set up news modal event listeners
 */
function setupNewsModals() {
    const newsModal = document.getElementById('newsModal');
    if (newsModal) {
        newsModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const title = button.getAttribute('data-title');
            const date = button.getAttribute('data-date');
            const type = button.getAttribute('data-type');
            const image = button.getAttribute('data-image');
            const content = button.getAttribute('data-content');
            
            document.getElementById('newsModalTitle').textContent = title;
            
            let modalHtml = `
                <div class="row">
                    <div class="col-md-4 mb-3 mb-md-0">
                        <img src="${image}" class="img-fluid rounded" alt="${title}">
                        <div class="mt-2">
                            <span class="badge ${getNewsBadgeClass(type.toLowerCase())}">${type}</span>
                            <small class="text-muted ms-2">${date}</small>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <p>${content}</p>
                    </div>
                </div>
            `;
            
            document.getElementById('newsModalBody').innerHTML = modalHtml;
        });
    }
}

/**
 * Show an error message when data fails to load
 */
function showDataError() {
    const errorHtml = `
        <div class="col-12">
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                We're having trouble loading the data. Please try refreshing the page or check back later.
            </div>
        </div>
    `;
    
    // Try to insert in various containers
    const containers = [
        document.getElementById('programsContainer'),
        document.getElementById('eventsContainer'),
        document.getElementById('newsContainer')
    ];
    
    containers.forEach(container => {
        if (container) {
            container.innerHTML = errorHtml;
        }
    });
}

/**
 * Get the proper title for a program type
 * @param {string} type - Program type from CSV
 * @returns {string} Formatted program type title
 */
function getProgramTypeTitle(type) {
    switch (type) {
        case 'undergraduate': return 'Bachelor of Science';
        case 'graduate': return 'Master of Science';
        case 'phd': return 'PhD';
        case 'certificate': return 'Certificate';
        default: return type;
    }
}

/**
 * Format time from HH:MM to HH:MM AM/PM
 * @param {string} time - Time in HH:MM format
 * @returns {string} Formatted time
 */
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Get the proper badge class for a news type
 * @param {string} type - News type from CSV
 * @returns {string} Bootstrap badge class
 */
function getNewsBadgeClass(type) {
    switch (type) {
        case 'announcement': return 'bg-warning text-dark';
        case 'research': return 'bg-primary';
        case 'award': return 'bg-success';
        case 'student': return 'bg-info';
        default: return 'bg-secondary';
    }
}

/**
 * Get the display text for a news type
 * @param {string} type - News type from CSV
 * @returns {string} Display text
 */
function getNewsTypeText(type) {
    switch (type) {
        case 'announcement': return 'Announcement';
        case 'research': return 'Research';
        case 'award': return 'Award';
        case 'student': return 'Student News';
        default: return type;
    }
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}