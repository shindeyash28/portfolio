// Add these at the top
const PARTICLE_COUNT = 100;
const particles = [];
let activePanel = null;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.alpha = 1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const canvas = document.getElementById('holoCanvas');
const ctx = canvas.getContext('2d');

// Game state
const state = {
    player: {
        x: 0,
        y: 0,
        size: 20,
        speed: 5
    },
    locations: [], // Will be populated in init()
    activeMainLocation: null,
    activeSubLocation: null,
    interactionCooldown: false,
    keys: {},
    expandedLocations: new Set() // Track expanded locations
};

// Initialize game
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    state.player.x = canvas.width / 2;
    state.player.y = canvas.height / 2;

    // Initialize locations with sub-locations
    state.locations = [
        { 
            type: 'experience',
            title: 'Professional Experience',
            x: canvas.width * 0.3,
            y: canvas.height * 0.3,
            subLocations: [
                {
                    title: 'Trace Labs',
                    type: 'experience',
                    details: {
                        role: 'Volunteer Coach',
                        duration: 'Nov 2024 - Present',
                        achievements: [
                            'Mentored teams in OSINT challenges',
                            'Facilitated collaboration in missing persons cases'
                        ]
                    }
                },
                {
                    title: 'SUNY Binghamton',
                    type: 'experience',
                    details: {
                        role: 'Research Intern',
                        duration: 'July 2024 - Present',
                        achievements: [
                            'Deployed Passbolt on AWS',
                            'Designed custom firewall configurations'
                        ]
                    }
                }
            ]
        },
        {
            type: 'projects',
            title: 'Key Projects',
            x: canvas.width * 0.7,
            y: canvas.height * 0.5,
            subLocations: [
                {
                    title: 'Secure Election Booth',
                    type: 'project',
                    details: {
                        description: 'SSL-encrypted EV system',
                        tech: 'Java | Multi-threading',
                        impact: '40% faster processing'
                    }
                },
                {
                    title: 'Web Proxy Server',
                    type: 'project',
                    details: {
                        description: 'Caching proxy server',
                        tech: 'Python | Socket Programming',
                        impact: '25% faster response times'
                    }
                }
            ]
        },
        // ADD CERTIFICATIONS SECTION
        { 
            type: 'certifications',
            title: 'Certifications',
            x: canvas.width * 0.3,
            y: canvas.height * 0.7,
            subLocations: [
                {
                    title: 'Security+',
                    type: 'certification',
                    details: {
                        issuer: 'CompTIA',
                        date: 'Aug 2024',
                        skills: ['Security', 'Networking', 'Threat Management']
                    }
                },
                {
                    title: 'CC',
                    type: 'certification',
                    details: {
                        issuer: 'ISC2',
                        date: 'Jan 2025',
                        skills: ['Networking', 'Troubleshooting', 'Infrastructure']
                    }
                }
            ]
        },
        // ADD TECHNICAL EXPERIENCE SECTION
        { 
            type: 'technical',
            title: 'Technical Skills',
            x: canvas.width * 0.7,
            y: canvas.height * 0.7,
            subLocations: [
                {
                    title: 'Programming Languages',
                    type: 'technical',
                    details: {
                        list: ['Python', 'Java', 'C', 'JavaScript', 'SQL']
                    }
                },
                {
                    title: 'Tools & Technologies',
                    type: 'technical',
                    details: {
                        list: ['Git', 'Docker', 'AWS', 'Wireshark', 'Metasploit']
                    }
                }
            ]
        }
    ];

    // Event listeners
    window.addEventListener('keydown', e => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key.toLowerCase())) {
            e.preventDefault();
            state.keys[e.key.toLowerCase()] = true;
        }
    });
    
    window.addEventListener('keyup', e => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key.toLowerCase())) {
            state.keys[e.key.toLowerCase()] = false;
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Update locations on resize
        if (state.locations.length >= 4) {
            state.locations[0].x = canvas.width * 0.3; // Experience
            state.locations[0].y = canvas.height * 0.3;
            state.locations[1].x = canvas.width * 0.7; // Projects
            state.locations[1].y = canvas.height * 0.5;
            state.locations[2].x = canvas.width * 0.3; // Certifications
            state.locations[2].y = canvas.height * 0.7;
            state.locations[3].x = canvas.width * 0.7; // Technical Skills
            state.locations[3].y = canvas.height * 0.7;
        }
    });
}

// Update game state
function update() {
    // Player movement (WASD and Arrows)
    if (state.keys['arrowup'] || state.keys['w']) state.player.y -= state.player.speed;
    if (state.keys['arrowdown'] || state.keys['s']) state.player.y += state.player.speed;
    if (state.keys['arrowleft'] || state.keys['a']) state.player.x -= state.player.speed;
    if (state.keys['arrowright'] || state.keys['d']) state.player.x += state.player.speed;

    // Keep player within bounds
    state.player.x = Math.max(state.player.size, Math.min(canvas.width - state.player.size, state.player.x));
    state.player.y = Math.max(state.player.size, Math.min(canvas.height - state.player.size, state.player.y));

    // Proximity detection
    state.activeMainLocation = null;
    state.activeSubLocation = null;
    
    // First check sub-locations if expanded
    if (state.expandedLocations.size > 0) {
        state.expandedLocations.forEach(mainLoc => {
            mainLoc.subLocations.forEach(subLoc => {
                const dx = state.player.x - subLoc.x;
                const dy = state.player.y - subLoc.y;
                if (Math.hypot(dx, dy) < 30) {
                    state.activeSubLocation = subLoc;
                }
            });
        });
    }
    
    // Then check main locations
    if (!state.activeSubLocation) {
        state.locations.forEach(loc => {
            const dx = state.player.x - loc.x;
            const dy = state.player.y - loc.y;
            if (Math.hypot(dx, dy) < 50) {
                state.activeMainLocation = loc;
            }
        });
    }

    // Interaction handling
    if (state.keys[' '] && !state.interactionCooldown) {
        if (state.activeSubLocation) {
            showInfoPanel(state.activeSubLocation);
        } else if (state.activeMainLocation) {
            if (state.expandedLocations.has(state.activeMainLocation)) {
                state.expandedLocations.delete(state.activeMainLocation);
            } else {
                state.expandedLocations.add(state.activeMainLocation);
            }
        }
        state.interactionCooldown = true;
        setTimeout(() => state.interactionCooldown = false, 500);
    }
}

