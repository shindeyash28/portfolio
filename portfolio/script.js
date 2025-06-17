// Get references to input and output elements
const input = document.getElementById("command-input");
const output = document.getElementById("output");

// User details for the terminal prompt
const userName = "root";
const hostName = "root";
const promptSymbol = "~";

// Handle commands
const handleCommand = (command) => {
  if (command === "help") {
    displayOutput("Available commands: about, education, experience, certifications, projects, technical-activities, skills, clear, resume(to download the resume)");
  } else if (command === "about") {
    displayOutput(`
    Name: Yash Suhas Shinde<br>
    Phone: +1 607-624-9047<br>
    Email: yshinde1@binghamton.edu<br>
    LinkedIn: <a href = "https://www.linkedin.com/in/shindeyash28" target="_blank">www.linkedin.com/in/shindeyash28<br>
    `);
  } else if (command === "education") {
    displayOutput(`
    Education:<br>
    - Masters, Computer Science, <a href = "https://www.binghamton.edu/" target="_blank">SUNY Binghamton</a> (May 2024)<br>
    - Bachelor of Engineering, Information Technology, <a href = "https://mu.ac.in/" target="_blank">University of Mumbai</a> (May 2022)<br>
    `);
  } else if (command === "experience") {
    displayOutput(`
    Work Experience:<br>
    - Research Intern, <a href = "https://www.binghamton.edu/" target="_blank">SUNY Binghamton</a> (July 2024 - Present)<br>
      &nbsp;&nbsp;* Improved data security by deploying and configuring Passbolt on AWS.<br>
      &nbsp;&nbsp;* Designed a customized firewall for enhanced network protection.<br>
    <br>
    - Volunteer Coach, <a href = "https://www.tracelabs.org/" target="_blank">Trace Labs</a> (Nov 2024 - Present)<br>
      &nbsp;&nbsp;* Mentored teams in OSINT challenges for missing persons cases.<br>
      &nbsp;&nbsp;* Facilitated collaboration and innovative approaches in OSINT.<br>
    `);
  } else if (command === "certifications") {
    displayOutput(`
    Certifications:<br>
    - <a href = "https://www.isc2.org/certifications/cc" target="_blank">ISC2 Certified in Cybersecurity</a> (Dec 2024)<br>
    - <a href = "https://www.comptia.org/certifications/security" target="_blank">CompTIA Security+ SY0-701</a> (Aug 2024)<br>
    - <a href = "https://www.coursera.org/professional-certificates/google-cybersecurity" target="_blank">Google Cybersecurity Professional Certificate</a> (May 2024)<br>
    - <a href = "https://www.entrylevel.net/courses/beginners-data-analyst-certification" target="_blank">Entrylevel Virtual Experience Program for Data Analyst</a> (Aug 2021)<br>
    `);
  } else if (command === "projects") {
    displayOutput(`
    Projects:<br>
    - Secure Election Booth: Designed a secure E.V. system with SSL encryption and multi-threaded communication.<br>
    - Web Proxy Server: Developed a caching proxy server, reducing response times by 25%.<br>
    - Location of New Store Detection: Optimized database queries, selected for ICATM conference presentation.<br>
    - Enterprise Network Design: Created a scalable network for a college, increasing reliability by 40%.<br>
    `);
  } else if (command === "technical-activities") {
    displayOutput(`
    Technical Activities:<br>
    - <a href = "https://www.jerseyctf.com/" target="_blank">JerseyCTF</a>: Solved challenges using Autopsy, FTK, and web log analysis.<br>
    - Homelab: Built a virtual network with pfSense, Suricata, and firewall configurations.<br>
    - SUNY Binghamton CTF Club: Engaged in cryptography, reverse engineering, and digital forensics challenges.<br>
    `);
  } else if (command === "skills") {
    displayOutput(`
    Skills:<br>
    Incident Response | Security Monitoring | SIEM Solutions | Log Management | Vulnerability Management | OpenVAS |
    Suricata | Autopsy | FTK Imager | Ghidra | AWS | Azure | Python | Java | Computer Networking | Access Control | Network
    Security | Security Policies | Threat Analysis | OSINT | Cloud Security | Firewall Configuration | Cryptography |
    Web Security | Data Security | Reverse Engineering | SOC
    `);
  } else if (command === "clear") {
    output.innerHTML = "";
  } else if (command === "resume") {
    displayOutput("Downloading resume...");

    // Create a hidden anchor element to trigger the download
    const link = document.createElement("a");
    link.href = "assets/Yash_Suhas_Shinde_0xF.pdf"; // Path to your resume
    link.download = "Yash_Suhas_Shinde_0xF.pdf";   // The name of the downloaded file
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up the DOM

    displayOutput("Resume downloaded!");
  }
};

