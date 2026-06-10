 // SingnUp Form

function handleSignUp() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validation
        if (!name) {
          alert('Please enter your full name');
          return;
        }
        if (!email) {
          alert('Please enter your email');
          return;
        }
        if (password.length < 6) {
          alert('Password must be at least 6 characters');
          return;
        }
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        // Create user object
        const userData = {
          id: 'user_' + Date.now(),
          name: name,
          email: email,
          createdAt: new Date().toISOString(),
          routines: [],
          streaks: [],
          feedback: []
        };

        // Store user data in localStorage
        localStorage.setItem('routineFitUser', JSON.stringify(userData));
        localStorage.setItem('routineFitUsername', name);
        localStorage.setItem('routineFitEmail', email);
        localStorage.setItem('routineFitToken', 'auth_' + Date.now());

        // Show success message
        alert('Account created successfully! Redirecting to dashboard...');

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      }

      // Allow Enter key to submit form
      document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form');
        if (form) {
          form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              handleSignUp();
            }
          });
        }
      });


      // ============================================
        // Dashboard
        // ============================================





        function initializeProfile() {
            const user = JSON.parse(localStorage.getItem('routineFitUser') || 'null');
            const username = localStorage.getItem('routineFitUsername') || (user && user.name) || 'User';

            if (!user) {
                return;
            }

            const usernameDisplay = document.getElementById('usernameDisplay');
            if (usernameDisplay) {
                usernameDisplay.innerText = `Welcome, ${username}`;
            }

            const profileUsername = document.getElementById('profileUsername');
            if (profileUsername) {
                profileUsername.textContent = `Welcome, ${username}`;
            }

            const dropdownUsername = document.getElementById('dropdownUsername');
            if (dropdownUsername) {
                dropdownUsername.textContent = `Welcome, ${username}`;
            }

            const profileAvatar = document.getElementById('profileAvatar');
            if (profileAvatar) {
                const firstName = username.split(' ')[0];
                const firstLetter = firstName.charAt(0).toUpperCase();
                profileAvatar.innerHTML = `<span style="font-size: 1.5rem; font-weight: 700;">${firstLetter}</span>`;
            }
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                // Clear user data from localStorage
                localStorage.removeItem('routineFitUser');
                
                // Redirect to sign-in page
                window.location.href = "signing.html"


            }
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const profileSection = document.querySelector('.profile-section');
            const profileMenu = document.getElementById('profileMenu');
            
            if (profileSection && !profileSection.contains(event.target) && !profileMenu.contains(event.target)) {
                closeProfileDropdown();
            }
        });

        // ============================================
        // DATA MANAGEMENT
        // ============================================

        function loadRoutineData() {
            const user = JSON.parse(localStorage.getItem('routineFitUser') || 'null');
            if (!user || !user.routines) {
                return [];
            }

            // Convert stored routines to dashboard format
            return user.routines.map(routine => ({
                date: new Date(routine.createdAt).toISOString().split('T')[0],
                completedPercent: Math.round((routine.daysCompleted.length / 7) * 100),
                checkedDays: routine.daysCompleted.length,
                mood: routine.energyLevel || 'Average',
                category: routine.category,
                goalTitle: routine.goalTitle,
                dailyAction: routine.dailyAction,
                minutesPerDay: routine.minutesPerDay,
                priority: routine.goalPriority,
                motivation: routine.goalMotivation
            }));
        }

        let charts = [];
        let currentView = 'weekly';

        // ============================================
        // DATA FILTERING & STATISTICS
        // ============================================

        function getWeeklyData() {
            const allData = loadRoutineData();
            const today = new Date();
            const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return allData.filter(d => new Date(d.date) >= sevenDaysAgo);
        }

        function getMonthlyData() {
            const allData = loadRoutineData();
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            return allData.filter(d => {
                const date = new Date(d.date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            });
        }

        function calculateStats(data) {
            if (data.length === 0) return { avg: 0, maxStreak: 0, onTrack: 0, totalRoutines: 0, streaks: 0 };

            const avgCompletion = Math.round(data.reduce((s, d) => s + d.completedPercent, 0) / data.length);
            const maxStreak = Math.max(...data.map(d => d.checkedDays));
            const onTrackDays = data.filter(d => d.completedPercent >= 60).length;
            const totalRoutines = data.length;
            const streaks = data.filter(d => d.checkedDays >= 5).length;

            return { avg: avgCompletion, maxStreak, onTrack: onTrackDays, totalRoutines, streaks };
        }

        function updateStats(data) {
            const stats = calculateStats(data);
            document.getElementById('avgCompletion').textContent = stats.avg + '%';
            document.getElementById('maxStreak').textContent = stats.maxStreak;
            document.getElementById('onTrackDays').textContent = stats.onTrack;
            document.getElementById('avgMood').textContent = stats.totalRoutines > 0 ? stats.totalRoutines : '—';
        }

        // ============================================
        // CHART RENDERING
        // ============================================

        function renderCharts(data) {
            // Destroy existing charts
            charts.forEach(c => c.destroy());
            charts = [];

            const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            const completionData = data.map(d => d.completedPercent);
            const streakData = data.map(d => d.checkedDays);
            const moodMap = { 'Low': 1, 'Average': 2, 'Good': 3, 'Very Good': 4 };
            const moodData = data.map(d => moodMap[d.mood]);

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: { font: { size: 12 }, color: '#475569', padding: 15 }
                    }
                }
            };

            // Completion Chart
            const completionCtx = document.getElementById('completionChart').getContext('2d');
            charts.push(new Chart(completionCtx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Completion %',
                        data: completionData,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    ...chartOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { color: '#64748b' },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            }));

            // Streak Chart
            const streakCtx = document.getElementById('streakChart').getContext('2d');
            charts.push(new Chart(streakCtx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Days Completed',
                        data: streakData,
                        backgroundColor: '#10b981',
                        borderRadius: 8,
                        borderSkipped: false,
                        hoverBackgroundColor: '#059669'
                    }]
                },
                options: {
                    ...chartOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 7,
                            ticks: { color: '#64748b' },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            }));

            // Mood Chart
            const moodCtx = document.getElementById('moodChart').getContext('2d');
            charts.push(new Chart(moodCtx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Mood Level',
                        data: moodData,
                        borderColor: '#ec4899',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#ec4899',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    ...chartOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 4,
                            ticks: {
                                color: '#64748b',
                                callback: function(value) {
                                    const moods = ['', 'Low', 'Average', 'Good', 'Very Good'];
                                    return moods[value] || '';
                                }
                            },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            }));

            // Category Chart
            const categoryCount = {};
            data.forEach(d => {
                categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
            });

            const categoryCtx = document.getElementById('categoryChart').getContext('2d');
            const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];
            charts.push(new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categoryCount),
                    datasets: [{
                        data: Object.values(categoryCount),
                        backgroundColor: colors.slice(0, Object.keys(categoryCount).length),
                        borderColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    ...chartOptions,
                    plugins: {
                        ...chartOptions.plugins,
                        datalabels: { color: '#fff', font: { weight: 'bold' } }
                    }
                }
            }));
        }

        // ============================================
        // TABLE RENDERING
        // ============================================

        function renderTable(data) {
            const tbody = document.getElementById('dataTable');
            tbody.innerHTML = '';

            data.forEach(entry => {
                const status = entry.completedPercent >= 60 ? 'on-track' : 'needs-work';
                const statusText = status === 'on-track' ? '✓ On Track' : '⚠ Needs Work';
                const moodClass = 'mood-' + entry.mood.toLowerCase().replace(' ', '-');

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span>${entry.completedPercent}%</span>
                            <div style="width: 100px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                                <div style="width: ${entry.completedPercent}%; height: 100%; background: ${entry.completedPercent >= 60 ? '#10b981' : '#ef4444'};"></div>
                            </div>
                        </div>
                    </td>
                    <td><strong>${entry.checkedDays}</strong>/7</td>
                    <td><span class="mood-indicator ${moodClass}">${entry.mood}</span></td>
                    <td>
                        <div>
                            <div style="font-weight: 600; color: var(--dark-blue);">${entry.category}</div>
                            <div style="font-size: 0.85rem; color: #666; margin-top: 2px;">${entry.goalTitle || 'No goal set'}</div>
                        </div>
                    </td>
                    <td><span class="badge-status badge-${status}">${statusText}</span></td>
                `;
                tbody.appendChild(row);
            });
        }

        // ============================================
        // INSIGHTS RENDERING
        // ============================================

        function renderInsights(data) {
            const insightsList = document.getElementById('insightsList');
            insightsList.innerHTML = '';

            if (data.length === 0) {
                insightsList.innerHTML = `
                    <div class="insight-item info" role="listitem">
                        <div class="insight-icon">🚀</div>
                        <div class="insight-content">
                            <div class="insight-title">Ready to Start Your Journey!</div>
                            <div class="insight-text">Complete your first routine to see personalized insights and track your progress.</div>
                        </div>
                    </div>
                `;
                return;
            }

            const insights = [];
            const avgCompletion = data.reduce((s, d) => s + d.completedPercent, 0) / data.length;
            const avgDays = data.reduce((s, d) => s + d.checkedDays, 0) / data.length;
            const totalRoutines = data.length;
            const highCompletionRoutines = data.filter(d => d.completedPercent >= 80).length;
            const streaks = data.filter(d => d.checkedDays >= 5).length;

            // Completion insights
            if (avgCompletion < 50) {
                insights.push({
                    type: 'error',
                    icon: '📉',
                    title: 'Building Momentum',
                    text: `Your average completion rate is ${Math.round(avgCompletion)}%. Start with smaller goals and gradually increase your commitment.`
                });
            } else if (avgCompletion >= 80) {
                insights.push({
                    type: 'success',
                    icon: '🎯',
                    title: 'Consistency Champion!',
                    text: `Outstanding! You're maintaining an ${Math.round(avgCompletion)}% completion rate. You're building strong habits!`
                });
            }

            // Streak insights
            if (streaks > 0) {
                insights.push({
                    type: 'success',
                    icon: '🔥',
                    title: 'Streak Master',
                    text: `You've completed ${streaks} strong weeks with 5+ days! Keep the momentum going!`
                });
            }

            // Energy level insights
            const energyLevels = data.map(d => d.mood);
            const positiveEnergy = energyLevels.filter(mood => ['Good', 'Very Good'].includes(mood)).length;
            if (positiveEnergy / energyLevels.length >= 0.7) {
                insights.push({
                    type: 'success',
                    icon: '⚡',
                    title: 'High Energy Levels',
                    text: `You're maintaining positive energy in ${Math.round((positiveEnergy/energyLevels.length)*100)}% of your routines. Great job!`
                });
            }

            // Category diversity
            const categories = {};
            data.forEach(d => {
                categories[d.category] = (categories[d.category] || 0) + 1;
            });

            if (Object.keys(categories).length >= 3) {
                insights.push({
                    type: 'success',
                    icon: '🎨',
                    title: 'Well-Balanced Routine',
                    text: `You're working on ${Object.keys(categories).length} different areas. This balanced approach supports overall well-being!`
                });
            }

            // Time commitment insights
            const avgMinutes = data.reduce((s, d) => s + (d.minutesPerDay || 0), 0) / data.length;
            if (avgMinutes > 0 && avgMinutes <= 30) {
                insights.push({
                    type: 'info',
                    icon: '⏰',
                    title: 'Smart Time Management',
                    text: `Your average daily commitment is ${Math.round(avgMinutes)} minutes. This sustainable pace helps maintain consistency.`
                });
            }

            // Priority focus
            const priorities = data.map(d => d.priority).filter(p => p);
            const highPriorityCount = priorities.filter(p => p === 'High').length;
            if (highPriorityCount > priorities.length / 2) {
                insights.push({
                    type: 'warning',
                    icon: '🎯',
                    title: 'High Priority Focus',
                    text: `Most of your routines are high priority. Consider balancing with some medium/low priority activities for sustainability.`
                });
            }

            // Render insights
            if (insights.length === 0) {
                insightsList.innerHTML = `
                    <div class="insight-item success" role="listitem">
                        <div class="insight-icon">✨</div>
                        <div class="insight-content">
                            <div class="insight-title">Great Progress!</div>
                            <div class="insight-text">You're making excellent progress with your routines. Continue this momentum for lasting change.</div>
                        </div>
                    </div>
                `;
            } else {
                insights.forEach(insight => {
                    const div = document.createElement('div');
                    div.className = `insight-item ${insight.type}`;
                    div.setAttribute('role', 'listitem');
                    div.innerHTML = `
                        <div class="insight-icon">${insight.icon}</div>
                        <div class="insight-content">
                            <div class="insight-title">${insight.title}</div>
                            <div class="insight-text">${insight.text}</div>
                        </div>
                    `;
                    insightsList.appendChild(div);
                });
            }
        }

        // ============================================
        // VIEW SWITCHING
        // ============================================

        function switchView(view) {
            currentView = view;
            const buttons = document.querySelectorAll('.btn-control');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            const data = view === 'weekly' ? getWeeklyData() : getMonthlyData();
            updateStats(data);
            renderCharts(data);
            renderTable(data);
            renderInsights(data);
        }

        // ============================================
        // DRAG & DROP FUNCTIONALITY
        // ============================================

        function initDragDrop() {
            const chartsGrid = document.getElementById('chartsGrid');
            Sortable.create(chartsGrid, {
                animation: 150,
                ghostClass: 'dragging',
                handle: '.widget-header',
                onStart: function(evt) {
                    evt.item.classList.add('dragging');
                },
                onEnd: function(evt) {
                    evt.item.classList.remove('dragging');
                }
            });
        }

        // ============================================
        // EXPORT FUNCTIONALITY
        // ============================================

        function openExportModal() {
            document.getElementById('exportModal').classList.add('show');
        }

        function closeExportModal() {
            document.getElementById('exportModal').classList.remove('show');
        }

        function exportPDF() {
            const element = document.querySelector('.dashboard-container');
            const opt = {
                margin: 10,
                filename: 'routine-progress-report.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            html2pdf().set(opt).from(element).save();
            closeExportModal();
        }

        function exportCSV() {
            const data = currentView === 'weekly' ? getWeeklyData() : getMonthlyData();
            const headers = ['Date', 'Completion %', 'Days Done', 'Mood', 'Category', 'Status'];
            const rows = data.map(d => [
                d.date,
                d.completedPercent,
                d.checkedDays,
                d.mood,
                d.category,
                d.completedPercent >= 60 ? 'On Track' : 'Needs Work'
            ]);

            let csv = headers.join(',') + '\n';
            rows.forEach(row => {
                csv += row.map(cell => `"${cell}"`).join(',') + '\n';
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'routine-progress-report.csv';
            a.click();
            closeExportModal();
        }

        function exportJSON() {
            const data = currentView === 'weekly' ? getWeeklyData() : getMonthlyData();
            const stats = calculateStats(data);
            const exportData = {
                exportDate: new Date().toISOString(),
                view: currentView,
                statistics: stats,
                data: data
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'routine-progress-report.json';
            a.click();
            closeExportModal();
        }

        // ============================================
        // MODAL CLICK OUTSIDE TO CLOSE
        // ============================================
        const el = document.getElementById('exportModal');
        if (el) {
        el.addEventListener('click', function(e) {
            if (e.target === this) {
                closeExportModal();
            }
        });
        }
      

        // ============================================
        // INITIALIZATION
        // ============================================

        function init() {
            initializeProfile();
            const initialData = getWeeklyData();
            updateStats(initialData);
            renderCharts(initialData);
            renderTable(initialData);
            renderInsights(initialData);
            initDragDrop();
        }

        // Initialize dashboard on page load only when dashboard elements exist
        if (document.getElementById('completionChart')) {
            document.addEventListener('DOMContentLoaded', init);
            window.addEventListener('load', init);
        }


    // ============================================
        // Progress
        // ============================================


         // Global variables
        let currentStep = 1;
        let selectedCategory = '';
        let routineData = {};
        let chart = null;
        let selectedRating = 0;

        // Initialize progress page only if progress elements exist
        document.addEventListener('DOMContentLoaded', function() {
            if (!document.querySelector('.routine-card')) {
                return;
            }

            const user = JSON.parse(localStorage.getItem('routineFitUser') || 'null');
            if (!user) {
                alert('Please sign up first!');
                window.location.href = 'signing.html';
                return;
            }

            initializeProfile();

            // Category selection
            document.querySelectorAll('.routine-card').forEach(card => {
                card.addEventListener('click', function() {
                    document.querySelectorAll('.routine-card').forEach(c =>                             c.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedCategory = this.dataset.type;

                    setTimeout(() => {
                        document.getElementById('categorySection').classList.add('d-none');
                        document.getElementById('stepperSection').classList.remove('d-none');
                        updateStepperProgress();
                    }, 500);
                });
            });

            // Rating stars
            document.querySelectorAll('.star').forEach(star => {
                star.addEventListener('click', function() {
                    selectedRating = parseInt(this.dataset.rating);
                    updateStarRating();
                });
            });
        });

        function updateStarRating() {
            document.querySelectorAll('.star').forEach((star, index) => {
                if (index < selectedRating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        function updateStepperProgress() {
            const steps = document.querySelectorAll('.step');
            const progressLine = document.querySelector('.stepper-header::after');

            steps.forEach((step, index) => {
                if (index + 1 < currentStep) {
                    step.classList.add('completed');
                    step.classList.remove('active');
                } else if (index + 1 === currentStep) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });

            // Update progress line width
            const progressWidth = ((currentStep - 1) / 3) * 100;
            document.querySelector('.stepper-header').style.setProperty('--progress-width', progressWidth + '%');
        }

        function nextStep() {
            if (!validateCurrentStep()) {
                return;
            }

            if (currentStep < 4) {
                currentStep++;
                showStep(currentStep);
                updateStepperProgress();

                if (currentStep === 4) {
                    updateCompletionDashboard();
                }
            }
        }

        function prevStep() {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
                updateStepperProgress();
            }
        }

        function showStep(stepNumber) {
            document.querySelectorAll('.step-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.querySelector(`.step-pane[data-step="${stepNumber}"]`).classList.add('active');
        }

        function validateCurrentStep() {
            const currentPane = document.querySelector('.step-pane.active');
            const requiredFields = currentPane.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e9ecef';
                }
            });

            if (!isValid) {
                alert('Please fill in all required fields.');
            }

            return isValid;
        }

        function toggleDay(dayNumber) {
            const checkbox = document.getElementById(`day${dayNumber}`);
            const item = checkbox.closest('.checkbox-item');

            checkbox.checked = !checkbox.checked;

            if (checkbox.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }

            if (currentStep === 3) {
                updateCompletionDashboard();
            }
        }

        function updateCompletionDashboard() {
            // Collect data from all steps
            routineData = {
                category: selectedCategory,
                goalTitle: document.getElementById('goalTitle').value,
                goalImportance: document.getElementById('goalImportance').value,
                goalPriority: document.getElementById('goalPriority').value,
                goalMotivation: document.getElementById('goalMotivation').value,
                dailyAction: document.getElementById('dailyAction').value,
                minutesPerDay: document.getElementById('minutesPerDay').value,
                bestTime: document.getElementById('bestTime').value,
                challenges: document.getElementById('challenges').value,
                support: document.getElementById('support').value,
                daysCompleted: [],
                energyLevel: document.getElementById('energyLevel').value,
                reflection: document.getElementById('reflection').value,
                createdAt: new Date().toISOString()
            };

            // Count completed days
            for (let i = 1; i <= 7; i++) {
                if (document.getElementById(`day${i}`).checked) {
                    routineData.daysCompleted.push(i);
                }
            }

            // Update displays
            document.getElementById('goalDisplay').textContent = routineData.goalTitle;
            document.getElementById('daysCompleted').textContent = routineData.daysCompleted.length;
            document.getElementById('energyDisplay').textContent = routineData.energyLevel || 'Not specified';

            // Calculate completion percentage
            const totalFields = 9; // Required fields count
            let filledFields = 0;

            if (routineData.goalTitle) filledFields++;
            if (routineData.goalImportance) filledFields++;
            if (routineData.goalPriority) filledFields++;
            if (routineData.goalMotivation) filledFields++;
            if (routineData.dailyAction) filledFields++;
            if (routineData.minutesPerDay) filledFields++;
            if (routineData.bestTime) filledFields++;
            if (routineData.daysCompleted.length > 0) filledFields++;
            if (routineData.energyLevel) filledFields++;

            const completionPercent = Math.round((filledFields / totalFields) * 100);
            document.getElementById('completionPercent').textContent = completionPercent + '%';
            document.getElementById('progressBar').style.width = completionPercent + '%';

            // Update chart
            updateChart(routineData.daysCompleted.length);

            // Update summary table
            updateSummaryTable();
        }

        function updateChart(completedDays) {
            const ctx = document.getElementById('completionChart').getContext('2d');

            if (chart) {
                chart.destroy();
            }

            chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Remaining'],
                    data: [completedDays, 7 - completedDays],
                    datasets: [{
                        data: [completedDays, 7 - completedDays],
                        backgroundColor: [selectedCategory.includes('Health') ? '#10b981' : '#6366f1', '#e5e7eb'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        function updateSummaryTable() {
            const tbody = document.getElementById('summaryTable');
            tbody.innerHTML = '';

            const summaryData = [
                { aspect: 'Goal Title', value: routineData.goalTitle, status: routineData.goalTitle ? '✅ Complete' : '❌ Missing' },
                { aspect: 'Importance', value: routineData.goalImportance.substring(0, 50) + '...', status: routineData.goalImportance ? '✅ Complete' : '❌ Missing' },
                { aspect: 'Priority', value: routineData.goalPriority, status: routineData.goalPriority ? '✅ Complete' : '❌ Missing' },
                { aspect: 'Daily Action', value: routineData.dailyAction, status: routineData.dailyAction ? '✅ Complete' : '❌ Missing' },
                { aspect: 'Time Commitment', value: routineData.minutesPerDay + ' minutes', status: routineData.minutesPerDay ? '✅ Complete' : '❌ Missing' },
                { aspect: 'Best Time', value: routineData.bestTime, status: routineData.bestTime ? '✅ Complete' : '❌ Missing' },
                { aspect: 'Days Completed', value: routineData.daysCompleted.length + '/7 days', status: routineData.daysCompleted.length > 0 ? '✅ Complete' : '❌ Missing' },
                { aspect: 'Energy Level', value: routineData.energyLevel, status: routineData.energyLevel ? '✅ Complete' : '❌ Missing' }
            ];

            summaryData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.aspect}</td>
                    <td>${item.value}</td>
                    <td>${item.status}</td>
                `;
                tbody.appendChild(row);
            });
        }

        function completeRoutine() {
            // Show congratulation modal
            document.getElementById('congratulationModal').classList.add('show');

            // Save routine data to localStorage
            saveRoutineData();
        }

        function closeCongratulationModal() {
            document.getElementById('congratulationModal').classList.remove('show');

            // Show feedback section
            document.getElementById('stepperSection').classList.add('d-none');
            document.getElementById('feedbackSection').classList.remove('d-none');
        }

        function submitFeedback() {
            if (selectedRating === 0) {
                alert('Please select a rating.');
                return;
            }

            const feedbackText = document.getElementById('feedbackText').value.trim();
            if (!feedbackText) {
                alert('Please provide your feedback.');
                return;
            }

            // Save feedback
            const feedback = {
                rating: selectedRating,
                text: feedbackText,
                submittedAt: new Date().toISOString()
            };

            const user = JSON.parse(localStorage.getItem('routineFitUser'));
            user.feedback = user.feedback || [];
            user.feedback.push(feedback);
            localStorage.setItem('routineFitUser', JSON.stringify(user));

            // Show thank you section
            document.getElementById('feedbackSection').classList.add('d-none');
            document.getElementById('thankYouSection').classList.remove('d-none');
        }

        function saveRoutineData() {
            const user = JSON.parse(localStorage.getItem('routineFitUser'));

            // Add routine to user's routines
            user.routines = user.routines || [];
            user.routines.push(routineData);

            // Add streak if completed days >= 5
            if (routineData.daysCompleted.length >= 5) {
                user.streaks = user.streaks || [];
                user.streaks.push({
                    routineId: routineData.createdAt,
                    daysCompleted: routineData.daysCompleted.length,
                    category: routineData.category,
                    completedAt: new Date().toISOString()
                });
            }

            localStorage.setItem('routineFitUser', JSON.stringify(user));
        }