// Draw game elements
function draw() {
    // Clear canvas with gradient
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
    );
    gradient.addColorStop(0, '#001919');
    gradient.addColorStop(1, '#000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }

    // Draw locations
    state.locations.forEach(loc => drawLocation(loc));

    // Draw player with trail
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Add particles
    if (particles.length < PARTICLE_COUNT) {
        particles.push(new Particle(
            state.player.x + (Math.random() - 0.5) * 10,
            state.player.y + (Math.random() - 0.5) * 10
        ));
    }
}

// Draw location with expansion effect
function drawLocation(loc) {
    // Draw main location
    const isExpanded = state.expandedLocations.has(loc);
    drawMainOrb(loc.x, loc.y, isExpanded);
    
    // Draw sub-locations if expanded
    if (isExpanded) {
        const angleStep = (Math.PI * 2) / loc.subLocations.length;
        
        loc.subLocations.forEach((subLoc, index) => {
            // Position sub-locations in a circle
            const angle = angleStep * index;
            subLoc.x = loc.x + Math.cos(angle) * 150;
            subLoc.y = loc.y + Math.sin(angle) * 150;
            
            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(loc.x, loc.y);
            ctx.lineTo(subLoc.x, subLoc.y);
            ctx.strokeStyle = '#0ff3';
            ctx.stroke();
            
            // Draw sub-location orb
            const isActive = state.activeSubLocation === subLoc;
            ctx.beginPath();
            ctx.arc(subLoc.x, subLoc.y, isActive ? 15 : 10, 0, Math.PI * 2);
            ctx.fillStyle = isActive ? '#0ff' : '#0ff6';
            ctx.fill();
            
            // Draw sub-location title
            ctx.fillStyle = '#0ff';
            ctx.font = '0.8em Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText(subLoc.title, subLoc.x, subLoc.y - 25);
        });
    }
}

function drawMainOrb(x, y, isExpanded) {
    ctx.beginPath();
    ctx.arc(x, y, isExpanded ? 35 : 25, 0, Math.PI * 2);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
    gradient.addColorStop(0, '#0ff');
    gradient.addColorStop(1, '#0ff3');
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 20;
    ctx.fill();
}

// Show information panel
function showInfoPanel(subLocation) {
    if (activePanel) {
        activePanel.classList.add('fade-out');
        setTimeout(() => activePanel.remove(), 500);
    }

    const panel = document.createElement('div');
    panel.className = 'info-panel';
    
    let content = '';
    switch (subLocation.type) {
        case 'experience':
            content = `
                <h4>${subLocation.title}</h4>
                <p class="detail-line">Role: ${subLocation.details.role}</p>
                <p class="detail-line">Duration: ${subLocation.details.duration}</p>
                <div class="achievements">
                    ${subLocation.details.achievements.map(a => `
                        <div class="achievement">
                            <div class="bullet">▹</div>
                            ${a}
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        case 'project':
            content = `
                <h4>${subLocation.title}</h4>
                <p class="tech-stack">${subLocation.details.tech}</p>
                <p class="description">${subLocation.details.description}</p>
                <div class="impact">Impact: ${subLocation.details.impact}</div>
            `;
            break;
        case 'certification':
            content = `
                <h4>${subLocation.title}</h4>
                <p class="detail-line">Issuer: ${subLocation.details.issuer}</p>
                <p class="detail-line">Date: ${subLocation.details.date}</p>
                <div class="skills">
                    <p>Skills:</p>
                    ${subLocation.details.skills.map(skill => `
                        <div class="skill-tag">${skill}</div>
                    `).join('')}
                </div>
            `;
        break;
            
        // ADD TECHNICAL SKILLS CASE
        case 'technical':
            content = `
                <h4>${subLocation.title}</h4>
                <div class="skills-list">
                    ${subLocation.details.list.map(item => `
                        <div class="skill-item">
                            <div class="bullet">▹</div>
                            ${item}
                        </div>
                    `).join('')}
                </div>
            `;
        break;
    }

    panel.innerHTML = `
        <button class="close-btn">✕</button>
        ${content}
    `;
    
    const closeBtn = panel.querySelector('.close-btn');
    closeBtn.onclick = () => {
        panel.classList.add('fade-out');
        setTimeout(() => panel.remove(), 500);
        activePanel = null;
    };

    document.body.appendChild(panel);
    activePanel = panel;

    // Auto-close after 7 seconds
    const autoClose = setTimeout(() => {
        if (panel.isConnected) {
            panel.classList.add('fade-out');
            setTimeout(() => panel.remove(), 500);
            activePanel = null;
        }
    }, 7000);

    // Cleanup on close
    closeBtn.addEventListener('click', () => clearTimeout(autoClose));
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
init();
gameLoop();