// Display the executed command in the terminal
const displayCommand = (command) => {
  const div = document.createElement("div");
  div.textContent = `${userName}@${hostName}${promptSymbol} ${command}`;
  div.style.color = "#00FF00"; // Optional: Set the command color to mimic a terminal
  output.appendChild(div);
};

// Display output in the terminal
const displayOutput = (text) => {
  const div = document.createElement("div");
  div.innerHTML = text;
  output.appendChild(div);
};

// Event listener for the input
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const command = input.value.trim();
    if (command) {
      displayCommand(command); // Display the entered command first
      handleCommand(command); // Process the command
      input.value = ""; // Clear the input field
    }
  }
});

// Matrix rain effect
const skills = [
    "Incident Response", "Security Monitoring", "SIEM Solutions", "Log Management", "Vulnerability Management",
    "Suricata", "Autopsy", "FTK Imager", "Ghidra", "AWS", "Azure", "Python", "Java", "Cryptography", "matrix", "rain", "effect", 
    "hacker", "technology", "code", "cyber", "terminal", "hack", "data", "secure", "digital", "system", "matrix", "green", 
    "command", "password", "encryption", "security", "malware", "risk", "firewall", "Phishing", "Penetration Testing", "Red Team", 
    "Blue Team", "Endpoint Security", "DDoS Protection", "Firewalls", "Intrusion Detection Systems", "Intrusion Prevention Systems", 
    "SOC", "Threat Intelligence", "Zero-Day Exploits", "Ethical Hacking", "Blockchain", "Machine Learning", "AI Security", 
    "Cloud Security", "Digital Forensics", "Ransomware", "SSL/TLS", "Fuzzing", "Nmap", "Wireshark", "Metasploit", "Kali Linux", 
    "Splunk", "Docker", "Kubernetes", "Linux", "MacOS", "Windows", "GPG", "PowerShell", "Bash", "Snort", "Burp Suite", "OAuth", 
    "Multi-factor Authentication", "VPN", "PCI DSS", "HIPAA", "GDPR", "ISO 27001", "GDPR", "AWS Security Hub", "Penetration Testing", 
    "Web Application Security", "CVE", "CIS Benchmarks", "TTPs", "APT", "Cross-Site Scripting", "SQL Injection", "Brute Force", 
    "Reverse Engineering", "Data Loss Prevention", "Cryptanalysis", "Social Engineering", "Cloud Computing", "IPSec", "NIST", 
    "MFA", "Data Encryption", "OAuth2", "API Security", "SIEM", "CISSP", "CISA", "OSCP", "NSE", "SANS", "Threat Hunting", 
    "Vulnerability Scanning", "Privilege Escalation", "Active Directory", "LDAP", "OSINT", "DNS Security", "Packet Sniffing", 
    "Advanced Persistent Threats", "Malware Analysis", "Penetration Test Reports", "Threat Mitigation", "DevSecOps", "Cyber Defense", 
    "Network Segmentation", "Network Forensics", "System Hardening", "Incident Handling", "Security Auditing", "Secure Coding", 
    "Compliance", "Red/Blue Teaming", "Data Integrity", "Active Directory Exploits", "SQL Database Security", "Privileged Access Management"
];

  
  const createMatrixRain = () => {
    const matrixBackground = document.getElementById("matrix-background");
    const columnCount = Math.floor(window.innerWidth / 100);  // Spread the columns with a wider gap
  
    // Create columns and animate words in a line
    for (let i = 0; i < columnCount; i++) {
      const column = document.createElement("div");
      column.className = "matrix-column";
      column.style.left = `${i * 100}px`;  // Adjust the spacing between columns
      matrixBackground.appendChild(column);
  
      // Initial position of the words in the column
      let yPos = Math.random() * window.innerHeight;
      
      // Start dropping words
      setInterval(() => {
        const randomSkill = skills[Math.floor(Math.random() * skills.length)];
        const wordElement = document.createElement("span");
        wordElement.className = "matrix-word";
        wordElement.textContent = randomSkill;
        wordElement.style.top = `${yPos}px`;  // Set the initial position
  
        column.appendChild(wordElement);
  
        // Slow down the fall speed by adjusting the animation duration
        const fallDuration = Math.random() * 6 + 6;  // Slow fall speed
        wordElement.style.animationDuration = `${fallDuration}s`;  
  
        // Update yPos to make the next word fall from a new position
        yPos += 20;  // Adjust how far apart the words are vertically in the column
  
        // Remove the word after it has fallen
        setTimeout(() => {
          wordElement.remove();
        }, fallDuration * 1000);  // Keep the word for the duration of its fall
      }, Math.random() * 3000 + 3000);  // Random interval for each column (slower)
    }
  };
  
  // Initiate the Matrix effect when the page loads
  window.onload = createMatrixRain;
  

